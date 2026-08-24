# Operación rápida — Terbol WebApp (servidor Windows)

Guía del día a día: cómo actualizar la app tras cambios, arrancarla / detenerla y
diagnosticar problemas. Para la instalación desde cero ver
[`deploy-windows-iis.md`](./deploy-windows-iis.md).

> ⚠️ **Este documento describe la operación con la app en el dominio raíz.**
> Mientras el cutover de `/qas` a root no esté hecho, seguir
> [`plan-cutover-root.md`](./plan-cutover-root.md).

## Datos del entorno (este servidor)

| Cosa | Valor |
|---|---|
| Carpeta de la app | `C:\Terbol\webapp` |
| Bundle que se ejecuta | `C:\Terbol\webapp\.next\standalone\server.js` |
| Puerto interno | `3001` (solo `127.0.0.1`) |
| Servicio | `TerbolWeb` (nssm) |
| nssm | `C:\Tools\nssm.exe` |
| Node | `C:\Users\Administrator\AppData\Local\nvm\v24.16.0\node.exe` |
| Variables | `C:\Terbol\webapp\.env.production` |
| Logs | `C:\Terbol\webapp\logs\out.log` / `err.log` |
| Sitio IIS (reverse proxy) | `TerbolWeb` → `C:\Terbol\webapp-proxy\web.config` |
| Dominio público | `terbolinspira.com` + `www` (HTTPS por Cloudflare) |
| Landing de respaldo | Astro en `Default Web Site` (catch-all `*:80`, `C:\inetpub\wwwroot`) |

> La app escucha **siempre** en `127.0.0.1:3001`. El dominio no reemplaza eso:
> Cloudflare → IIS → `127.0.0.1:3001`. El puerto interno es la app; el dominio es
> la puerta pública.

---

## A. Actualizar la app (tras cambios en el proyecto)

⚠️ **El servicio debe estar DETENIDO durante el build.** El proceso node corre
desde `.next\standalone` y bloquea la carpeta: si no se para, `next build` falla
con `EBUSY: resource busy or locked, rmdir '...\.next\standalone'`.

```powershell
cd C:\Terbol\webapp

# 1. El landing Astro toma el tráfico mientras dura el deploy
Stop-Website -Name "TerbolWeb"

# 2. Traer cambios
git pull

# 3. Instalar dependencias solo si cambió package.json / package-lock
git diff HEAD@{1} --name-only | findstr package
# Si lista package.json/package-lock.json:
# npm ci

# 4. DETENER el servicio (libera el lock de .next\standalone)
C:\Tools\nssm.exe stop TerbolWeb

# 5. Build con deployment id del commit actual
$deployId = git rev-parse --short HEAD
$env:NEXT_DEPLOYMENT_ID = $deployId
npm run build

# 6. Completar el bundle standalone  ← ver nota del Copy-Item abajo
$std = "C:\Terbol\webapp\.next\standalone"
Remove-Item -Recurse -Force "$std\.next\static" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$std\public"       -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force "$std\.next\static" | Out-Null
New-Item -ItemType Directory -Force "$std\public"       | Out-Null
Copy-Item -Recurse -Force "C:\Terbol\webapp\.next\static\*" "$std\.next\static"
Copy-Item -Recurse -Force "C:\Terbol\webapp\public\*"       "$std\public"
Copy-Item -Force          "C:\Terbol\webapp\.env.production" "$std\.env.production"

# 7. Arrancar el servicio
C:\Tools\nssm.exe start TerbolWeb
Start-Sleep -Seconds 2

# 8. Verificar la app ANTES de exponerla
C:\Tools\nssm.exe status TerbolWeb                              # SERVICE_RUNNING
curl.exe -s -o NUL -w "%{http_code}`n" http://localhost:3001   # 200

# 9. Devolver el tráfico a la app
Start-Website -Name "TerbolWeb"

