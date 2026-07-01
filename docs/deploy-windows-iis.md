# Despliegue — Terbol WebApp en Windows Server (IIS + Node + Cloudflare)

Guía para desplegar **terbol-webapp** (Next.js 16, App Router) en el servidor
Windows de producción, desde cero. Refleja el despliegue real ya realizado, con
los imprevistos encontrados y sus soluciones. Para la operación diaria ver
[`operacion-app.md`](./operacion-app.md).

---

## 1. Arquitectura

La app es un **servidor Node** (no un sitio estático): usa SSR, ISR
(`revalidateTag`) y route handlers (`/api/*`). No puede servirse como archivos
estáticos en IIS — corre un proceso Node vivo, con IIS por delante haciendo
reverse proxy y Cloudflare terminando el HTTPS.

```
Cloudflare (termina HTTPS, modo Flexible)
        │  https://terbolinspira.com  (y www)
        ▼  HTTP:80 al origen
IIS  ── sitio "TerbolWeb"  (host headers terbolinspira.com + www, puerto 80)
        │  reverse proxy (ARR + URL Rewrite) → web.config
        ▼
node server.js  (127.0.0.1:3001)   ← build standalone de Next.js
        ▲
        └── lo mantiene vivo el Servicio de Windows "TerbolWeb" (nssm)
```

- **HTTPS / dominio:** Cloudflare. SSL mode **Flexible**: Cloudflare habla con el
  origen por HTTP:80 (IIS no tiene cert ni binding 443). No subir a Full → rompe.
- **Rollback:** el landing estático viejo (Astro, en `Default Web Site`,
  catch-all `*:80`) queda intacto. Detener el sitio nuevo devuelve el viejo.

---

## 2. Contexto del servidor (verificado)

| Componente | Detalle |
|---|---|
| Node | v24.16.0 vía **nvm4w** → `C:\Users\Administrator\AppData\Local\nvm\v24.16.0\node.exe` |
| Web server | IIS (W3SVC), puerto 80, solo HTTP (sin SSL bindings) |
| ARR + URL Rewrite | Ya instalados |
| Landing viejo | Sitio estático Astro en `Default Web Site` (`C:\inetpub\wwwroot`) |
| CMS | Laravel en `cms.terbolinspira.com` (`C:\inetpub\wwwroot\cms`) |
| DNS / HTTPS | Cloudflare (IPs `104.26.x` / `172.67.x`, `server: cloudflare`) |
| Otros | .NET (`C:\App`), SQL Server, Laragon (Apache:81, MySQL:3306, MailHog:1025/8025) |
| Puerto de la app | **3001** (`127.0.0.1`) |
| Carpeta de la app | `C:\Terbol\webapp` |
| Carpeta del proxy | `C:\Terbol\webapp-proxy` (solo `web.config`) |

> ⚠️ `C:\Terbol\TerbolInspira` **está en uso** por jobs de SQL Server
> (`SqlServer\*.bat`, `log_sp.txt`). **No** poner la webapp ahí. La webapp va en
> `C:\Terbol\webapp`.

---

## 3. Prerrequisitos

```powershell
node -v        # 24.x  (la app exige >=24 <25)
npm -v
git --version

netstat -ano | findstr ":3001"   # debe estar libre

# ARR + URL Rewrite:
Get-WebGlobalModule | Where-Object { $_.Name -match "ApplicationRequestRouting|RewriteModule" } | Select Name
```

> **Ojo con nvm:** `where.exe node` puede devolver un symlink
> (`C:\nvm4w\nodejs\node.exe`) que nvm cambia según la versión activa. Para el
> servicio se usa la **ruta versionada real** (ver paso 8), inmune a `nvm use`.

---

## 4. Código

```powershell
mkdir C:\Terbol\webapp
cd C:\Terbol\webapp
git clone <URL-DEL-REPO> .
```

---

## 5. Variables de entorno

Crear `C:\Terbol\webapp\.env.production`.

> Las `NEXT_PUBLIC_*` se **compilan dentro del build** → deben existir **antes**
> de `npm run build`. Cambiarlas exige rebuild. En producción la app hace
> *fail-fast*: si falta una requerida, el build/arranque lanza
> `[env] Falta la variable obligatoria ...`.

### Requeridas

