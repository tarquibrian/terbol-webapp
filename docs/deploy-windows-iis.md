# Despliegue — Terbol WebApp en Windows Server (IIS + Node)

Guía para desplegar **terbol-webapp** (Next.js 16, App Router) en el servidor
Windows de producción, desde cero. Pensada para que cualquier persona pueda
reproducir el despliegue sin contexto previo.

---

## 1. Resumen de la arquitectura

La app es un **servidor Node** (no un sitio estático): usa SSR, ISR
(`revalidateTag`) y route handlers (`/api/*`). No se puede servir como archivos
estáticos en IIS — tiene que correr un proceso Node vivo, con IIS por delante
haciendo reverse proxy.

```
Cloudflare (termina HTTPS)
        │  https://terbolinspira.com
        ▼
IIS  ── sitio "TerbolWeb" (binding terbolinspira.com, puerto 80)
        │  reverse proxy (ARR + URL Rewrite)
        ▼
node server.js  (127.0.0.1:3001)   ← build standalone de Next.js
        ▲
        └── lo mantiene vivo un Servicio de Windows (nssm)
```

- **HTTPS / dominio:** lo maneja Cloudflare por delante. El origen IIS escucha
  HTTP en el puerto 80. Confirmar con el Paso 7.
- **Rollback:** el landing estático viejo (Astro, en `Default Web Site`) queda
  intacto. Si algo falla, se detiene el sitio nuevo y el tráfico vuelve solo.

---

## 2. Contexto del servidor (estado conocido)

| Componente | Detalle |
|---|---|
| Node | v24.x ya instalado (`node -v`) |
| Web server | IIS (W3SVC), puerto 80 |
| ARR + URL Rewrite | **Ya instalados** — IIS puede reverse-proxy a Node |
| Landing actual | Sitio estático Astro en `Default Web Site` (`C:\inetpub\wwwroot`) |
| CMS | Laravel en `cms.terbolinspira.com` (`C:\inetpub\wwwroot\cms`) |
| Otros | .NET (`C:\App`), SQL Server, Laragon (Apache:81, MySQL:3306, MailHog:1025/8025) |
| Puerto de la app | **3001** (libre — verificar antes con `netstat`) |

> ⚠️ `C:\Terbol\TerbolInspira` **está en uso** por jobs de SQL Server
> (`SqlServer\*.bat`, `log_sp.txt`). **No** poner la webapp ahí.
> La webapp va en `C:\Terbol\webapp`.

---

## 3. Prerrequisitos

Verificar en el servidor (PowerShell):

```powershell
node -v        # debe ser 24.x  (la app exige >=24 <25)
npm -v
git --version

# Puerto 3001 libre:
netstat -ano | findstr ":3001"   # no debe devolver nada

# ARR + URL Rewrite presentes:
Get-WebGlobalModule | Where-Object { $_.Name -match "ApplicationRequestRouting|RewriteModule" } | Select Name
```

Si falta ARR/URL Rewrite: instalar desde el "Web Platform Installer" o los MSI
oficiales de Microsoft (URL Rewrite 2.1 + Application Request Routing 3.0).

---

## 4. Obtener el código

```powershell
mkdir C:\Terbol\webapp
cd C:\Terbol\webapp
git clone <URL-DEL-REPO> .
# Despliegues posteriores: git pull
```

---

## 5. Variables de entorno

Crear `C:\Terbol\webapp\.env.production`.

> Las variables `NEXT_PUBLIC_*` se **compilan dentro del build** → tienen que
> existir **antes** de `npm run build`. Si cambian, hay que volver a buildear.

### Requeridas (la app hace *fail-fast* en producción si faltan)

```
NEXT_PUBLIC_SITE_URL=https://terbolinspira.com
NEXT_PUBLIC_API_URL=https://cms.terbolinspira.com/api
NEXT_PUBLIC_STORAGE_URL=https://cms.terbolinspira.com/storage
```

### Solo-servidor (opcionales, degradan controlado si faltan)

```
# Webhook de revalidación ISR. Debe coincidir con el header
# x-revalidate-secret que envía el CMS Laravel.
REVALIDATE_SECRET=<mismo token que usa el CMS>

# Auth del API de productos del CMS (si el endpoint lo exige).
# Sacar valores del .env del CMS: C:\inetpub\wwwroot\cms\.env
PRODUCTS_API_TOKEN=
PRODUCTS_API_KEY=
PRODUCTS_API_KEY_HEADER=ApiKey

# SMTP del formulario de contacto (/about). Si se dejan vacíos,
# /api/contact responde 500 controlado (no crashea).
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
CONTACT_TO=
CONTACT_FROM=
```

> **De dónde sacar los secretos:** `REVALIDATE_SECRET` y las credenciales de
> productos viven en el `.env` del CMS Laravel (`C:\inetpub\wwwroot\cms\.env`).
> Usar exactamente los mismos valores que el CMS ya usa con el landing actual.

