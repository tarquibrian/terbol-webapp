# Operación rápida — Terbol WebApp (servidor Windows)

Guía corta del día a día: cómo actualizar la app tras cambios, y cómo
arrancarla / detenerla. Para la instalación desde cero ver
[`deploy-windows-iis.md`](./deploy-windows-iis.md).

## Datos del entorno (este servidor)

| Cosa | Valor |
|---|---|
| Carpeta de la app | `C:\Terbol\webapp` |
| Bundle que se ejecuta | `C:\Terbol\webapp\.next\standalone\server.js` |
| Puerto | `3001` (solo `127.0.0.1`) |
| Servicio | `TerbolWeb` (nssm) |
| nssm | `C:\Tools\nssm.exe` |
| Node | `C:\Users\Administrator\AppData\Local\nvm\v24.16.0\node.exe` |
| Variables | `C:\Terbol\webapp\.env.production` |
| Logs | `C:\Terbol\webapp\logs\out.log` / `err.log` |

---

## A. Actualizar la app (tras cambios en el proyecto)

Cada vez que hay cambios nuevos en el repo (o se editó `.env.production`),
hay que **rebuildear** y reiniciar el servicio. Las variables `NEXT_PUBLIC_*`
se compilan dentro del build, por eso siempre se rebuildea.

```powershell
cd C:\Terbol\webapp

# 1. Traer cambios
git pull

# 2. Instalar dependencias (solo si cambió package.json / package-lock)
npm ci

# 3. Build
npm run build

# 4. Completar el bundle standalone (Next no copia estos solo)
Copy-Item -Recurse -Force .next\static .next\standalone\.next\static
Copy-Item -Recurse -Force public        .next\standalone\public
Copy-Item -Force          .env.production .next\standalone\.env.production

# 5. Reiniciar el servicio
C:\Tools\nssm.exe restart TerbolWeb

# 6. Verificar
C:\Tools\nssm.exe status TerbolWeb                              # SERVICE_RUNNING
curl.exe -s -o NUL -w "%{http_code}`n" http://localhost:3001   # 200
```

> Si solo se cambió `.env.production` y **ninguna** `NEXT_PUBLIC_*`, alcanza con
> repetir el paso 4 (copiar el `.env`) + paso 5 (restart). Si cambió una
> `NEXT_PUBLIC_*`, hay que rebuildear (pasos 3–5).

---

## B. Arrancar / detener / reiniciar la app

La app corre como servicio de Windows `TerbolWeb`. Se controla con nssm o con
los comandos nativos de servicios.

```powershell
# Arrancar
C:\Tools\nssm.exe start TerbolWeb

# Detener
C:\Tools\nssm.exe stop TerbolWeb

# Reiniciar
C:\Tools\nssm.exe restart TerbolWeb

# Estado
C:\Tools\nssm.exe status TerbolWeb        # SERVICE_RUNNING | SERVICE_STOPPED
```

Equivalente con comandos nativos de Windows (sirven igual):

```powershell
Start-Service  TerbolWeb
Stop-Service   TerbolWeb
Restart-Service TerbolWeb
Get-Service    TerbolWeb
```

El servicio arranca **solo al prender el servidor** (auto-start). No hay que
hacer nada tras un reinicio del server.

---

## C. Ver logs / diagnosticar

```powershell
# salida y errores de la app
Get-Content C:\Terbol\webapp\logs\err.log -Tail 30
Get-Content C:\Terbol\webapp\logs\out.log -Tail 30

# errores del servicio (no arranca, etc.)
Get-EventLog -LogName Application -Source nssm -Newest 5 | Format-List TimeGenerated, Message

# ¿está escuchando el puerto?
netstat -ano | findstr ":3001"
```

Problemas comunes:

| Síntoma | Causa | Fix |
|---|---|---|
| `SERVICE_STOPPED` al arrancar, `err.log` vacío | Ruta de node mal o cambió por nvm | `nssm get TerbolWeb Application`; corregir a la ruta versionada |
| Página sin estilos / 404 en `/_next/static` | Faltó copiar `.next/static` | Repetir paso 4 (Copy-Item) + restart |
| Puerto 3001 ocupado | Quedó un `node server.js` manual corriendo | `netstat -ano \| findstr ":3001"` → `taskkill /PID <pid> /F` |
| Build falla `[env] Falta la variable...` | Falta una `NEXT_PUBLIC_*` requerida | Completar `.env.production` y rebuildear |

---

## D. Pendiente (lo hace el dev de despliegue)

La app queda corriendo en `127.0.0.1:3001` como servicio. **Falta** la capa de
exposición pública (no incluida en esta guía):

- Sitio IIS + reverse proxy → `127.0.0.1:3001` (ver `deploy-windows-iis.md` §9)
- Dominio + HTTPS (Cloudflare u otro)
- **Rebuild con `NEXT_PUBLIC_SITE_URL` = dominio final** (hoy está en `localhost`)
- `REVALIDATE_SECRET` + apuntar el webhook del CMS al sitio nuevo
- Credenciales del API de productos (`PRODUCTS_API_KEY` / `TOKEN`)
- SMTP real para el formulario de contacto
</content>
