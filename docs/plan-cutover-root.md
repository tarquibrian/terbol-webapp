# Plan de cutover — mover la webapp de `/qas` al dominio principal

Runbook para publicar **terbol-webapp** en `https://terbolinspira.com` (root),
dejando el landing Astro actual como **respaldo** en lugar de eliminarlo.

Estado del documento: **inspección del servidor ya ejecutada** (24/08/2026). Los
comandos de abajo están ajustados a lo que realmente hay en el server, no a
supuestos. Para la operación diaria ver [`operacion-app.md`](./operacion-app.md).

---

## Objetivo

| | Antes | Después |
|---|---|---|
| Webapp (Next) | `terbolinspira.com/qas` | `terbolinspira.com` + `www` |
| Landing Astro | `terbolinspira.com` (root) | Respaldo: entra solo si se detiene el sitio IIS de la app |
| `/qas` | Aplicación IIS con proxy a node | Redirect 301 permanente a la ruta equivalente en root |
| Links de asesores | `/VentaPorCatalogo/QAS` | `/VentaPorCatalogo/PRD` |
| Resto de servicios del dominio | Servidos por `Default Web Site` | **Idénticos**, servidos por `TerbolWeb` |

### Decisiones tomadas

1. **Un solo slot.** Se reusa `C:\Terbol\webapp` y el servicio `TerbolWeb` (puerto 3001).
2. **Failover manual.** `Stop-Website TerbolWeb` devuelve el tráfico al Astro al
   instante; `Start-Website TerbolWeb` vuelve a la app.
3. **`/qas` se retira.** Queda como redirect. El soporte de `basePath` se conserva
   en el código por si más adelante hace falta otro ambiente.
4. **Paridad total para lo ajeno.** El cutover no debe cambiar el comportamiento de
   ningún otro servicio del dominio. Ver Fase 3.

### Propiedad importante de este orden

El rebuild se hace **mientras el público sigue viendo el Astro en root**. El sitio
IIS se enciende recién cuando la app ya está verificada. Por eso:

- **El dominio principal no tiene downtime durante el cutover.**
- La única ventana afectada es `/qas`, que queda roto unos minutos entre el rebuild
  y el encendido del sitio.

---

## Estado verificado del servidor

### Sitios IIS

| Sitio | ID | Estado | Binding | PhysicalPath |
|---|---|---|---|---|
| `Default Web Site` | 1 | Started | `*:80:` (catch-all) | `%SystemDrive%\inetpub\wwwroot` (Astro) |
| `cms.terbolinspira.com` | 2 | Started | `*:80:cms.terbolinspira.com` | `C:\inetpub\wwwroot\cms` |
| `TerbolWeb` | 3 | **Stopped** | `*:80:terbolinspira.com` + `*:80:www.terbolinspira.com` | `C:\Terbol\webapp-proxy` |

> **El sitio `TerbolWeb` ya existe**, detenido, con los bindings correctos y un
> `web.config` de proxy funcional. El cutover fue preparado antes y revertido. La
> Fase 3 corrige y completa lo que hay; no crea nada desde cero.

### Cómo está montado `/qas`

Aplicación IIS `/qas` bajo `Default Web Site` → `C:\inetpub\wwwroot\qas`, cuyo
`web.config` reescribe todo a `http://127.0.0.1:3001{REQUEST_URI}` (por eso node
recibe el prefijo y el `basePath` funciona) y agrega
`X-Robots-Tag: noindex, nofollow`.

Consecuencias:

- **El ambiente `/qas` nunca fue indexable.** No hay URLs que consolidar en Google;
  los 301 sirven para bookmarks y links compartidos, no para SEO.
- La limpieza es un `Remove-WebApplication`, sin tocar el `web.config` del Astro
  (que solo tiene el mimeMap de `.webp`).
- En esa carpeta hay un **`qas.rar` de 30 MB**. Verificado: da 404 (la regla de
  rewrite lo intercepta antes que el handler de estáticos). Se borra en la Fase 7.

### El riesgo central: las 19 aplicaciones del `Default Web Site`

`Default Web Site` es el catch-all y de él cuelgan las apps de Venta por Catálogo y
los servicios. **Hoy responden por `terbolinspira.com` porque el catch-all atiende
ese host.** Al encender `TerbolWeb`, el binding con host header le gana y esas
rutas dejan de pasar por `Default Web Site`.

Tráfico medido en los logs de `W3SVC1` (3 días, 18.933 líneas):

| Ruta | Requests | Referers vía dominio | App pool | Registrada en `TerbolWeb` | Excluida del proxy |
|---|---|---|---|---|---|
| `/VentaPorCatalogo/PRD` | 2812 | sí | `VentaCatalogoPRD` | ✅ sí | ✅ sí |
| `/VentaPorCatalogo/QAS` | 224 | sí | `VentaCatalogoQAS` | ❌ **falta** | ✅ sí |
| `/ServicioVPC/PRD` | ~67 | — | `DefaultAppPool` | ✅ sí | ✅ sí |
| `/ServicioVPC/QAS` | ~18 | — | `DefaultAppPool` | ❌ **falta** | ✅ sí |
| `/ServicioECO/QAS` | 53 | sí | `DefaultAppPool` | ❌ **falta** | ❌ **falta** |
| `/ServicioECO/PRD` | ~5 | — | `DefaultAppPool` | ❌ **falta** | ❌ **falta** |
| `/VentaPorCatalogoApi/*` | 12 | **sí, vía Cloudflare** (integración externa con RestSharp) | `VentaCatalogoPRDApi` / `VentaCatalogoQASApi` | ❌ **falta** | ❌ **falta** |
| `/VentaCatalogo`, `/ServicioN8N`, `/ecommerce` | 0 | — | `DefaultAppPool` | no | ❌ **falta** |
| `/qas` | 180 | sí | `DefaultAppPool` | no (a propósito) | no (va a 301) |

El `web.config` actual de `TerbolWeb` excluye del proxy solo dos prefijos:

```
^/VentaPorCatalogo(/|$)
^/ServicioVPC(/|$)
```

Dos huecos:

1. **`^/VentaPorCatalogo(/|$)` no cubre `/VentaPorCatalogoApi`.** Después del
   literal viene una `A`, que no es `/` ni fin de cadena. Encender el sitio hoy
   dejaría a la app de asesores **sin su API**.