---

## 6. Build y empaquetado

La app usa `output: "standalone"` en `next.config.ts` → el build genera un
bundle autocontenido en `.next/standalone/`.

```powershell
cd C:\Terbol\webapp
npm ci
npm run build
```

### Completar el bundle standalone

Next **no incluye** los assets del cliente ni `public/` en el standalone (asume
un CDN). Sin CDN, hay que copiarlos a mano para que `server.js` los sirva:

```powershell
Copy-Item -Recurse -Force .next\static .next\standalone\.next\static
Copy-Item -Recurse -Force public        .next\standalone\public
Copy-Item -Force          .env.production .next\standalone\.env.production
```

- `.next/static` → JS/CSS del cliente (si falta: páginas sin estilo, 404 en `/_next/static`)
- `public` → favicon, imágenes estáticas (si falta: 404 en esos archivos)
- `.env.production` → variables (el server las lee relativo a su carpeta)

Verificar:

```powershell
Test-Path .next\standalone\.next\static       # True
Test-Path .next\standalone\public             # True
Test-Path .next\standalone\.env.production     # True
```

### Prueba manual (antes de armar el servicio)

```powershell
cd C:\Terbol\webapp\.next\standalone
$env:PORT=3001
$env:NODE_ENV="production"
$env:HOSTNAME="127.0.0.1"
node server.js
# Debe imprimir: Ready on http://...:3001
```

En otra terminal:

```powershell
curl.exe -s -o NUL -w "%{http_code}`n" http://localhost:3001   # 200
```

O abrir `http://localhost:3001` en el navegador del server (Edge/Chrome — **no**
Laragon, que es el stack PHP, no un navegador). Revisar que carguen estilos,
imágenes del CMS y que `/api/products` devuelva datos. `Ctrl+C` para parar.

---

## 7. Confirmar quién termina el HTTPS

IIS solo escucha HTTP:80, así que el TLS lo hace algo por delante (probablemente
Cloudflare). Confirmar:

```powershell
nslookup terbolinspira.com
curl.exe -sI https://terbolinspira.com | findstr /I "server cf-ray"
```

- IPs `104.x` / `172.67.x` o header `cf-ray` / `server: cloudflare` → **Cloudflare**.
  El plan de reverse proxy aplica tal cual (origen HTTP).
- Si no es Cloudflare → revisar dónde está el certificado antes de continuar.

---

## 8. Mantener la app viva — Servicio de Windows (nssm)

Sin esto, la app muere al cerrar la terminal. `nssm` la corre como servicio que
arranca con el sistema y se reinicia si se cae.

```powershell
choco install nssm -y      # o descargar nssm.exe manualmente

nssm install TerbolWeb "C:\Program Files\nodejs\node.exe" "C:\Terbol\webapp\.next\standalone\server.js"
nssm set TerbolWeb AppDirectory "C:\Terbol\webapp\.next\standalone"
nssm set TerbolWeb AppEnvironmentExtra PORT=3001 NODE_ENV=production HOSTNAME=127.0.0.1
nssm set TerbolWeb Start SERVICE_AUTO_START
nssm start TerbolWeb
```

- `HOSTNAME=127.0.0.1` → la app solo escucha local. IIS la alcanza; el exterior
  no entra directo (entra por IIS/HTTPS).

Gestión del servicio:

```powershell
nssm restart TerbolWeb     # tras un nuevo build/deploy
nssm stop TerbolWeb
nssm status TerbolWeb
Get-Content C:\Terbol\webapp\.next\standalone\*.log   # si se configuran logs (ver abajo)
```

(Opcional) Redirigir logs a archivo:

```powershell
nssm set TerbolWeb AppStdout C:\Terbol\webapp\logs\out.log
nssm set TerbolWeb AppStderr C:\Terbol\webapp\logs\err.log
```

---

## 9. IIS — sitio + reverse proxy

Se crea un sitio IIS nuevo con binding al dominio. Como tiene host-header
específico, **gana** sobre el `Default Web Site` (catch-all) automáticamente. El
landing viejo queda de respaldo.

```powershell
New-Item -ItemType Directory -Force C:\Terbol\webapp-proxy | Out-Null
New-Website -Name "TerbolWeb" -Port 80 -HostHeader "terbolinspira.com" -PhysicalPath "C:\Terbol\webapp-proxy"
New-WebBinding -Name "TerbolWeb" -Protocol http -Port 80 -HostHeader "www.terbolinspira.com"
```

Crear `C:\Terbol\webapp-proxy\web.config`:

```xml
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
```

Activar el proxy de ARR y permitir las server variables (una sola vez por server):