```
NEXT_PUBLIC_SITE_URL=https://terbolinspira.com
NEXT_PUBLIC_API_URL=https://cms.terbolinspira.com/api
NEXT_PUBLIC_STORAGE_URL=https://cms.terbolinspira.com/storage
```

### Solo-servidor (opcionales — degradan controlado si faltan, NO se compilan)

```
# Webhook de revalidación ISR. Debe coincidir con el header
# x-revalidate-secret que envía el CMS. Sin comillas. Valor aleatorio en prod.
REVALIDATE_SECRET=<token>

# Fallback ISR en segundos cuando el webhook no se ejecuta. 86400 = 1 día.
CMS_REVALIDATE_SECONDS=86400

# Auth del API de productos, SOLO si el CMS lo exige (si /products es público,
# dejar vacías). El header por defecto es "ApiKey".
PRODUCTS_API_TOKEN=
PRODUCTS_API_KEY=
PRODUCTS_API_KEY_HEADER=ApiKey

# SMTP del formulario de contacto (/about). Si faltan, /api/contact responde
# 500 controlado (no crashea). Usar SMTP real, no el MailHog de Laragon.
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
CONTACT_TO=
CONTACT_FROM=
```

> Sacar `REVALIDATE_SECRET` y las credenciales de productos del `.env` del CMS
> Laravel (`C:\inetpub\wwwroot\cms\.env`). En `.env` **no** usar comillas: dotenv
> las quita y el valor real queda sin ellas (el CMS debe enviar el valor sin comillas).

Crear el archivo (reescritura limpia, evita duplicados):

```powershell
cd C:\Terbol\webapp
@"
NEXT_PUBLIC_SITE_URL=https://terbolinspira.com
NEXT_PUBLIC_API_URL=https://cms.terbolinspira.com/api
NEXT_PUBLIC_STORAGE_URL=https://cms.terbolinspira.com/storage
REVALIDATE_SECRET=<token>
CMS_REVALIDATE_SECONDS=86400
"@ | Out-File -FilePath .env.production -Encoding utf8
```

---

## 6. Build y empaquetado

La app usa `output: "standalone"` en `next.config.ts` → el build genera
`.next/standalone/server.js` autocontenido.

```powershell
cd C:\Terbol\webapp
npm ci
npm run build
```

### ⚠️ Completar el bundle standalone (paso crítico)

Next **no incluye** los assets del cliente (`.next/static`) ni `public/` en el
standalone (asume un CDN). Sin CDN hay que copiarlos para que `server.js` los sirva.

> **Bug del Copy-Item:** `Copy-Item -Recurse origen destino` cuando el **destino
> ya existe** copia la carpeta *adentro* y crea `...\static\static\...` (anidado).
> Eso provoca **404 en `/_next/static/*` → sitio sin estilos**. Solución: borrar
> el destino y copiar el **contenido** con `\*`.

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

Verificar:

```powershell
Test-Path "$std\.next\static\chunks"   # True (NO debe existir $std\.next\static\static)
Test-Path "$std\public"                # True
Test-Path "$std\.env.production"       # True
```

### Prueba manual

```powershell
cd C:\Terbol\webapp\.next\standalone
$env:PORT=3001; $env:NODE_ENV="production"; $env:HOSTNAME="127.0.0.1"
node server.js          # "Ready on http://...:3001"
```

En otra terminal:

```powershell
curl.exe -s -o NUL -w "%{http_code}`n" http://localhost:3001                                    # 200
curl.exe -s -o NUL -w "%{http_code}`n" "http://localhost:3001/_next/static/chunks/<hash>.css"    # 200 (tomar hash del HTML)
```

Abrir `http://localhost:3001` en el navegador del server (Edge/Chrome — **no**
Laragon, que es el stack PHP). Verificar estilos, imágenes del CMS y `/api/products`.
`Ctrl+C` para parar.

---

## 7. Confirmar Cloudflare / HTTPS

```powershell
nslookup terbolinspira.com
curl.exe -sI https://terbolinspira.com | findstr /I "server cf-ray"
```

IPs `104.26.x` / `172.67.x` o `server: cloudflare` → Cloudflare termina TLS,
origen HTTP:80. Modo SSL **Flexible** (confirmado: IIS sin cert 443).

---

## 8. Servicio de Windows (nssm)

`choco` no está instalado en el server → descargar nssm directo.