2. `ServicioECO` no está contemplado, y tiene 58 requests con referer del dominio.

Además, el patrón usa `(/|$)` pero `{REQUEST_URI}` incluye el query string, así que
`/VentaPorCatalogo?x=1` tampoco matchea. Se corrige con `([/?]|$)`.

> **Nota sobre herencia:** las reglas de rewrite del sitio se heredan a las
> aplicaciones hijas. Aunque una app esté registrada en `TerbolWeb`, la regla
> `(.*)` le robaría el request si no está excluida. Y no se puede arreglar tocando
> el `web.config` de esas apps: comparten carpeta física con `Default Web Site` y el
> cambio afectaría a ambos sitios. Por eso **la exclusión va sí o sí en la regla**.

### Ruido de fondo en los logs (sin acción)

`wp-admin`, `wp-content`, `admin.php`, `.env`, `1.php`, `file.php`,
`this_is_a_new_hello_world.php`, `SDK/webLanguage` (~600 requests) son escaneos
automatizados buscando WordPress y cámaras IP. No hay nada de eso instalado; hoy
dan 404 contra el Astro y después darán 404 contra Next. Sin impacto en el cutover.

---

## ⛔ Qué NO se toca

| Servicio | Regla |
|---|---|
| `Default Web Site` y sus 19 aplicaciones | No cambiar contenido, app pools ni `web.config`. Único cambio permitido: **agregar** el binding loopback `127.0.0.1:8080` (ver 3.1-bis), que es aditivo y reversible. Lo único nuestro ahí es la app `/qas`, que se retira en la Fase 7. |
| Carpetas físicas de las apps ajenas (`C:\inetpub\wwwroot\VentaPorCatalogo`, `ServicioVPC`, `ServicioECO`, `VentaPorCatalogoApi`, …) | **Solo lectura.** Están compartidas entre dos sitios: cualquier edición impacta a los dos. |
| Sitio del CMS (`cms.terbolinspira.com`) | Intocable, salvo la URL del webhook (Fase 6). |
| App pools `VentaCatalogoPRD`, `VentaCatalogoQAS`, `VentaCatalogoPRDApi`, `VentaCatalogoQASApi`, `DefaultAppPool` | No modificar configuración ni reciclarlos. Solo se **referencian** al registrar aplicaciones. |
| Laragon (Apache `:81`, MySQL `:3306`, MailHog), app .NET en `C:\App`, jobs de SQL Server en `C:\Terbol\TerbolInspira` | Intocables. |
| Cloudflare SSL/TLS | Se mantiene en **Flexible**. Subirlo a Full rompe (IIS no tiene cert 443). |
| Puerto 3001 | Sin cambios. |

> ⚠️ **Nunca correr `iisreset`.** Reinicia *todos* los sitios, incluido el CMS y las
> apps de asesores. Usar siempre `Stop-Website` / `Start-Website` por sitio.

---

## Fase 1 — Cambios en el repositorio

Se hacen en local, se prueban, se commitean y se pushean. **Ninguno rompe el
ambiente `/qas` actual**, así que se pueden mergear antes del cutover.

### 1.1 `next.config.ts` — redirect permanente de `/qas`

Agregar dentro de `nextConfig`, junto a `headers()`:

```ts
  // Tras el cutover a root, /qas/* queda como redirect permanente a la ruta
  // equivalente (bookmarks y links compartidos; el ambiente nunca fue indexable).
  // Solo aplica cuando NO hay basePath: bajo un subpath el source se resolveria
  // como /qas/qas.
  async redirects() {
    if (basePath) return [];
    return [
      { source: "/qas", destination: "/", permanent: true },
      { source: "/qas/:path*", destination: "/:path*", permanent: true },
    ];
  },
```

Es redundante con la regla de IIS (Fase 3) a propósito: la de IIS responde aunque
node esté caído; la de Next sobrevive a cualquier reconfiguración del proxy.

> **Por qué la URL absoluta con `https://`:** con una ruta relativa (`/{R:2}`),
> IIS arma el `Location` usando el esquema del request — que en el origen es HTTP,
> porque Cloudflare termina el TLS. El redirect quedaba apuntando a `http://`, con
> un salto extra y el riesgo de que un visitante navegue en texto plano si
> "Always Use HTTPS" no está activo. `{HTTP_HOST}` conserva el host original, así
> que quien entra por `www` se queda en `www`.
>
> **301 vs 308:** la regla de IIS emite un **301** y la de Next un **308**
> (`permanent: true` en Next siempre genera 308, que conserva el método HTTP).
> Los buscadores tratan ambos igual. Como IIS resuelve primero, lo que se observa
> desde el dominio es **301**; el 308 solo aparecería si se quitara la regla de IIS.

### 1.2 `.env.example` — documentar las dos variables que faltan

`NEXT_PUBLIC_BASE_PATH` y `NEXT_PUBLIC_ASESOR_URL` se usan en producción pero no
están en la plantilla:

```
# Subpath opcional del despliegue (ej. /qas). Vacio = la app corre en root.
# Se compila en el build: cambiarlo exige rebuild.
NEXT_PUBLIC_BASE_PATH=

# App externa de Venta por Catalogo (registro/login de asesores).
# Por defecto el codigo apunta a PRD; definirla solo para apuntar a otro entorno.
NEXT_PUBLIC_ASESOR_URL=https://www.terbolinspira.com/VentaPorCatalogo/PRD
```

### 1.3 Documentación

- `docs/operacion-app.md`: el ejemplo de verificación usa `http://localhost/qas/promoter`
  → cambiar a `http://localhost/promoter`; incorporar el procedimiento de
  actualización del final de este documento; sumar la **regla de convivencia** (ver
  Fase 7.3).
- `docs/arquitectura-cache.md` (línea ~243): mismo cambio en el curl de ejemplo.
- `docs/deploy-windows-iis.md`: hoy describe un cutover a root que nunca quedó así.
  Actualizarlo al estado real post-cutover (Fase 7).

### 1.4 Redirects de URLs viejas del Astro

