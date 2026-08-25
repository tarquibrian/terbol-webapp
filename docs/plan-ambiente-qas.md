# Ambiente QAS — `qas.terbolinspira.com`

Runbook para levantar el ambiente de pruebas de **terbol-webapp** en su propio
subdominio, conectado al CMS de QA (`cmsqas.terbolinspira.com`) y completamente
aislado de producción.

Producción quedó en `terbolinspira.com` tras el cutover documentado en
[`plan-cutover-root.md`](./plan-cutover-root.md). Este ambiente **no lo toca**.

---

## Por qué esto es más simple que el `/qas` anterior

El `/qas` viejo era un **subpath** del dominio de producción, y eso arrastraba
`basePath`, los helpers `apiPath()` / `assetPath()`, y el optimizador de imágenes
desactivado por un bug de prefijos.

Un **subdominio** no necesita nada de eso: la app corre en la raíz de su propio
host. Es el mismo build que producción, con otro `.env.production`.

> **No definir `NEXT_PUBLIC_BASE_PATH` en este ambiente.** Sigue soportado en el
> código por si alguna vez hace falta, pero acá estorbaría.

---

## Arquitectura

| | Producción | QAS |
|---|---|---|
| Dominio | `terbolinspira.com` + `www` | `qas.terbolinspira.com` |
| Carpeta de la app | `C:\Terbol\webapp` | `C:\Terbol\webapp-qas` |
| Rama del repo | `main` | `qas` |
| Puerto interno | `3001` | **`3002`** |
| Servicio (nssm) | `TerbolWeb` | `TerbolWebQas` |
| Sitio IIS | `TerbolWeb` | `TerbolWebQas` |
| Carpeta del proxy | `C:\Terbol\webapp-proxy` | `C:\Terbol\webapp-qas-proxy` |
| Logs | `C:\Terbol\webapp\logs` | `C:\Terbol\webapp-qas\logs` |
| CMS | `cms.terbolinspira.com` | `cmsqas.terbolinspira.com` |
| Asesores | `/VentaPorCatalogo/PRD` | `/VentaPorCatalogo/QAS` |
| `REVALIDATE_SECRET` | el de prod | **uno propio y distinto** |
| Formulario de contacto | SMTP real | **deshabilitado** |
| Indexación | permitida | **`noindex, nofollow`** |

Aislamiento: procesos, puertos, servicios, sitios y carpetas distintos.
Rebuildear o reiniciar QAS no interrumpe producción en ningún momento.

### Lo único compartido

- El binario de Node y el servidor físico (CPU, RAM, disco).
- IIS como proceso, pero cada sitio con su config.
- La zona de Cloudflare.

---

## Fase 0 — Prerrequisitos

### 0.1 Verificar que el CMS de QA responda

`cmsqas.terbolinspira.com` ya existe como sitio IIS (ID 4, `Started`,
`C:\inetpub\wwwroot\cmsqas`). Falta confirmar que su API conteste, que el sitio
exista no alcanza.

Los endpoints reales que consume la app son `/sections/*`, `/footer` y `/products`:

```powershell
foreach ($e in '/api/sections/home','/api/footer','/api/products') {
  $qa   = curl.exe -s -o NUL -w "%{http_code}" "https://cmsqas.terbolinspira.com$e"
  $prod = curl.exe -s -o NUL -w "%{http_code}" "https://cms.terbolinspira.com$e"
  "{0,-22} qas={1}  prod={2}" -f $e, $qa, $prod
}
```

Los códigos de QAS deberían coincidir con los de producción. Además, que traigan
contenido y no un envelope vacío:

```powershell
$cmsQas  = (curl.exe -s "https://cmsqas.terbolinspira.com/api/sections/home") -join "`n"
$cmsProd = (curl.exe -s "https://cms.terbolinspira.com/api/sections/home") -join "`n"
"qas=$($cmsQas.Length) chars   prod=$($cmsProd.Length) chars"
$cmsQas.Substring(0, [Math]::Min(300, $cmsQas.Length))
```

Comparar los largos: un `200` con mucho menos contenido que producción significa
CMS levantado pero sin datos cargados.

> **Trampa de PowerShell:** no usar `$home` como nombre de variable — `$HOME` es
> de solo lectura (el perfil del usuario) y la asignación falla con
> `Cannot overwrite variable HOME`, dejando el chequeo leyendo una ruta local en
> vez de la respuesta HTTP. Mismo cuidado con `$host`, `$pwd` y `$args`.

**Si el API no responde o vuelve vacío, parar acá.** Sin datos en el CMS de QA, la
app arranca pero todas las secciones salen vacías, y se pierde tiempo buscando el
problema en el lugar equivocado.

### 0.2 DNS del subdominio

```powershell
nslookup qas.terbolinspira.com
curl.exe -s -o NUL -w "qas hoy: %{http_code}`n" -H "Host: qas.terbolinspira.com" http://localhost/
```

En Cloudflare tiene que existir un registro para `qas` apuntando al servidor y
**proxeado (nube naranja)**. Es obligatorio, no cosmético: el SSL de la zona está
en modo **Flexible** y el origen IIS no tiene certificado en el 443. Con el
registro en DNS-only, `https://qas.terbolinspira.com` no funciona.

> Además, producción manda `Strict-Transport-Security` con `includeSubDomains`,
> así que los navegadores van a exigir HTTPS en este subdominio. Con el registro
> proxeado, Cloudflare lo resuelve.

Hoy, si el DNS ya resuelve, el subdominio cae en el catch-all del
`Default Web Site` y muestra el landing Astro. Crear el sitio QAS se lo quita.

### 0.3 Puerto libre

```powershell
netstat -ano | findstr ":3002"
```

Sin salida = libre. Si estuviera ocupado, elegir otro y usarlo de forma
consistente en el servicio y en el `web.config`.

---

## Fase 1 — Repositorio

### 1.1 CSP derivado del entorno (hecho)

`src/config/security-headers.ts` tenía el origen del CMS hardcodeado
(`https://cms.terbolinspira.com`) en `connect-src`, `img-src` y `media-src`. En
QAS, cualquier pedido del navegador a `cmsqas` habría sido bloqueado por el CSP.

Ahora los orígenes se derivan de `NEXT_PUBLIC_STORAGE_URL` y `NEXT_PUBLIC_API_URL`
vía `getCmsOrigins()`, con el CMS de producción como fallback cuando el entorno no
define nada. Las rutas de imágenes remotas ya derivaban del entorno, así que no
necesitaron cambios.

### 1.2 Crear la rama `qas`

```bash
git checkout main
git pull
git checkout -b qas
git push -u origin qas
```

**Flujo de promoción:**

```
feature/*  →  qas  →  (validar en qas.terbolinspira.com)  →  main  →  producción
```

Nada llega a `main` sin haber pasado por QAS. Cuando un cambio se valida, se
mergea `qas` en `main` y ambas ramas vuelven a quedar iguales.

---

## Fase 2 — Código en el servidor

Usar la **misma URL de remote con la que ya está clonado producción**: un alias de
SSH del `~/.ssh/config` de una máquina de desarrollo no existe en el servidor.

```powershell
cd C:\Terbol\webapp
git remote -v
```

```powershell
mkdir C:\Terbol\webapp-qas
cd C:\Terbol\webapp-qas
git clone <LA-URL-DE-PRODUCCION> .
git checkout qas
git branch --show-current
node -v
npm ci
```

`git branch --show-current` tiene que decir **`qas`**. Si dice `main`, el checkout
no tomó y el ambiente correría la rama equivocada.

Es un clone independiente del de producción: cada uno en su rama, sin
interferencia. `git branch --show-current` tiene que decir `qas`.

---

## Fase 3 — Variables de entorno

Crear `C:\Terbol\webapp-qas\.env.production`.

**`REVALIDATE_SECRET`:** lo ideal es un secret propio por ambiente, pero tiene que
**coincidir con el que ya tiene configurado el CMS**. Hoy ambos CMS usan
`clave_test_123`, así que QAS lo mantiene hasta que se acuerde una rotación con el
equipo del CMS. Si vas a generar uno nuevo, primero confirmá que lo van a cargar
del otro lado; si no, el webhook rebota con 401 y el contenido solo se refresca por
el fallback de `CMS_REVALIDATE_SECONDS`.

```powershell
# Solo si se acordo rotar el secret con el equipo del CMS:
$revalidateQas = -join ((48..57)+(65..90)+(97..122) | Get-Random -Count 40 | ForEach-Object {[char]$_})
$revalidateQas
```

