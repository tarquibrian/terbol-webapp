# Arquitectura de Renderizado y Caché

Cómo fluyen los datos desde el CMS hasta el navegador del usuario, y qué
estrategias de caché se aplican en cada capa.

---

## Resumen de estrategias por página

| Página | Estrategia | Datos en HTML | Skeleton |
| --- | --- | --- | --- |
| Home (`/`) | ISR (Server Component) | ✅ Sí | No |
| About (`/about`) | ISR (Server Component) | ✅ Sí | No |
| Science (`/science-and-quality`) | ISR (Server Component) | ✅ Sí | No |
| Promoter (`/promoter`) | ISR (Server Component) | ✅ Sí | No |
| FAQ (`/faq`) | ISR (Server Component) | ✅ Sí | No |
| Success Plan (`/success-plan`) | ISR (Server Component) | ✅ Sí | No |
| Blog (`/blog`) | CSR (Client Component) | ❌ No | Sí (breve) |
| Productos (`/products`) | CSR (Client Component) | ❌ No | Sí (breve) |
| Detalle producto (`/products/[id]`) | SSG + ISR | ✅ Sí | No |

---

## Flujo de datos — Páginas ISR (Server Components)

Home, About, Science, Promoter, FAQ, Success Plan.

```
Browser pide /home
    │
    ▼
Vercel CDN / servidor
    │
    ├── ¿Tiene HTML cacheado y fresco? ── SÍ ──→ Responde directo (rápido)
    │
    └── NO (expiró o fue purgado)
         │
         ▼
     Server Component ejecuta
         │
         ▼
     cmsApi.getHome() → fetch al CMS Laravel
         │
         ▼
     Renderiza HTML con data incluida
         │
         ▼
     Cachea el HTML + responde al browser
```

**Características:**
- El HTML llega con todo el contenido renderizado — no hay skeleton.
- El cache se refresca por webhook (`revalidateTag`) o por tiempo (`CMS_REVALIDATE_SECONDS`, `86400` por defecto).
- Cada página tiene su propio tag ISR (`home`, `about`, `science`, etc.).
- Después de un deploy, todas las páginas arrancan con cache caliente (pre-renderizadas en build).

---

## Flujo de datos — Página de Productos (CSR)

`/products` usa un componente `"use client"` (`ProductsView`) que obtiene datos
mediante `fetch()` en el navegador.

```
Browser                        Servidor (Vercel)               CMS (Laravel)
───────                        ─────────────────               ─────────────

ProductsView
"use client"
                               /api/products
  fetch("/api/products") ──→   (Route Handler)
                                    │
                                    ▼
                               getExternalProducts()
                                    │
                                    ▼
                               Data Cache (ISR)
                                    │
                               ¿Tiene data     ── SÍ ──→ Usa la cacheada
                                fresca?                   (no llama al CMS)
                                    │
                                   NO
                                    │
                                    └──────────────────→  fetch al CMS
                                                          guarda en cache
                                    │
                               ←── Responde JSON
  ←── Actualiza UI
```

**Características:**
- El browser siempre hace un `fetch()` fresco al API Route (sin cache del navegador).
- El API Route usa Data Cache con ISR para no bombardear el CMS.
- El skeleton es inevitable (CSR): el browser debe cargar JS, hidratar React, hacer el fetch HTTP.
- Se eligió CSR por la interactividad: filtros, paginación y búsqueda cambian dinámicamente sin recargar.

### ¿Por qué no ISR para productos?

ISR cachea **una** versión del HTML. La página de productos tiene combinaciones
dinámicas de filtros + paginación + búsqueda que no se pueden pre-renderizar.
Por eso se usa un componente cliente que reacciona a los cambios de URL.

---

## Flujo de datos — Detalle de Producto (SSG + ISR)

`/products/[id]` usa `generateStaticParams` para pre-renderizar todos los
productos conocidos en build time.

```
BUILD TIME:
  generateStaticParams() → obtiene IDs [1, 2, ..., 30]
  Next.js renderiza /products/1, /products/2, ..., /products/30
  Todos quedan cacheados con data incluida.

RUNTIME:
  /products/10 → cache hit → responde instantáneo
  /products/51 (nuevo) → no existe en cache → renderiza al vuelo → cachea
```

**Producto nuevo que no existía en el build:** se renderiza on-demand la primera
vez que alguien visita su URL. No necesita webhook para que la página de detalle
funcione, pero sí lo necesita para aparecer en la lista de productos.

---

## Capas de caché

Hay tres capas de caché que intervienen:

```
┌──────────────────────────────────────────────────────────┐
│  Capa 1: Browser Cache                                   │
│  ─────────────────                                       │
│  Las respuestas de /api/products y /api/products/filters │
│  tienen Cache-Control: no-store → el browser NO cachea.  │
│  Siempre pide data fresca al servidor.                   │
└──────────────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────┐
│  Capa 2: Full Route Cache (páginas estáticas)            │
│  ──────────────────────────                               │
│  Next.js cachea el HTML completo de páginas ISR/SSG.     │
│  Se purga con revalidateTag() o expira por tiempo.       │
│  Aplica a: Home, About, Science, /products/[id], etc.    │
│  NO aplica a: /api/products ni /api/products/filters     │
│  (ambos son force-dynamic).                              │
└──────────────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────┐
│  Capa 3: Data Cache (fetches individuales)                │
│  ──────────────────────                                   │
│  Next.js cachea cada fetch() del servidor al CMS.        │
│  Controlado por: next.revalidate + next.tags              │
│  Se purga con revalidateTag() o expira en 86400s.        │
│  Aplica a: todos los fetches al CMS desde Route          │
│  Handlers y Server Components.                           │
└──────────────────────────────────────────────────────────┘
```

---

## Webhook de revalidación

El CMS puede purgar el cache enviando:

```http
POST /api/revalidate
x-revalidate-secret: <REVALIDATE_SECRET>
Content-Type: application/json

{ "tag": "products" }
```

Tags disponibles:

| Tag | Qué purga |
| --- | --- |
| `home` | Página Home |
| `about` | Página About |
| `success-plan` | Página Plan de Éxito |
| `learn` | Página Aprender / Blog |
| `help` | Página FAQ |
| `promoter` | Página Promoter |
| `science` | Página Ciencia y Calidad |
| `footer` | Footer global |
| `advisor-registration` | Formulario de registro de asesor |
| `products` | Lista de productos, filtros y detalles |
| `blog` | Lista de artículos y detalle de artículo |

Un solo tag `products` purga todo lo relacionado con productos (lista, filtros,
detalles individuales) porque todos los fetches usan el mismo tag.

---

## Tiempos de refresco

| Escenario | ¿Cuándo ve el usuario los cambios? |
| --- | --- |
| CMS envía webhook | Próximo request después del webhook |
| Sin webhook, alguien visita la página | Stale-while-revalidate: ve data vieja, el siguiente ve la nueva |
| Sin webhook, nadie visita | El cache no se refresca solo — se refresca cuando alguien entra |
| Máximo delay sin webhook | ~1 día (`CMS_REVALIDATE_SECONDS = 86400`) desde la última visita |
| Nuevo deploy | Todas las páginas ISR/SSG se regeneran durante `npm run build`; el `deploymentId` evita mezclar assets/payloads de builds distintos |

---

## Deployment ID y version skew

En self-hosting, un deploy puede dejar al navegador o a una capa intermedia con
HTML, RSC payloads o assets de una versión anterior mientras el servidor ya corre
otra. Ese problema se conoce como **version skew**: la app puede intentar navegar
client-side con datos prefetched o JavaScript de un build viejo.

La app lee `NEXT_DEPLOYMENT_ID` en `next.config.ts` y lo pasa a Next como
`deploymentId`. En el proceso operativo se define con el SHA corto del commit
antes de `npm run build`:

```powershell
$deployId = git rev-parse --short HEAD
$env:NEXT_DEPLOYMENT_ID = $deployId
npm run build
```

Cuando `deploymentId` está activo, Next:

- Inserta `data-dpl-id="<id>"` en el `<html>`.
- Agrega `?dpl=<id>` a URLs de assets estáticos.
- Envía headers de navegación para comparar el deployment del cliente con el del
  servidor.
- Si detecta un mismatch, hace una navegación completa en lugar de seguir con una
  navegación client-side incompatible.

Esto **no** reemplaza `revalidateTag` ni `CMS_REVALIDATE_SECONDS`: esos mecanismos
controlan la frescura del contenido del CMS. `deploymentId` controla coherencia
entre versiones de build.

Verificación rápida:

```powershell
$html = curl.exe -s -H "Host: terbolinspira.com" "http://localhost/qas/promoter"
if ($html -match 'data-dpl-id="([^"]+)"') { "deployment id: $($Matches[1])" }
```

---

## Timeout de seguridad

Todos los fetches al CMS externo tienen un timeout de **8 segundos**
(`AbortSignal.timeout(8000)`). Si el CMS no responde en ese tiempo, el fetch
falla y la app muestra un estado controlado (error o vacío) en lugar de dejar
al usuario esperando indefinidamente.

Esto es especialmente útil en **cold starts** de servidores serverless (Vercel)
donde la primera petición puede ser más lenta.