El Astro sirve hoy `/`, `/robots.txt`, `/sitemap.xml`, favicons y `/_astro/*`. No se
detectaron subrutas de contenido con tráfico, así que **no hacen falta redirects
adicionales**. Si al revisar el sitio aparece alguna página con URL propia, sumarla:

```ts
      { source: "/ruta-vieja-del-astro", destination: "/ruta-nueva", permanent: true },
```

### 1.5 Verificación local

```bash
npm run test && npm run lint && ./node_modules/.bin/tsc --noEmit && npm run build
```

Probar además con el basePath puesto, para confirmar que `/qas` sigue sano hasta el
día del cutover:

```bash
NEXT_PUBLIC_BASE_PATH=/qas NEXT_PUBLIC_SITE_URL=https://terbolinspira.com/qas npm run build
```

### 1.6 Commit

```bash
git add -A && git commit -m "feat(deploy): redirect /qas to root and document base path"
```

---

## Fase 2 — Respaldo y línea base

### 2.1 Punto de retorno

```powershell
New-Item -ItemType Directory -Force C:\Terbol\backups | Out-Null
cd C:\Terbol\webapp
Copy-Item .env.production .env.production.qas.bak -Force
git rev-parse --short HEAD | Out-File C:\Terbol\backups\commit-antes-del-cutover.txt -Encoding utf8
Copy-Item C:\Terbol\webapp-proxy\web.config C:\Terbol\backups\webapp-proxy-web.config.bak -Force
Backup-WebConfiguration -Name "antes-cutover-root"
Get-WebConfigurationBackup | Select-Object Name, CreationDate
```

> El backup del `web.config` va **fuera** de `C:\Terbol\webapp-proxy`: esa carpeta
> es la raíz física del sitio IIS y no conviene dejar copias de configuración
> adentro. El `.env.production.qas.bak` sí puede quedar en `C:\Terbol\webapp`,
> que no está servida por ningún sitio.

### 2.2 Línea base de los servicios ajenos — **paso clave**

Capturar cómo responde hoy cada ruta a preservar, para comparar después del cutover:

```powershell
$paths = @('/','/VentaPorCatalogo/PRD','/VentaPorCatalogo/QAS','/VentaPorCatalogoApi/PRD','/VentaPorCatalogoApi/QAS','/VentaPorCatalogoApi/PRD/api/Auth/login','/VentaPorCatalogoApi/QAS/api/Auth/login','/ServicioVPC/PRD','/ServicioVPC/QAS','/ServicioECO/PRD','/ServicioECO/QAS','/qas')
$base = foreach ($p in $paths) {
  $code = curl.exe -s -o NUL -w "%{http_code}" -H "Host: terbolinspira.com" "http://localhost$p"
  $body = curl.exe -s -H "Host: terbolinspira.com" "http://localhost$p"
  $next = if ($body -match '_next|__NEXT_DATA__') { 'SI' } else { 'no' }
  [pscustomobject]@{ Path = $p; Codigo = $code; PorNext = $next }
}
$base | Format-Table -AutoSize
$base | Export-Csv C:\Terbol\backups\baseline-cutover.csv -NoTypeInformation
```

> ### Por qué no alcanza con el código HTTP
>
> `/VentaPorCatalogoApi/PRD` devuelve **404 ya hoy**: es la raíz de un API, sin
> endpoint. El tráfico real va a rutas más profundas. Si después del cutover esa
> app quedara mal enrutada hacia Next, Next **también** devolvería 404 y la
> comparación por código diría `OK` con la API rota.
>
> Por eso la línea base registra además **quién responde**: se busca `_next` en el
> cuerpo, que aparece en cualquier respuesta de Next (incluida su página 404) y en
> ninguna respuesta de IIS o .NET.
>
> Regla de lectura: **toda ruta ajena debe tener `PorNext = no`, antes y después.**
> Un `no` que se convierte en `SI` es el proxy comiéndose una ruta que no le
> corresponde, aunque el código HTTP no haya cambiado.
>
> ### La sonda real de la API
>
> Los logs muestran tráfico real a `POST /VentaPorCatalogoApi/PRD/api/Auth/login` y
> `/api/Pedido/estado`, con IPs de cliente en rangos de **Cloudflare**
> (`172.71.x`, `162.158.x`) y user agent `RestSharp/106.11.4.0`: **hay un sistema
> externo integrado contra `https://terbolinspira.com/VentaPorCatalogoApi/PRD`.**
> No es tráfico interno — se rompe si la app no queda registrada y excluida.
>
> Por eso la línea base incluye `/api/Auth/login`. Es POST-only, así que un **GET**
> devuelve `405` desde .NET y `404` desde Next: discriminador limpio, sin necesidad
> de enviar credenciales. **Nunca probar este endpoint con credenciales reales.**

Guardá esa tabla. En la Fase 5 se repite y se compara.

---

## Fase 3 — Completar el sitio `TerbolWeb` (sigue detenido)

Nada de esto afecta al público: el sitio está `Stopped`.

### 3.1 Registrar las aplicaciones que faltan

Cada una apunta a la **misma carpeta física y el mismo app pool** que en
`Default Web Site`, para que el comportamiento a través del dominio sea idéntico.

```powershell
New-WebApplication -Site "TerbolWeb" -Name "VentaPorCatalogo/QAS"    -PhysicalPath "C:\inetpub\wwwroot\VentaPorCatalogo\QAS"    -ApplicationPool "VentaCatalogoQAS"
New-WebApplication -Site "TerbolWeb" -Name "ServicioVPC/QAS"         -PhysicalPath "C:\inetpub\wwwroot\ServicioVPC\QAS"         -ApplicationPool "DefaultAppPool"
New-WebApplication -Site "TerbolWeb" -Name "ServicioECO/PRD"         -PhysicalPath "C:\inetpub\wwwroot\ServicioECO\PRD"         -ApplicationPool "DefaultAppPool"
New-WebApplication -Site "TerbolWeb" -Name "ServicioECO/QAS"         -PhysicalPath "C:\inetpub\wwwroot\ServicioECO\QAS"         -ApplicationPool "DefaultAppPool"
```

Y los "padres" del árbol, para paridad exacta con lo que hoy resuelve el catch-all:

```powershell
New-WebApplication -Site "TerbolWeb" -Name "VentaPorCatalogo"    -PhysicalPath "C:\inetpub\wwwroot\VentaPorCatalogo"    -ApplicationPool "VentaCatalogoQAS"
New-WebApplication -Site "TerbolWeb" -Name "ServicioVPC"         -PhysicalPath "C:\inetpub\wwwroot\ServicioVPC"         -ApplicationPool "DefaultAppPool"
New-WebApplication -Site "TerbolWeb" -Name "ServicioECO"         -PhysicalPath "C:\inetpub\wwwroot\ServicioECO"         -ApplicationPool "DefaultAppPool"
```

> IIS acepta aplicaciones en rutas anidadas sin necesidad de registrar el padre — de
> hecho `TerbolWeb` ya tiene `/VentaPorCatalogo/PRD` sin `/VentaPorCatalogo`. Los
> padres se agregan igual por paridad, no por obligación.

**Opcional — apps sin tráfico** (`/VentaCatalogo`, `/ServicioN8N`, `/ecommerce`: 0
requests en 3 días). Quedan excluidas del proxy igual, así que darán 404 en el
dominio pero siguen accesibles por IP u otro hostname. Si preferís paridad absoluta:

```powershell
New-WebApplication -Site "TerbolWeb" -Name "VentaCatalogo/PRD" -PhysicalPath "C:\inetpub\wwwroot\VentaCatalogo\PRD" -ApplicationPool "DefaultAppPool"
New-WebApplication -Site "TerbolWeb" -Name "VentaCatalogo/QAS" -PhysicalPath "C:\inetpub\wwwroot\VentaCatalogo\QAS" -ApplicationPool "DefaultAppPool"
New-WebApplication -Site "TerbolWeb" -Name "ServicioN8N/PRD"   -PhysicalPath "C:\inetpub\wwwroot\ServicioN8N\PRD"   -ApplicationPool "DefaultAppPool"
New-WebApplication -Site "TerbolWeb" -Name "ServicioN8N/QAS"   -PhysicalPath "C:\inetpub\wwwroot\ServicioN8N\QAS"   -ApplicationPool "DefaultAppPool"
New-WebApplication -Site "TerbolWeb" -Name "ecommerce"         -PhysicalPath "C:\inetpub\wwwroot\ecommerce"         -ApplicationPool "DefaultAppPool"
```

Verificar el resultado:

```powershell
Get-WebApplication -Site "TerbolWeb" | Select-Object path, applicationPool, physicalPath | Format-Table -AutoSize
```

### 3.1-bis La API va reenviada, no replicada

`Makingsoft.WebApi` (`/VentaPorCatalogoApi/*`) declara
`hostingModel="inprocess"` en su `web.config`. ASP.NET Core con hosting
**in-process** admite **una sola aplicación por app pool**: el runtime vive dentro
del `w3wp`. Registrarla también en `TerbolWeb` con el mismo pool hace que la
segunda instancia no arranque → **HTTP 503**.

> Verificado en la prueba en seco (3.5): con la API registrada, `/api/Auth/login`
> daba `503` en vez de `405`. La copia del `Default Web Site` siguió sana y los
> pools nunca se detuvieron, así que producción no se vio afectada — pero en el
> cutover habría reventado la integración externa.
>
> `Terbol.Web` (`/VentaPorCatalogo/*`) sí se puede replicar porque usa
> `hostingModel="OutOfProcess"`: cada aplicación IIS lanza su propio `dotnet.exe`.

**Solución: no duplicar la app, reenviarla.** Sigue existiendo una sola instancia,
en el `Default Web Site`, exactamente como hoy. `TerbolWeb` le pasa el request por
una puerta interna en loopback.

```powershell
netstat -ano | findstr ":8080"
New-WebBinding -Name "Default Web Site" -Protocol http -IPAddress "127.0.0.1" -Port 8080
Get-WebBinding -Name "Default Web Site" | ForEach-Object { $_.bindingInformation }
```

Es un binding **aditivo** en loopback: no altera cómo responde hoy ese sitio, solo
le agrega una entrada interna. Es el **único** cambio que este plan hace sobre el
`Default Web Site` antes de la Fase 7, y se revierte con `Remove-WebBinding`.

El reenvío lo hace la regla `ProxyVpcApi` del `web.config` (3.2), que va **antes**
de la regla de exclusiones.

> **Efecto lateral:** en los logs de la API el `c-ip` pasa a ser `127.0.0.1` en vez
> de la IP de Cloudflare. No es una pérdida real de trazabilidad — ya hoy no ve la
> IP del cliente final, sino la del edge de Cloudflare.

### 3.2 `web.config` final del proxy

Cambios respecto del actual: se agrega la regla de **301 de `/qas`**, se completan
las **exclusiones** y se corrige el patrón a `([/?]|$)` para cubrir el query string.

```powershell
@'
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="RedirectQasToRoot" stopProcessing="true">
          <match url="^qas(/(.*))?$" />
          <action type="Redirect" url="https://{HTTP_HOST}/{R:2}" redirectType="Permanent" />
        </rule>
        <rule name="ProxyVpcApi" stopProcessing="true">
          <match url="^(VentaPorCatalogoApi(?:/.*)?)$" />
          <action type="Rewrite" url="http://127.0.0.1:8080/{R:1}" />
        </rule>
        <rule name="ReverseProxyToNext" stopProcessing="true">
          <match url="(.*)" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_URI}" pattern="^/(VentaPorCatalogoApi|VentaPorCatalogo|VentaCatalogo|ServicioVPC|ServicioECO|ServicioN8N|ecommerce)([/?]|$)" negate="true" />
          </conditions>
          <action type="Rewrite" url="http://127.0.0.1:3001/{R:1}" />
          <serverVariables>
            <set name="HTTP_X_FORWARDED_PROTO" value="https" />
            <set name="HTTP_X_FORWARDED_HOST" value="{HTTP_HOST}" />
          </serverVariables>
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
'@ | Out-File -FilePath C:\Terbol\webapp-proxy\web.config -Encoding utf8
```

Confirmar que IIS lo parsea sin error:

```powershell
Get-WebConfiguration -Filter "system.webServer/rewrite/rules/rule" -PSPath "IIS:\Sites\TerbolWeb" | Select-Object name, @{n='matchUrl';e={$_.match.url}}, @{n='actionType';e={$_.action.type}}, @{n='actionUrl';e={$_.action.url}} | Format-Table -AutoSize
```