# 10. Verificar deployment id (debe mostrar el SHA corto del commit)
$html = curl.exe -s -H "Host: terbolinspira.com" "http://localhost/promoter"
if ($html -match 'data-dpl-id="([^"]+)"') { "deployment id: $($Matches[1])" }
```

> ### Por qué se apaga el sitio IIS primero
>
> Durante el build el proceso node está detenido. Sin el paso 1 los visitantes
> reciben un **502** del reverse proxy; con él, `terbolinspira.com` vuelve al
> catch-all del `Default Web Site` y ven el landing Astro. Las apps de asesores y
> los servicios siguen funcionando igual (los sirve el catch-all).
>
> El landing es viejo y tiene otras rutas: los deep links (`/products`, etc.) darán
> 404 en esa ventana. Deployar en horario de bajo tráfico y que la ventana sea corta.

> ### Deployment ID
>
> Antes del build se define `NEXT_DEPLOYMENT_ID` con el SHA corto del commit.
> Next lo inserta en el HTML como `data-dpl-id`, agrega `?dpl=<id>` a assets
> estáticos y usa headers de navegación para detectar si el cliente intenta
> navegar con una versión anterior del build. Si detecta mismatch, fuerza una
> navegación completa en vez de reutilizar una navegación client-side vieja.
>
> Esto corrige problemas de mezcla entre builds después de un deploy. No reemplaza
> `revalidateTag` ni `CMS_REVALIDATE_SECONDS`, que siguen controlando la frescura
> del contenido que viene del CMS.

> ### ⚠️ Bug conocido del Copy-Item (assets sin estilos)
>
> `Copy-Item -Recurse .next\static .next\standalone\.next\static` **falla al
> re-ejecutar**: si el destino ya existe, copia la carpeta *adentro* y crea
> `...\.next\static\static\...` (anidado). Resultado: node devuelve **404** en
> `/_next/static/*` y el sitio se ve **sin estilos**.
>
> Por eso el paso 5 **borra el destino y copia el CONTENIDO** con `\*`. Usar
> siempre esa versión, no la corta.
>
> Síntoma típico: la app carga pero sin CSS/JS. Verificar con:
> ```powershell
> # tomar un asset real del HTML y probarlo:
> curl.exe -s -o NUL -w "%{http_code}`n" "http://localhost:3001/_next/static/chunks/<hash>.css"
> ```
> Si da 404 → repetir el paso 5 (remove + copia con `\*`) y reiniciar el servicio.

> Si solo cambiaste `.env.production` y **ninguna** `NEXT_PUBLIC_*`: alcanza con
> copiar el `.env` (parte del paso 5) + reiniciar (`nssm restart TerbolWeb`),
> sin build. Las `NEXT_PUBLIC_*` sí exigen rebuild (se compilan en el build).

### Downtime

Durante el build el sitio está caído unos segundos (servicio parado). Pre-cutover
no afecta. Si el downtime visible es un problema, buildear en una carpeta aparte
y hacer swap; por ahora el flujo simple alcanza.

---

## B. Arrancar / detener / reiniciar la app

```powershell
C:\Tools\nssm.exe start   TerbolWeb
C:\Tools\nssm.exe stop    TerbolWeb
C:\Tools\nssm.exe restart TerbolWeb
C:\Tools\nssm.exe status  TerbolWeb     # SERVICE_RUNNING | SERVICE_STOPPED
```

Equivalente con comandos nativos de Windows:

```powershell
Start-Service  TerbolWeb
Stop-Service   TerbolWeb
Restart-Service TerbolWeb
Get-Service    TerbolWeb
```

El servicio arranca **solo al prender el servidor** (auto-start). No hay que hacer
nada tras un reinicio del server.

---

## C. Logs / diagnóstico

```powershell
# salida y errores de la app
Get-Content C:\Terbol\webapp\logs\err.log -Tail 30
Get-Content C:\Terbol\webapp\logs\out.log -Tail 30

# errores del servicio (no arranca, etc.)
Get-EventLog -LogName Application -Source nssm -Newest 5 | Format-List TimeGenerated, Message

# ¿está escuchando el puerto?
netstat -ano | findstr ":3001"

# cadena completa de un asset (aislar dónde falla)
curl.exe -s -o NUL -w "node: %{http_code}`n" "http://localhost:3001/_next/static/chunks/<hash>.css"
curl.exe -s -o NUL -w "iis:  %{http_code}`n" -H "Host: terbolinspira.com" "http://localhost/_next/static/chunks/<hash>.css"
curl.exe -s -o NUL -w "cf:   %{http_code}`n" "https://terbolinspira.com/_next/static/chunks/<hash>.css"
```

### Problemas comunes (vistos en producción)

| Síntoma | Causa | Fix |
|---|---|---|
| `EBUSY ... rmdir '...\.next\standalone'` en el build | Servicio corriendo bloquea la carpeta | `nssm stop TerbolWeb` antes de `npm run build` |
| Sitio carga **sin estilos**, 404 en `/_next/static/*` | `Copy-Item` anidó la carpeta (`...\static\static`) | Paso 5 con remove + copia `\*`; reiniciar servicio |
| `SERVICE_STOPPED` al arrancar, `err.log` vacío | Ruta de node mal (cambió por nvm) | `nssm get TerbolWeb Application`; apuntar a `...\nvm\v24.16.0\node.exe` |
| Puerto 3001 ocupado | Quedó un `node server.js` manual corriendo | `netstat -ano \| findstr ":3001"` → `taskkill /PID <pid> /F` |
| Build falla `[env] Falta la variable...` | Falta una `NEXT_PUBLIC_*` requerida | Completar `.env.production` y rebuildear |
| Imágenes del CMS no cargan | Host no permitido en `remotePatterns` | Verificar `NEXT_PUBLIC_STORAGE_URL` |
| `node: 200` pero `cf: 404` | Cloudflare sirve caché vieja | Cloudflare → Caching → Purge Everything |

---

## D. Convivencia con los otros servicios del servidor

El dominio `terbolinspira.com` lo atiende el sitio `TerbolWeb`, pero las apps de
Venta por Catálogo y los servicios viven en el `Default Web Site`. Para que sigan
respondiendo por el dominio, están **replicadas** como aplicaciones dentro de
`TerbolWeb` (misma carpeta física, mismo app pool) y sus prefijos están
**excluidos** del reverse proxy en `C:\Terbol\webapp-proxy\web.config`.

> ⚠️ **Si alguien agrega una aplicación nueva bajo `Default Web Site` que deba
> responder por `terbolinspira.com`, hay que hacer dos cosas:**
>
> 1. Registrarla también en `TerbolWeb`, con la misma carpeta y el mismo app pool.
> 2. Agregar su prefijo a las exclusiones de la regla `ReverseProxyToNext`.
>
> Si falta cualquiera de las dos, el reverse proxy se come el request y devuelve
> **404**.

Ver qué hay registrado hoy:

```powershell
Get-WebApplication -Site "TerbolWeb" | Select-Object path, applicationPool, physicalPath | Format-Table -AutoSize
Get-WebApplication -Site "Default Web Site" | Select-Object path, applicationPool | Format-Table -AutoSize
```

Comprobar de una pasada que ningún servicio ajeno se rompió:

```powershell
foreach ($p in '/VentaPorCatalogo/PRD','/VentaPorCatalogo/QAS','/VentaPorCatalogoApi/PRD','/VentaPorCatalogoApi/QAS','/ServicioVPC/PRD','/ServicioVPC/QAS','/ServicioECO/PRD','/ServicioECO/QAS') {
  "{0,-30} {1}" -f $p, (curl.exe -s -o NUL -w "%{http_code}" -H "Host: terbolinspira.com" "http://localhost$p")
}
```

> **Nunca correr `iisreset`**: reinicia todos los sitios del servidor, incluido el
> CMS y las apps de asesores. Usar `Stop-Website` / `Start-Website` por sitio.

---

## E. Cloudflare

- Termina el HTTPS. Modo SSL = **Flexible** (el origen IIS escucha HTTP:80, sin
  cert 443). **No** subir a Full/Full strict → rompería (origen no tiene cert).
- `cf-cache-status: DYNAMIC` en el HTML = no cachea el HTML (bien).
- Tras un cutover o cambio grande: **Purge Everything** para limpiar caché vieja.

---

## F. Rollback

```powershell
Stop-Website -Name "TerbolWeb"     # detiene el sitio IIS reverse-proxy
```

El tráfico de `terbolinspira.com` vuelve al landing estático viejo
(`Default Web Site`, catch-all). Purgar Cloudflare si hace falta. La app y su
servicio quedan intactos para reintentar.
</content>