```powershell
# descargar nssm
mkdir C:\Tools -Force | Out-Null
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Uri "https://nssm.cc/release/nssm-2.24.zip" -OutFile "$env:TEMP\nssm.zip"
Expand-Archive -Path "$env:TEMP\nssm.zip" -DestinationPath "$env:TEMP\nssm" -Force
Copy-Item "$env:TEMP\nssm\nssm-2.24\win64\nssm.exe" "C:\Tools\nssm.exe" -Force
C:\Tools\nssm.exe version
```

Crear el servicio. **Importante:** apuntar a la **ruta versionada real de node**
(no al symlink de nvm), para que `nvm use` no lo rompa:

```powershell
# ver la ruta versionada real:
Get-Item C:\nvm4w\nodejs | Select-Object Target
# → ej. C:\Users\Administrator\AppData\Local\nvm\v24.16.0

C:\Tools\nssm.exe install TerbolWeb "C:\Users\Administrator\AppData\Local\nvm\v24.16.0\node.exe" "C:\Terbol\webapp\.next\standalone\server.js"
C:\Tools\nssm.exe set TerbolWeb AppDirectory "C:\Terbol\webapp\.next\standalone"
C:\Tools\nssm.exe set TerbolWeb AppEnvironmentExtra PORT=3001 NODE_ENV=production HOSTNAME=127.0.0.1
C:\Tools\nssm.exe set TerbolWeb Start SERVICE_AUTO_START
C:\Tools\nssm.exe set TerbolWeb AppStdout C:\Terbol\webapp\logs\out.log
C:\Tools\nssm.exe set TerbolWeb AppStderr C:\Terbol\webapp\logs\err.log
C:\Tools\nssm.exe start TerbolWeb
C:\Tools\nssm.exe status TerbolWeb        # SERVICE_RUNNING
```

> Si el servicio queda `SERVICE_STOPPED` con `err.log` vacío: casi siempre es la
> ruta de node mal (`Program Files\nodejs` no existe en este server). Revisar el
> Event Log: `Get-EventLog -LogName Application -Source nssm -Newest 5 | Format-List`.
> `HOSTNAME=127.0.0.1` deja la app escuchando solo local (la alcanza IIS).

---

## 9. IIS — sitio + reverse proxy (= CUTOVER)

Se crea un sitio IIS con host headers del dominio. Al tener host-header
específico, **gana** sobre el `Default Web Site` (catch-all) automáticamente. El
landing viejo queda de respaldo. **Apenas se crea el sitio, el público ve la app
nueva** → verificar bien la app (paso 6) antes de esto.

```powershell
New-Item -ItemType Directory -Force C:\Terbol\webapp-proxy | Out-Null
New-Website   -Name "TerbolWeb" -Port 80 -HostHeader "terbolinspira.com"     -PhysicalPath "C:\Terbol\webapp-proxy"
New-WebBinding -Name "TerbolWeb" -Protocol http -Port 80 -HostHeader "www.terbolinspira.com"
```

Crear `C:\Terbol\webapp-proxy\web.config`:

```powershell
@'
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="ReverseProxyToNext" stopProcessing="true">
          <match url="(.*)" />
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

Activar el proxy de ARR + permitir las server variables (una vez por server). Si
ya estaban, `Add-WebConfiguration` da `Cannot add duplicate collection entry` —
**ese error es inofensivo**, significa que ya existían:

```powershell
Set-WebConfigurationProperty -PSPath "MACHINE/WEBROOT/APPHOST" -Filter "system.webServer/proxy" -Name "enabled" -Value "True"
Add-WebConfiguration -Filter "system.webServer/rewrite/allowedServerVariables" -PSPath "MACHINE/WEBROOT/APPHOST" -AtIndex 0 -Value @{name="HTTP_X_FORWARDED_PROTO"}
Add-WebConfiguration -Filter "system.webServer/rewrite/allowedServerVariables" -PSPath "MACHINE/WEBROOT/APPHOST" -AtIndex 0 -Value @{name="HTTP_X_FORWARDED_HOST"}
```

> `X-Forwarded-Proto=https` le dice a Next que el cliente entró por HTTPS (el
> origen es HTTP) para generar canonicals correctos.

---

## 10. Verificación

```powershell
# bindings — verificar con _DOT_ para que el render no convierta www en link
Get-WebBinding -Name "TerbolWeb" | ForEach-Object { $_.bindingInformation -replace '\.', '_DOT_' }
# esperado: *:80:terbolinspira_DOT_com  y  *:80:www_DOT_terbolinspira_DOT_com