### 3.3 ARR y server variables (idempotente)

Ya deberían estar habilitadas — `/qas` funciona con las mismas. Si el comando tira
`Cannot add duplicate collection entry`, el error es inofensivo:

```powershell
Set-WebConfigurationProperty -PSPath "MACHINE/WEBROOT/APPHOST" -Filter "system.webServer/proxy" -Name "enabled" -Value "True"
Add-WebConfiguration -Filter "system.webServer/rewrite/allowedServerVariables" -PSPath "MACHINE/WEBROOT/APPHOST" -AtIndex 0 -Value @{name="HTTP_X_FORWARDED_PROTO"}
Add-WebConfiguration -Filter "system.webServer/rewrite/allowedServerVariables" -PSPath "MACHINE/WEBROOT/APPHOST" -AtIndex 0 -Value @{name="HTTP_X_FORWARDED_HOST"}
```

### 3.5 Prueba en seco del enrutamiento (recomendado)

La parte más riesgosa del cutover es el enrutamiento de las aplicaciones ajenas —
hay una **integración externa** golpeando `/VentaPorCatalogoApi/PRD` por Cloudflare.
Conviene validarla antes de exponer el sitio, no durante.

Se puede probar todo sin tocar el dominio: se le quitan a `TerbolWeb` los bindings
de puerto 80, se le deja uno solo en `127.0.0.1:8081`, se enciende, se prueba y se
restaura. Durante la prueba el sitio **nunca escucha en el 80**, así que el público
sigue viendo el Astro y `/qas` sin enterarse.

```powershell
# 0. Puerto libre y bindings actuales (anotarlos)
netstat -ano | findstr ":8081"
Get-WebBinding -Name "TerbolWeb" | ForEach-Object { $_.bindingInformation -replace '\.','_DOT_' }
```

```powershell
# 1. Sacar el puerto 80, dejar solo loopback:8081
Remove-WebBinding -Name "TerbolWeb" -Protocol http -Port 80 -HostHeader "terbolinspira.com"
Remove-WebBinding -Name "TerbolWeb" -Protocol http -Port 80 -HostHeader "www.terbolinspira.com"
New-WebBinding    -Name "TerbolWeb" -Protocol http -IPAddress "127.0.0.1" -Port 8081
Get-WebBinding -Name "TerbolWeb" | ForEach-Object { $_.bindingInformation }
Start-Website -Name "TerbolWeb"
```

```powershell
# 2. Probar el enrutamiento contra el sitio nuevo
foreach ($p in '/VentaPorCatalogo/PRD','/VentaPorCatalogo/QAS','/VentaPorCatalogoApi/PRD/api/Auth/login','/VentaPorCatalogoApi/QAS/api/Auth/login','/ServicioVPC/PRD','/ServicioVPC/QAS','/ServicioECO/PRD','/ServicioECO/QAS') {
  $code = curl.exe -s -o NUL -w "%{http_code}" "http://127.0.0.1:8081$p"
  $body = curl.exe -s "http://127.0.0.1:8081$p"
  $next = if ($body -match '_next|__NEXT_DATA__') { 'SI' } else { 'no' }
  "{0,-42} {1}  PorNext={2}" -f $p, $code, $next
}
curl.exe -s -o NUL -w "qas -> %{http_code}  %{redirect_url}`n" "http://127.0.0.1:8081/qas/products"
```

Esperado: **los mismos códigos que la línea base y `PorNext=no` en todas**, más un
`301` en `/qas`. Ojo: `/` y las rutas de la app van a fallar en esta prueba, porque
node todavía sirve el build con `basePath=/qas`. Eso es correcto y esperado — acá
se valida el enrutamiento de lo ajeno, no la app.

```powershell
# 3. Restaurar y volver a dejar el sitio detenido
Stop-Website -Name "TerbolWeb"
Remove-WebBinding -Name "TerbolWeb" -Protocol http -IPAddress "127.0.0.1" -Port 8081
$apex = "terbolinspira.com"
$www  = "www." + $apex
New-WebBinding -Name "TerbolWeb" -Protocol http -Port 80 -HostHeader $apex
New-WebBinding -Name "TerbolWeb" -Protocol http -Port 80 -HostHeader $www
Get-WebBinding -Name "TerbolWeb" | ForEach-Object { $_.bindingInformation -replace '\.','_DOT_' }
(Get-Website -Name "TerbolWeb").State
```

> ⚠️ **El paso 3 no es opcional.** Si quedan mal los bindings, el sitio no va a
> atender el dominio en la Fase 4. Verificar que la salida final muestre los dos
> host headers y `Stopped`.
>
> El host `www` se arma con `"www." + $apex` a propósito: escrito literal, muchos
> terminales y clientes de chat lo convierten en un hipervínculo y se pega con
> corchetes de markdown. Por lo mismo, los bindings se muestran con
> `-replace '\.','_DOT_'`.

---

**El sitio sigue detenido. El público ve el Astro en root y la app en `/qas`.**

---

## Fase 4 — Cutover

### 4.1 Nuevo `.env.production`

Cambios respecto del actual: `NEXT_PUBLIC_SITE_URL` sin `/qas`, se **elimina**
`NEXT_PUBLIC_BASE_PATH`, y `NEXT_PUBLIC_ASESOR_URL` pasa a **PRD**.

**Mantener la contraseña SMTP actual** (está en el archivo viejo y en el `.bak`).
Nunca escribirla en documentación, tickets ni en el repo.

```powershell
cd C:\Terbol\webapp
@"
NEXT_PUBLIC_SITE_URL=https://terbolinspira.com
NEXT_PUBLIC_API_URL=https://cms.terbolinspira.com/api
NEXT_PUBLIC_STORAGE_URL=https://cms.terbolinspira.com/storage
NEXT_PUBLIC_ASESOR_URL=https://www.terbolinspira.com/VentaPorCatalogo/PRD
REVALIDATE_SECRET=<mismo-o-nuevo-token>
CMS_REVALIDATE_SECONDS=86400

SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@terbolinspira.com
SMTP_PASS=<la contrasena actual>
CONTACT_TO=info@terbolinspira.com
CONTACT_FROM=info@terbolinspira.com
"@ | Out-File -FilePath .env.production -Encoding utf8
```

> **Sobre `REVALIDATE_SECRET`:** el valor actual es de prueba y conviene rotarlo. Si
> se rota, hay que actualizarlo en el CMS **en el mismo momento** (Fase 6): si no
> coinciden, la revalidación por webhook deja de funcionar en silencio y el
> contenido solo se refresca cada 24 h. Para reducir piezas en movimiento, se puede
> dejar el valor actual y rotarlo en un cambio aparte.
>
> Generar uno nuevo:
> ```powershell
> -join ((48..57)+(65..90)+(97..122) | Get-Random -Count 40 | ForEach-Object {[char]$_})
> ```

### 4.2 Traer el código y rebuildear

```powershell
cd C:\Terbol\webapp
$before = git rev-parse HEAD
git pull
git diff $before HEAD --name-only | findstr package
```

Si listó `package.json` / `package-lock.json`, correr `npm ci`.

```powershell
C:\Tools\nssm.exe stop TerbolWeb
$env:NEXT_DEPLOYMENT_ID = git rev-parse --short HEAD
npm run build
```

> El servicio **debe** estar detenido durante el build: el proceso node bloquea
> `.next\standalone` y falla con `EBUSY`.
>
> Desde aquí y hasta el paso 4.5, `/qas` queda roto. Root sigue mostrando el Astro.

### 4.3 Completar el bundle standalone

⚠️ Borrar el destino y copiar el **contenido** con `\*`. `Copy-Item -Recurse` sobre
un destino existente anida la carpeta (`...\static\static\`) → 404 en
`/_next/static/*` → sitio sin estilos.

```powershell
$std = "C:\Terbol\webapp\.next\standalone"
Remove-Item -Recurse -Force "$std\.next\static" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$std\public"       -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force "$std\.next\static" | Out-Null
New-Item -ItemType Directory -Force "$std\public"       | Out-Null
Copy-Item -Recurse -Force "C:\Terbol\webapp\.next\static\*" "$std\.next\static"
Copy-Item -Recurse -Force "C:\Terbol\webapp\public\*"       "$std\public"
Copy-Item -Force          "C:\Terbol\webapp\.env.production" "$std\.env.production"
```

```powershell
Test-Path "$std\.next\static\chunks"; Test-Path "$std\.next\static\static"; Test-Path "$std\public"; Test-Path "$std\.env.production"; Test-Path "$std\node_modules\sharp"
```

Esperado: `True`, **`False`**, `True`, `True`, `True`.

El último confirma que `sharp` viajó al standalone — ahora hace falta de verdad,
porque sin basePath se reactiva el optimizador de imágenes. Si diera `False`:

```powershell
Copy-Item -Recurse -Force "C:\Terbol\webapp\node_modules\sharp" "$std\node_modules\sharp"
```

### 4.4 Arrancar y verificar la app **antes** de exponerla

```powershell
C:\Tools\nssm.exe start TerbolWeb
Start-Sleep -Seconds 3
C:\Tools\nssm.exe status TerbolWeb
```

```powershell
curl.exe -s -o NUL -w "home:     %{http_code}`n" http://localhost:3001/; curl.exe -s -o NUL -w "products: %{http_code}`n" http://localhost:3001/products; curl.exe -s -o NUL -w "api:      %{http_code}`n" http://localhost:3001/api/products; curl.exe -s -o NUL -w "sitemap:  %{http_code}`n" http://localhost:3001/sitemap.xml
```

Los cuatro deben dar `200`. Confirmar que no quedó rastro de `/qas`:

```powershell
$html = (curl.exe -s http://localhost:3001/) -join "`n"
if ($html -match '/qas') { "ATENCION: hay rastro de /qas" } else { "ok: sin rastro de /qas" }
```

Y que el CSS, el optimizador de imágenes y los links de asesores están bien:

```powershell
if ($html -match '(/_next/static/[^"]+\.css)') { curl.exe -s -o NUL -w "css: %{http_code}`n" "http://localhost:3001$($Matches[1])" } else { "no se encontro css en el HTML" }
if ($html -match '/_next/image\?url=([^"&]+)') { curl.exe -s -o NUL -w "optimizador: %{http_code}`n" "http://localhost:3001/_next/image?url=$($Matches[1])&w=640&q=75" } else { "sin /_next/image en el HTML" }
$prom = (curl.exe -s http://localhost:3001/promoter) -join "`n"
if ($prom -match 'VentaPorCatalogo/(PRD|QAS)') { "asesores -> $($Matches[1])" } else { "no se encontro el link en /promoter" }
```

Esperado: `css: 200`, `optimizador: 200`, `asesores -> PRD`.

> ### Dos trampas de PowerShell en estas verificaciones
>
> **`curl.exe` devuelve un array de líneas.** Con un array, `-match` no evalúa un
> booleano ni llena `$Matches`: filtra y devuelve las líneas que matchean. El `if`
> entra igual (array no vacío = verdadero) y `$Matches` queda nulo. Por eso todas
> las capturas usan `(curl.exe ...) -join "`n"` para trabajar sobre un solo string.
>
> **`findstr /I "/qas"`** no sirve: interpreta `/q`, `/a` y `/s` como switches y
> falla con `Bad command line`. Usar `-match` de PowerShell, o `findstr /I /C:"/qas"`.

> Si algo falla, **detener acá**. El público sigue intacto (Astro en root).

### 4.5 Encender el sitio — este es el cutover

```powershell
Start-Website -Name "TerbolWeb"
Get-Website | Format-Table Name, State -AutoSize
```

El binding con host header gana sobre el catch-all: a partir de este comando
`terbolinspira.com` y `www` sirven la app nueva.

---

## Fase 5 — Verificación

### 5.1 Comparar contra la línea base — **primero esto**

```powershell
$antes = Import-Csv C:\Terbol\backups\baseline-cutover.csv
foreach ($r in $antes) {
  $p = $r.Path
  $code = curl.exe -s -o NUL -w "%{http_code}" -H "Host: terbolinspira.com" "http://localhost$p"
  $body = curl.exe -s -H "Host: terbolinspira.com" "http://localhost$p"
  $next = if ($body -match '_next|__NEXT_DATA__') { 'SI' } else { 'no' }
  $esperado =
    if ($p -eq '/qas')   { $code -eq '301' }
    elseif ($p -eq '/')  { $code -eq '200' -and $next -eq 'SI' }
    else                 { $code -eq $r.Codigo -and $next -eq $r.PorNext }
  $flag = if ($esperado) { "OK" } else { "*** REVISAR ***" }
  "{0,-28} antes={1}/{2,-2}  ahora={3}/{4,-2}  {5}" -f $p, $r.Codigo, $r.PorNext, $code, $next, $flag
}
```

Todo debe dar `OK`. Los dos cambios esperados: `/qas` pasa a `301`, y `/` sigue en
`200` pero ahora con `PorNext = SI`. **Todas las rutas ajenas deben conservar su
código y seguir en `PorNext = no`.**

**Cualquier `*** REVISAR ***` se resuelve antes de continuar** (o se hace rollback
con `Stop-Website`). El caso más traicionero es una ruta que mantiene el código
pero pasa a `PorNext = SI`: significa que el reverse proxy se la comió.

### 5.2 La app, por IIS y por Cloudflare

```powershell
curl.exe -s -o NUL -w "apex: %{http_code}`n" -H "Host: terbolinspira.com" http://localhost/; curl.exe -s -o NUL -w "www:  %{http_code}`n" -H "Host: www.terbolinspira.com" http://localhost/
```

```powershell
curl.exe -s -o NUL -w "qas -> %{http_code}  %{redirect_url}`n" -H "Host: terbolinspira.com" http://localhost/qas/products
```

Esperado: `301` con `redirect_url` = `http://terbolinspira.com/products` (lo emite
IIS; si viera un `308` significa que el request llegó hasta Next, o sea que la regla
`RedirectQasToRoot` no se aplicó).

```powershell
curl.exe -sI https://terbolinspira.com | findstr /I "HTTP/ server cf-ray cf-cache-status"
curl.exe -s https://terbolinspira.com | findstr /I "_next _astro <title"
```

Debe aparecer `_next` y **no** `_astro`.

```powershell
$html = curl.exe -s https://terbolinspira.com/; if ($html -match 'data-dpl-id="([^"]+)"') { "deployment id: $($Matches[1])" }
```

Debe coincidir con el SHA corto del commit desplegado.

### 5.3 Checklist en navegador (incógnito, idealmente desde otra red)

**La app:**

- [ ] `https://terbolinspira.com` y `www` cargan **con estilos**
- [ ] Home, `/products`, `/about`, `/promoter`, `/faq`, `/success-plan`, `/science-and-quality`
- [ ] Detalle de producto (`/products/<id>`)
- [ ] Imágenes locales (logo, banners) e imágenes del CMS
- [ ] Filtros, búsqueda y paginación de productos (usan `/api/products`)
- [ ] Formulario de contacto en `/about`: envía y llega el mail
- [ ] **Los CTAs de asesores llevan a `/VentaPorCatalogo/PRD`, no a `/QAS`**
- [ ] `/qas` y `/qas/products` redirigen 301 a root
- [ ] `/sitemap.xml` lista URLs **sin** `/qas`; `/robots.txt` apunta al sitemap de root
- [ ] El canonical del HTML apunta al dominio sin `/qas`

**Lo ajeno — probar con un usuario real, no solo por código HTTP:**

- [ ] `https://terbolinspira.com/VentaPorCatalogo/PRD` — login de asesores funciona **y opera** (no solo carga: hacer una acción que pegue al API)
- [ ] `https://terbolinspira.com/VentaPorCatalogo/QAS` — igual
- [ ] `https://cms.terbolinspira.com` responde y se entra al admin
- [ ] `Get-Website` — todos los sitios en `Started`
- [ ] Laragon / MySQL / app .NET sin cambios

> El punto de "operar, no solo cargar" es el que detecta si `/VentaPorCatalogoApi`
> quedó mal enrutado: la app puede pintar la pantalla de login y fallar recién al
> autenticar.

---

## Fase 6 — Post-cutover (mismo día)

1. **Cloudflare → Caching → Purge Everything.** Limpia el HTML y los assets del Astro.
2. **Cloudflare → Rules.** Revisar que no haya Page Rules / Redirect Rules que
   mencionen `/qas`. No tocar el modo SSL (**Flexible**).
3. **Webhook del CMS.** Cambiar la URL de revalidación de
   `https://terbolinspira.com/qas/api/revalidate` a
   `https://terbolinspira.com/api/revalidate`. Si se rotó `REVALIDATE_SECRET`,
   actualizar también el header `x-revalidate-secret`. Verificar publicando
   contenido y confirmando que se refleja.
4. **Google Search Console.** Enviar `https://terbolinspira.com/sitemap.xml`.
   No hay que consolidar URLs de `/qas`: nunca fueron indexables
   (`X-Robots-Tag: noindex`).
5. **Monitorear CPU** unas horas: el optimizador de imágenes quedó activo (antes
   `unoptimized` por el basePath) y ahora procesa AVIF/WebP en el mismo servidor que
   SQL Server. Si molesta: sacar `"image/avif"` de `images.formats`, o poner
   `images.unoptimized: true` incondicional, y rebuildear.
6. **Revisar logs** al día siguiente:
   `Get-Content C:\Terbol\webapp\logs\err.log -Tail 50` y los de IIS de `W3SVC3`
   (el sitio nuevo) buscando 404 inesperados.

---

## Fase 7 — Limpieza (tras 1–2 semanas de observación)

### 7.1 Retirar `/qas`

```powershell
Remove-WebApplication -Name "qas" -Site "Default Web Site"
Remove-Item C:\inetpub\wwwroot\qas\qas.rar -Force
```

> El `.rar` de 30 MB es un volcado de código en una carpeta web. Hoy no está
> expuesto (verificado: 404), pero al quitar la aplicación deja de haber una regla
> de rewrite que lo intercepte, así que **hay que borrarlo en el mismo paso**.
> Si querés conservarlo, moverlo fuera de `wwwroot` antes de quitar la app.

### 7.2 Actualizar la documentación

- `docs/deploy-windows-iis.md`: arquitectura final (app en root, Astro como respaldo,
  aplicaciones replicadas en `TerbolWeb`).
- `docs/operacion-app.md`: procedimiento de actualización de abajo + la regla de
  convivencia.
- Este runbook: borrarlo o marcarlo como histórico.

### 7.3 Regla de convivencia — anotarla donde se vea

> **Si alguien agrega una aplicación nueva bajo `Default Web Site` que deba
> responder por `terbolinspira.com`, hay que hacer dos cosas: registrarla también en
> el sitio `TerbolWeb` (misma carpeta y mismo app pool) y agregar su prefijo a las
> exclusiones del `web.config` del proxy.** Si no, el reverse proxy se la come y
> devuelve 404. Es la deuda que deja tener el dominio en un sitio y los servicios en
> otro.

### 7.4 Si alguna vez se revierte del todo

Además de lo del apartado Rollback, quitar el binding loopback que agregamos:

```powershell
Remove-WebBinding -Name "Default Web Site" -Protocol http -IPAddress "127.0.0.1" -Port 8080
```

Mientras `TerbolWeb` esté en uso **no** hay que tocarlo: es por donde pasa la API.

### 7.5 Conservar

`.env.production.qas.bak`, `web.config.bak`, `backups\baseline-cutover.csv` y el backup de
IIS. No cuestan nada.

---

## Rollback

Un solo comando devuelve el tráfico al Astro:

```powershell
Stop-Website -Name "TerbolWeb"
```

`terbolinspira.com` vuelve al catch-all del `Default Web Site` al instante — y con
él, todos los servicios vuelven a resolver como antes. La app y su servicio quedan
intactos. Purgar Cloudflare si hace falta. Para volver: `Start-Website -Name "TerbolWeb"`.

### Rollback completo a `/qas`

```powershell
Stop-Website -Name "TerbolWeb"
cd C:\Terbol\webapp
Copy-Item .env.production.qas.bak .env.production -Force
C:\Tools\nssm.exe stop TerbolWeb
$env:NEXT_DEPLOYMENT_ID = git rev-parse --short HEAD
npm run build
# repetir el bloque de copia de la Fase 4.3
C:\Tools\nssm.exe start TerbolWeb
```

Para deshacer cambios de IIS: `Restore-WebConfiguration -Name "antes-cutover-root"`.

---

## Nuevo procedimiento de actualización (reemplaza §A de `operacion-app.md`)

Con un solo slot el build exige parar el servicio. Para que los visitantes no vean
un 502, se apaga el sitio IIS primero y **el Astro cubre la ventana**:

```powershell
cd C:\Terbol\webapp

# 1. El Astro toma el tráfico mientras dura el deploy
Stop-Website -Name "TerbolWeb"

# 2. Traer cambios
$before = git rev-parse HEAD
git pull
git diff $before HEAD --name-only | findstr package     # si lista package*, correr npm ci

# 3. Parar el servicio (libera el lock de .next\standalone) y buildear
C:\Tools\nssm.exe stop TerbolWeb
$env:NEXT_DEPLOYMENT_ID = git rev-parse --short HEAD
npm run build

# 4. Completar el bundle standalone (remove + copia con \*)
$std = "C:\Terbol\webapp\.next\standalone"
Remove-Item -Recurse -Force "$std\.next\static" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$std\public"       -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force "$std\.next\static" | Out-Null
New-Item -ItemType Directory -Force "$std\public"       | Out-Null
Copy-Item -Recurse -Force "C:\Terbol\webapp\.next\static\*" "$std\.next\static"
Copy-Item -Recurse -Force "C:\Terbol\webapp\public\*"       "$std\public"
Copy-Item -Force          "C:\Terbol\webapp\.env.production" "$std\.env.production"

# 5. Arrancar y verificar en local ANTES de exponer
C:\Tools\nssm.exe start TerbolWeb
Start-Sleep -Seconds 3
curl.exe -s -o NUL -w "%{http_code}`n" http://localhost:3001/

# 6. Devolver el tráfico a la app
Start-Website -Name "TerbolWeb"
```

> ⚠️ **Durante los pasos 1–5, `terbolinspira.com` vuelve al `Default Web Site`.** La
> app de asesores y los servicios siguen funcionando igual (los sirve el catch-all),
> pero el sitio institucional muestra el landing Astro, que es viejo y tiene otras
> rutas: los deep links (`/products`, etc.) darán 404 en esa ventana. Deployar en
> horario de bajo tráfico y que la ventana sea corta.
>
> Si en el futuro molesta ese downtime, la solución es blue/green: una segunda
> carpeta y un segundo servicio en el puerto 3002, buildeando en el slot inactivo y
> cambiando el puerto destino del `web.config`.

Si **solo** cambiaron variables sin prefijo `NEXT_PUBLIC_`, no hace falta build:
copiar el `.env.production` al standalone y `nssm restart TerbolWeb`.

---

## Puntos de atención

| Tema | Detalle |
|---|---|
| Aplicaciones ajenas | El punto más delicado del cutover. Ver Fase 3 y la regla de convivencia (7.3). Verificar **operando**, no solo por código HTTP. |
| Variables `NEXT_PUBLIC_*` | Se compilan en el build. Cambiar dominio, basePath o URL de asesores **exige rebuild**. |
| Optimizador de imágenes | Sin basePath vuelve a estar activo (`/_next/image`). Código que nunca corrió en este servidor: verificarlo (4.4) y vigilar CPU. |
| HSTS | La app manda `Strict-Transport-Security` con `includeSubDomains; preload`. Antes solo en `/qas`; ahora en todo el dominio. Confirmar que todos los subdominios (empezando por `cms.`) sirven HTTPS bien. |
| App pool del sitio | `TerbolWeb` usa `DefaultAppPool`, compartido con el Astro y varias apps. Solo hace rewrites, así que el riesgo es bajo; un pool dedicado (*No Managed Code*) sería más prolijo, pero no es necesario para el cutover. |
| `iisreset` | Prohibido: reinicia el CMS y las apps de asesores. |
| Secretos | `.env.production` vive solo en el servidor (`.gitignore`). No commitear ni pegar la contraseña SMTP en documentación o tickets. |
| `C:\Terbol\TerbolInspira` | No es la webapp: son jobs de SQL Server. La app está en `C:\Terbol\webapp`. |