```powershell
Set-WebConfigurationProperty -PSPath "MACHINE/WEBROOT/APPHOST" -Filter "system.webServer/proxy" -Name "enabled" -Value "True"
Add-WebConfiguration -Filter "system.webServer/rewrite/allowedServerVariables" -PSPath "MACHINE/WEBROOT/APPHOST" -AtIndex 0 -Value @{name="HTTP_X_FORWARDED_PROTO"}
Add-WebConfiguration -Filter "system.webServer/rewrite/allowedServerVariables" -PSPath "MACHINE/WEBROOT/APPHOST" -AtIndex 0 -Value @{name="HTTP_X_FORWARDED_HOST"}
```

> `X-Forwarded-Proto=https` le dice a Next que el cliente entró por HTTPS, para
> que genere URLs canónicas correctas aunque el origen sea HTTP.

---

## 10. Verificación antes del cutover

```powershell
curl.exe http://localhost:3001                              # node arriba (200)
curl.exe -H "Host: terbolinspira.com" http://localhost      # IIS → node (200)
```

Checklist funcional (en navegador):

- [ ] Home carga con estilos e imágenes del CMS
- [ ] `/api/products` devuelve datos (si vacío → faltan `PRODUCTS_API_*`)
- [ ] Formulario de contacto `/about` envía correo (si configuraste SMTP real)
- [ ] Navegación entre páginas OK
- [ ] **Webhook de revalidación:** en el CMS Laravel, apuntar la URL del webhook
      al nuevo sitio y verificar que `x-revalidate-secret` == `REVALIDATE_SECRET`.
      Publicar contenido en el CMS y confirmar que el sitio se actualiza.

---

## 11. Cutover (puesta en producción)

El DNS/Cloudflare ya apunta `terbolinspira.com` a esta IP. Al arrancar el sitio
IIS con host-header del dominio, gana sobre el `Default Web Site` y empieza a
servir la app nueva — sin tocar DNS.

```powershell
nssm start TerbolWeb           # asegurar app viva
Start-Website -Name "TerbolWeb"
```

### Rollback inmediato

```powershell
Stop-Website -Name "TerbolWeb"
```

El tráfico vuelve al landing estático viejo al instante. La app y su servicio
quedan intactos para reintentar.

---

## 12. Despliegues posteriores (actualizar la app)

```powershell
cd C:\Terbol\webapp
git pull
npm ci
npm run build
Copy-Item -Recurse -Force .next\static .next\standalone\.next\static
Copy-Item -Recurse -Force public        .next\standalone\public
Copy-Item -Force          .env.production .next\standalone\.env.production
nssm restart TerbolWeb
```

> La caché ISR vive en `.next/standalone/.next/cache`. Un nuevo build la
> regenera de cero — es normal, ISR la repuebla sola.

---

## 13. Troubleshooting

| Síntoma | Causa probable | Fix |
|---|---|---|
| Página sin estilos, 404 en `/_next/static/*` | No se copió `.next/static` | Re-correr los `Copy-Item`, reiniciar servicio |
| Imágenes del CMS no cargan | Host no permitido en `remotePatterns` | Verificar `NEXT_PUBLIC_STORAGE_URL` y `src/config/image-remote-patterns.ts` |
| Build falla con `[env] Falta la variable...` | Falta una `NEXT_PUBLIC_*` requerida | Completar `.env.production` y rebuildear |
| `/api/products` vacío | Falta auth del API del CMS | Setear `PRODUCTS_API_KEY` / `PRODUCTS_API_TOKEN` |
| Contenido no se actualiza al publicar en CMS | Webhook mal apuntado o secret distinto | Revisar URL del webhook + `REVALIDATE_SECRET` |
| IIS da 502 / no llega a node | App caída o puerto distinto | `nssm status TerbolWeb`; confirmar puerto 3001 en `web.config` |
| El sitio nuevo no toma el dominio | `Default Web Site` interfiere | Confirmar host-header binding en el sitio nuevo |

### Probar desde otra máquina (solo para pruebas, no producción)

Exponer el 3001 directo (sin proxy ni HTTPS) — **temporal**:

```powershell
# correr node con HOSTNAME=0.0.0.0 y abrir el puerto:
New-NetFirewallRule -DisplayName "TerbolWeb-test-3001" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow
# acceder: http://<IP-PUBLICA>:3001
# CERRAR al terminar:
Remove-NetFirewallRule -DisplayName "TerbolWeb-test-3001"
```

En cloud (Azure/AWS) además hay que abrir el puerto en el NSG/Security Group.

---

## 14. Notas de seguridad

- El proceso Node escucha solo en `127.0.0.1` en producción — nunca exponerlo
  público directo. Todo el tráfico externo entra por IIS/Cloudflare con HTTPS.
- No commitear `.env.production` (contiene secretos). Está fuera del repo.
- No correr `npm audit fix --force` (mete breaking changes). Las vulnerabilidades
  se revisan aparte.
- No tocar Laragon, el CMS ni los jobs de SQL Server en `C:\Terbol\TerbolInspira`.
```