# proxy local (host header)
curl.exe -s -o NUL -w "%{http_code}`n" -H "Host: terbolinspira.com"     http://localhost   # 200
curl.exe -s -o NUL -w "%{http_code}`n" -H "Host: www.terbolinspira.com" http://localhost   # 200

# cadena de un asset estático (aislar 404 de estilos)
curl.exe -s -o NUL -w "node: %{http_code}`n" "http://localhost:3001/_next/static/chunks/<hash>.css"
curl.exe -s -o NUL -w "iis:  %{http_code}`n" -H "Host: terbolinspira.com" "http://localhost/_next/static/chunks/<hash>.css"
curl.exe -s -o NUL -w "cf:   %{http_code}`n" "https://terbolinspira.com/_next/static/chunks/<hash>.css"

# confirmar que es la app nueva (Next) y no el landing viejo (Astro)
curl.exe -s https://terbolinspira.com | findstr /I "_next _astro <title"
```

Checklist en navegador real (otra red / incógnito):

- [ ] `https://terbolinspira.com` y `www` cargan la app nueva **con estilos**
- [ ] Imágenes del CMS y productos cargan
- [ ] Navegación entre páginas OK

> Si carga sin estilos → casi seguro el bug del Copy-Item (paso 6): `node: 404`
> en el asset. Rehacer la copia con remove + `\*` y reiniciar el servicio.

---

## 11. Post-cutover

- **Cloudflare → Caching → Purge Everything** (limpia HTML viejo del landing).
- Confirmar **SSL/TLS = Flexible** (no subir a Full → rompe).
- **Webhook revalidate:** en el CMS Laravel apuntar la URL a
  `https://terbolinspira.com/api/revalidate` con header
  `x-revalidate-secret = REVALIDATE_SECRET`. Publicar contenido y confirmar refresh.
- **SMTP:** completar las 7 variables para activar el formulario de contacto.

### Rollback

```powershell
Stop-Website -Name "TerbolWeb"
```

Vuelve el landing estático viejo (`Default Web Site`) al instante. Purgar
Cloudflare si hace falta.

---

## 12. Despliegues posteriores

Ver [`operacion-app.md`](./operacion-app.md) §A. Resumen:
**`nssm stop` → `git pull` → `npm ci` → `npm run build` → copiar static/public/env
(remove + `\*`) → `nssm start`**. El servicio debe estar parado durante el build
(lock `EBUSY`).

---

## 13. Resumen de imprevistos (lecciones)

| Imprevisto | Causa | Solución aplicada |
|---|---|---|
| `npm run build` → `EBUSY rmdir .next\standalone` | El servicio node bloquea la carpeta | Parar el servicio antes de buildear |
| Sitio sin estilos, 404 en `/_next/static/*` | `Copy-Item -Recurse` anidó la carpeta al re-ejecutar | Remove destino + copiar contenido con `\*` |
| Servicio no arranca (`err.log` vacío) | `C:\Program Files\nodejs` no existe (node es nvm) | Apuntar a la ruta versionada real de nvm |
| `choco` no existe | Sin Chocolatey en el server | Descargar `nssm.exe` directo a `C:\Tools` |
| `Add-WebConfiguration` "duplicate entry" | Server vars ya agregadas | Error inofensivo, ignorar |
| `www` binding "con corchetes" | El chat auto-linkeaba `www.` (no era real) | Verificar con `-replace '\.', '_DOT_'` |

---

## 14. Seguridad

- El proceso Node escucha solo en `127.0.0.1:3001`. Nunca exponerlo público
  directo — el tráfico externo entra por IIS/Cloudflare con HTTPS.
- El sitio IIS apunta a `C:\Terbol\webapp-proxy` (carpeta vacía con solo
  `web.config`), **no** a `C:\Terbol\webapp`, para no exponer código fuente ni
  `.env.production`.
- No commitear `.env.production` (secretos). Fuera del repo.
- No correr `npm audit fix --force` (breaking changes).
- No tocar Laragon, el CMS ni los jobs de SQL Server en `C:\Terbol\TerbolInspira`.
</content>