> Mientras el secret sea compartido entre ambientes, quien lo tenga puede disparar
> revalidaciones sobre producción y no solo sobre QAS — lo único que hoy los separa
> es la URL a la que apunta cada CMS. El impacto se limita a purgar caché (no
> expone ni modifica datos), pero es el argumento para rotarlos por separado.

```powershell
$lines = @(
  'NEXT_PUBLIC_SITE_URL=https://qas.terbolinspira.com'
  'NEXT_PUBLIC_API_URL=https://cmsqas.terbolinspira.com/api'
  'NEXT_PUBLIC_STORAGE_URL=https://cmsqas.terbolinspira.com/storage'
  'NEXT_PUBLIC_ASESOR_URL=https://www.terbolinspira.com/VentaPorCatalogo/QAS'
  'REVALIDATE_SECRET=clave_test_123'
  'CMS_REVALIDATE_SECONDS=3600'
  ''
  '# SMTP vacio a proposito: POST /api/contact responde un 500 controlado'
  '# ("Envio no configurado") y el formulario muestra el error, sin crashear.'
  '# Evita que las pruebas manden mails al buzon real de info@terbolinspira.com.'
  'SMTP_HOST='
  'SMTP_PORT=587'
  'SMTP_SECURE=false'
  'SMTP_USER='
  'SMTP_PASS='
  'CONTACT_TO='
  'CONTACT_FROM='
)
$lines | Set-Content -Path C:\Terbol\webapp-qas\.env.production -Encoding utf8
Get-Content C:\Terbol\webapp-qas\.env.production
```

Diferencias deliberadas con producción:

| Variable | Por qué |
|---|---|
| `NEXT_PUBLIC_ASESOR_URL` → `/QAS` | Los CTAs de asesores apuntan al entorno de pruebas de Venta por Catálogo, no al real. |
| `CMS_REVALIDATE_SECONDS=3600` | Fallback de 1 hora en vez de 1 día: en QA conviene que el contenido refresque rápido aunque el webhook falle. |
| `REVALIDATE_SECRET` | Hoy compartido con producción (`clave_test_123`) porque es lo que tienen cargado ambos CMS. Pendiente de rotar por ambiente cuando se acuerde con ese equipo. |
| SMTP vacío | Ver el comentario embebido. |
| **Sin `NEXT_PUBLIC_BASE_PATH`** | La app corre en la raíz de su subdominio. |

> Las `NEXT_PUBLIC_*` se compilan en el build: cambiarlas exige rebuild.

---

## Fase 4 — Build

```powershell
cd C:\Terbol\webapp-qas
$env:NEXT_DEPLOYMENT_ID = git rev-parse --short HEAD
npm run build
```

```powershell
$m = Get-Content .next\routes-manifest.json -Raw | ConvertFrom-Json
"basePath: '$($m.basePath)'"
```

Tiene que dar `''` (vacío).

### Completar el bundle standalone

⚠️ Borrar el destino y copiar el **contenido** con `\*`. `Copy-Item -Recurse` sobre
un destino existente anida la carpeta y produce 404 en `/_next/static/*`.

```powershell
$std = "C:\Terbol\webapp-qas\.next\standalone"
Remove-Item -Recurse -Force "$std\.next\static" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$std\public"       -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force "$std\.next\static" | Out-Null
New-Item -ItemType Directory -Force "$std\public"       | Out-Null
Copy-Item -Recurse -Force "C:\Terbol\webapp-qas\.next\static\*" "$std\.next\static"
Copy-Item -Recurse -Force "C:\Terbol\webapp-qas\public\*"       "$std\public"
Copy-Item -Force          "C:\Terbol\webapp-qas\.env.production" "$std\.env.production"
```

```powershell
Test-Path "$std\.next\static\chunks"; Test-Path "$std\.next\static\static"; Test-Path "$std\public"; Test-Path "$std\.env.production"; Test-Path "$std\node_modules\sharp"
```

Esperado: `True`, **`False`**, `True`, `True`, `True`.

### Prueba manual antes de crear el servicio

```powershell
cd C:\Terbol\webapp-qas\.next\standalone
$env:PORT=3002; $env:NODE_ENV="production"; $env:HOSTNAME="127.0.0.1"
node server.js
```

En otra terminal:

```powershell
curl.exe -s -o NUL -w "home:     %{http_code}`n" http://localhost:3002/
curl.exe -s -o NUL -w "products: %{http_code}`n" http://localhost:3002/products
curl.exe -s -o NUL -w "api:      %{http_code}`n" http://localhost:3002/api/products
```

`Ctrl+C` para parar antes de seguir.

---

## Fase 5 — Servicio de Windows

Mismo `node.exe` versionado que usa producción (no el symlink de nvm).

**Crear primero la carpeta de logs:** nssm crea el archivo pero **no** el
directorio. Si no existe, el servicio arranca igual pero no escribe nada, y el
ambiente queda sin diagnóstico hasta que alguien lo note.

```powershell
New-Item -ItemType Directory -Force C:\Terbol\webapp-qas\logs | Out-Null
```

```powershell
C:\Tools\nssm.exe install TerbolWebQas "C:\Users\Administrator\AppData\Local\nvm\v24.16.0\node.exe" "C:\Terbol\webapp-qas\.next\standalone\server.js"
C:\Tools\nssm.exe set TerbolWebQas AppDirectory "C:\Terbol\webapp-qas\.next\standalone"
C:\Tools\nssm.exe set TerbolWebQas AppEnvironmentExtra PORT=3002 NODE_ENV=production HOSTNAME=127.0.0.1
C:\Tools\nssm.exe set TerbolWebQas Start SERVICE_AUTO_START
C:\Tools\nssm.exe set TerbolWebQas AppStdout C:\Terbol\webapp-qas\logs\out.log
C:\Tools\nssm.exe set TerbolWebQas AppStderr C:\Terbol\webapp-qas\logs\err.log
C:\Tools\nssm.exe start TerbolWebQas
C:\Tools\nssm.exe status TerbolWebQas
```

```powershell
netstat -ano | findstr ":3002"
curl.exe -s -o NUL -w "%{http_code}`n" http://localhost:3002/
Get-ChildItem C:\Terbol\webapp-qas\logs
```

`SERVICE_RUNNING`, el puerto en `LISTENING`, `200`, y `out.log` existiendo. Si la
carpeta de logs está vacía, crearla y reiniciar el servicio.

---

## Fase 6 — Sitio IIS

```powershell
New-Item -ItemType Directory -Force C:\Terbol\webapp-qas-proxy | Out-Null
```

```powershell
@'
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <httpProtocol>
      <customHeaders>
        <add name="X-Robots-Tag" value="noindex, nofollow" />
      </customHeaders>
    </httpProtocol>
    <rewrite>
      <rules>
        <rule name="ReverseProxyToNextQas" stopProcessing="true">
          <match url="(.*)" />
          <action type="Rewrite" url="http://127.0.0.1:3002/{R:1}" />
          <serverVariables>
            <set name="HTTP_X_FORWARDED_PROTO" value="https" />
            <set name="HTTP_X_FORWARDED_HOST" value="{HTTP_HOST}" />
          </serverVariables>
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
'@ | Out-File -FilePath C:\Terbol\webapp-qas-proxy\web.config -Encoding utf8
```

> **Sin exclusiones ni redirects.** En `qas.terbolinspira.com` no vive ningún otro
> servicio, así que el proxy puede quedarse con todas las rutas. Es justamente lo
> que hacía complejo el `web.config` de producción, y acá no aplica.
>
> El `X-Robots-Tag` es el mismo mecanismo que usaba el `/qas` viejo para no
> aparecer en buscadores.

```powershell
New-Website -Name "TerbolWebQas" -Port 80 -HostHeader "qas.terbolinspira.com" -PhysicalPath "C:\Terbol\webapp-qas-proxy"
Get-Website | Format-Table Name, ID, State, PhysicalPath -AutoSize
Get-Website -Name "TerbolWebQas" | Select-Object Name, applicationPool
```

> `New-Website` no crea un app pool dedicado en este servidor: reusa uno
> existente, igual que `TerbolWeb`. Es indistinto — el sitio solo hace rewrites,
> sin código administrado. Un `Set-ItemProperty` sobre `IIS:\AppPools\TerbolWebQas`
> falla con `PathNotFound` justamente por eso, y no hay nada que corregir.

ARR y las server variables ya están habilitadas a nivel servidor desde el cutover
de producción; no hay que volver a configurarlas.

---

## Fase 7 — Verificación

```powershell
curl.exe -s -o NUL -w "por IIS: %{http_code}`n" -H "Host: qas.terbolinspira.com" http://localhost/
curl.exe -sI https://qas.terbolinspira.com | findstr /I "HTTP/ x-robots-tag cf-ray"
```

Tiene que aparecer `x-robots-tag: noindex, nofollow`.

```powershell
$qas = (curl.exe -s https://qas.terbolinspira.com/) -join "`n"
if ($qas -match '_next') { "sirve Next OK" } elseif ($qas -match '_astro') { "todavia el Astro - revisar binding" } else { "respuesta inesperada" }
if ($qas -match 'cmsqas\.terbolinspira\.com') { "apunta al CMS de QA OK" } else { "no se ve cmsqas en el HTML" }
```

```powershell
$prom = (curl.exe -s https://qas.terbolinspira.com/promoter) -join "`n"
if ($prom -match 'VentaPorCatalogo/(PRD|QAS)') { "asesores -> $($Matches[1])" } else { "no se encontro el link" }
```

Tiene que decir **`QAS`**, al revés que producción.

```powershell
curl.exe -s https://qas.terbolinspira.com/robots.txt
curl.exe -s https://qas.terbolinspira.com/sitemap.xml | Select-Object -First 5
```

Las URLs del sitemap tienen que ser de `qas.terbolinspira.com`.

> **El `robots.txt` dice `Allow: /` y está bien.** Cloudflare antepone su bloque
> gestionado (`Content-Signal`, bloqueo de bots de IA) al robots.txt de la app.
> Lo que mantiene el ambiente fuera del índice es el header
> `X-Robots-Tag: noindex, nofollow`, no el robots.txt — y esa es la combinación
> correcta: el crawler entra, lee el header y no indexa. Bloquearlo por robots.txt
> sería peor, porque nunca llegaría a leer el header.

### Que producción no se movió

```powershell
$antes = Import-Csv C:\Terbol\backups\baseline-cutover.csv
foreach ($r in $antes) {
  $p = $r.Path
  $code = curl.exe -s -o NUL -w "%{http_code}" -H "Host: terbolinspira.com" "http://localhost$p"
  "{0,-42} esperado={1,-3} ahora={2}" -f $p, $(if ($p -eq '/qas') {'301'} else {$r.Codigo}), $code
}
```

### En el navegador

- [ ] `https://qas.terbolinspira.com` carga con estilos
- [ ] Las secciones traen contenido **del CMS de QA**, no del de producción.
      Marcador rápido: el hero del CMS de QA trae el label `LÍNEA INSPIRA QAS v1`,
      que en producción no aparece. Verificable sin abrir el navegador:
      ```powershell
      $qasHtml  = (curl.exe -s https://qas.terbolinspira.com/) -join "`n"
      $prodHtml = (curl.exe -s https://terbolinspira.com/) -join "`n"
      "qas trae 'QAS v1':  $($qasHtml  -match 'QAS v1')"
      "prod trae 'QAS v1': $($prodHtml -match 'QAS v1')"
      ```
      Esperado: `True` en QAS y `False` en producción. Si prod diera `True`, los
      ambientes están cruzados y hay que revisar el `.env.production` de cada uno.
- [ ] Imágenes del CMS de QA cargan (si fallan: mirar la consola por errores de CSP)
- [ ] Productos: filtros, búsqueda y paginación
- [ ] `/about`: el formulario muestra el error controlado de envío no configurado
- [ ] Los CTAs de asesores abren `/VentaPorCatalogo/QAS`
- [ ] `https://terbolinspira.com` sigue igual, con contenido del CMS de producción

---

## Fase 8 — Webhook del CMS de QA

En el CMS `cmsqas` apuntar la revalidación a:

- URL: `https://qas.terbolinspira.com/api/revalidate`
- Header: `x-revalidate-secret` = el `REVALIDATE_SECRET` del `.env.production` de QAS

Probar el endpoint antes de tocar el CMS, con un control negativo:

```powershell
# Control negativo: debe dar 401 "Token invalido"
Invoke-RestMethod -Method Post -Uri "https://qas.terbolinspira.com/api/revalidate" -Headers @{ "x-revalidate-secret" = "no-es-el-secret" } -ContentType "application/json" -Body '{"tag":"home"}'
```

```powershell
Invoke-RestMethod -Method Post -Uri "https://qas.terbolinspira.com/api/revalidate" -Headers @{ "x-revalidate-secret" = "clave_test_123" } -ContentType "application/json" -Body '{"tag":"home"}'
```

Esperado: `success: True` con `Tag 'home' marcado para revalidación.`

> **No usar `curl.exe -d "{\"tag\":\"home\"}"` desde PowerShell 5.1:** mastica las
> comillas al pasar el argumento al ejecutable nativo y el body llega malformado.
> Como `await request.json()` está dentro del `try` de la ruta, el fallo de parseo
> cae en el `catch` genérico y devuelve un **500 "Error interno del servidor al
> revalidar"** que parece un bug de la app y no lo es. Síntoma delator: curl
> imprime el `%{http_code}` dos veces, una de ellas `000`.
>
> `Invoke-RestMethod` con el body entre comillas simples no tiene ese problema.
> Alternativa con curl: volcar el JSON a un archivo y usar `--data-binary "@archivo"`. Tags válidos: `home`, `footer`, `about`,
`success-plan`, `learn`, `help`, `promoter`, `science`, `products`, `blog`,
`sitemap`, `advisor-registration`.

> Cambiar `REVALIDATE_SECRET` **no exige rebuild**: no lleva prefijo
> `NEXT_PUBLIC_`, así que se lee en runtime. Alcanza con editar el archivo,
> copiarlo al standalone y `nssm restart TerbolWebQas`.

Publicar contenido en el CMS de QA y confirmar que se refleja en el próximo
request. Si no aparece, revisar `C:\Terbol\webapp-qas\logs\err.log`.

> Nunca cruzar los secrets ni las URLs entre ambientes: el CMS de producción
> apunta solo a `terbolinspira.com`, y el de QA solo a `qas.terbolinspira.com`.

---

## Operación diaria

### Desplegar en QAS

```powershell
cd C:\Terbol\webapp-qas
git pull
git diff HEAD@{1} --name-only | findstr package     # si lista package*, npm ci

C:\Tools\nssm.exe stop TerbolWebQas
$env:NEXT_DEPLOYMENT_ID = git rev-parse --short HEAD
npm run build

$std = "C:\Terbol\webapp-qas\.next\standalone"
Remove-Item -Recurse -Force "$std\.next\static" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$std\public"       -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force "$std\.next\static" | Out-Null
New-Item -ItemType Directory -Force "$std\public"       | Out-Null
Copy-Item -Recurse -Force "C:\Terbol\webapp-qas\.next\static\*" "$std\.next\static"
Copy-Item -Recurse -Force "C:\Terbol\webapp-qas\public\*"       "$std\public"
Copy-Item -Force          "C:\Terbol\webapp-qas\.env.production" "$std\.env.production"

C:\Tools\nssm.exe start TerbolWebQas
Start-Sleep -Seconds 3
curl.exe -s -o NUL -w "%{http_code}`n" http://localhost:3002/
```

**No hace falta parar el sitio IIS**: QAS es un ambiente de pruebas, un 502 de unos
minutos no molesta a nadie. Y producción no se entera de nada.

### Promover a producción

```bash
git checkout main
git merge qas
git push
```

Y después el procedimiento de `operacion-app.md` §A en `C:\Terbol\webapp`.

### Arrancar / detener

```powershell
C:\Tools\nssm.exe start   TerbolWebQas
C:\Tools\nssm.exe stop    TerbolWebQas
C:\Tools\nssm.exe restart TerbolWebQas
Stop-Website  -Name "TerbolWebQas"
Start-Website -Name "TerbolWebQas"
```

---

## Puntos de atención

| Tema | Detalle |
|---|---|
| CMS de QA | El sitio existe (IIS ID 4). Verificar que su API **responda y traiga datos** antes de empezar (Fase 0.1). |
| Registro DNS proxeado | Obligatorio en Cloudflare. Con SSL en Flexible y sin cert en el origen, un registro DNS-only deja el subdominio sin HTTPS. |
| Secrets por ambiente | `REVALIDATE_SECRET` distinto en cada uno. El de producción no viaja a QAS. |
| Datos del CMS | QAS apunta a `cmsqas`. Si alguna vez se lo apunta a `cms` "para probar", puede disparar revalidaciones sobre contenido real. |
| Recursos | Un segundo proceso Node en el mismo servidor que SQL Server. Vigilar RAM y CPU tras levantarlo. |
| `NEXT_PUBLIC_BASE_PATH` | No definirla acá. |
| No indexar | El `X-Robots-Tag` va en el `web.config` del proxy. Si alguna vez se reescribe ese archivo, no perderlo. |
