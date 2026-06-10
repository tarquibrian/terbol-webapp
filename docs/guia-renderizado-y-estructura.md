# Guía de Renderizado y Estructura del Proyecto

Esta guía explica detalladamente las estrategias de renderizado de Next.js (App Router) aplicadas en **Terbol WebApp**, el flujo de datos desde el CMS hasta el navegador y cómo está organizado el código bajo la arquitectura de **Vertical Slices (Feature-First)**.

---

## 1. Estrategias de Renderizado en Next.js

Next.js (App Router) permite mezclar diferentes estrategias de renderizado en un mismo proyecto según las necesidades de negocio y rendimiento.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          ¿CUÁNDO SE RENDERIZA?                           │
├───────────────────────┬──────────────────────────────────────────────────┤
│ En Build (SSG/ISR)     │ Una vez durante el despliegue. Servido desde CDN │
├───────────────────────┼──────────────────────────────────────────────────┤
│ En Servidor (SSR)     │ En cada request que hace el usuario al servidor  │
├───────────────────────┼──────────────────────────────────────────────────┤
│ En Navegador (CSR)    │ En el cliente mediante JavaScript reactivo       │
└───────────────────────┴──────────────────────────────────────────────────┘
```

### A. SSG (Static Site Generation)
- **Concepto:** Las páginas se compilan y renderizan a HTML estático una sola vez en el momento del build (`npm run build`).
- **Comportamiento en Terbol:** Las páginas de detalle de producto (`/products/[id]`) usan esta estrategia para los productos que ya existen durante el despliegue a través del método `generateStaticParams()`.
- **Ventaja:** Carga instantánea y excelente para SEO.

### B. ISR (Incremental Static Regeneration)
- **Concepto:** Es una evolución de SSG. Permite actualizar páginas estáticas individuales **después** del build, sin necesidad de reconstruir todo el sitio.
- **Mecanismos de actualización:**
  1. **Por Tiempo (`revalidate`):** Se define un tiempo de vida (ej: 3600 segundos). Cuando expira y entra un request, Next.js regenera el HTML en segundo plano (patrón *stale-while-revalidate*).
  2. **Bajo Demanda (`revalidateTag`):** El servidor limpia el caché inmediatamente cuando se lo solicita un webhook externo del CMS.
- **Comportamiento en Terbol:** La mayoría de las páginas estáticas del sitio (Home, About, Science, FAQ, etc.) usan ISR. El HTML llega completo y sin skeletons.

### C. SSR / Dynamic Rendering (Server-Side Rendering)
- **Concepto:** La página o ruta se renderiza en el servidor en **cada petición** del usuario.
- **Cuándo se activa:** Cuando la ruta usa funciones dinámicas (cookies, headers, `useSearchParams`) o cuando se fuerza explícitamente con `export const dynamic = "force-dynamic"`.
- **Comportamiento en Terbol:** Los Route Handlers `/api/products` y `/api/products/filters` usan `force-dynamic` para asegurar que las peticiones se procesen en cada llamada. Aunque se ejecutan en cada request, internamente usan el **Data Cache** (ISR de datos) para evitar saturar el CMS Laravel.

### D. CSR (Client-Side Rendering)
- **Concepto:** El servidor entrega un cascarón HTML vacío (o un skeleton) y es el navegador del usuario el que descarga el JavaScript, monta React, realiza las peticiones HTTP y renderiza el contenido.
- **Comportamiento en Terbol:** La página `/products` usa CSR porque depende de un componente cliente (`ProductsView`) que reacciona de forma dinámica a filtros, ordenamientos y paginación en la URL.

---

## 2. Mapa de Estrategias por Página en Terbol

| Página / Ruta | Tipo de Renderizado | ¿Tiene data en el HTML? | ¿Muestra Skeleton? | Mecanismo de Caché |
|---|---|---|---|---|
| Home (`/`) | **ISR** (Server Component) | ✅ Sí | ❌ No | Caché de página (Full Route Cache) |
| Nosotros (`/about`) | **ISR** (Server Component) | ✅ Sí | ❌ No | Caché de página (Full Route Cache) |
| Ciencia (`/science-and-quality`) | **ISR** (Server Component) | ✅ Sí | ❌ No | Caché de página (Full Route Cache) |
| Promotor (`/promoter`) | **ISR** (Server Component) | ✅ Sí | ❌ No | Caché de página (Full Route Cache) |
| Preguntas Frecuentes (`/faq`) | **ISR** (Server Component) | ✅ Sí | ❌ No | Caché de página (Full Route Cache) |
| Plan de Éxito (`/success-plan`) | **ISR** (Server Component) | ✅ Sí | ❌ No | Caché de página (Full Route Cache) |
| Detalle de Producto (`/products/[id]`) | **SSG + ISR** | ✅ Sí | ❌ No | Caché de página + dynamicParams |
| Catálogo de Productos (`/products`) | **CSR** (Client Component) | ❌ No (solo el layout) | ✅ Sí (breve) | Carga reactiva del lado del navegador |
| API Listado (`/api/products`) | **SSR** (Route Handler) | ❌ No (devuelve JSON) | - | force-dynamic + Data Cache interno |
| API Filtros (`/api/products/filters`) | **SSR** (Route Handler) | ❌ No (devuelve JSON) | - | force-dynamic + Data Cache interno |

---

## 3. Entendiendo el Flujo de la Página de Productos (CSR)

Dado que la página de productos es dinámica, el flujo de llamadas ocurre en dos saltos de red (*double-hop*):

```
┌─────────┐                ┌──────────────────┐                ┌─────────────┐
│ Browser │                │ Servidor Vercel  │                │ CMS Laravel │
│ (Client)│                │   (Next.js API)  │                │  (Backend)  │
└────┬────┘                └────────┬─────────┘                └──────┬──────┘
     │                              │                                 │
     │ 1. Pide /products            │                                 │
     ├─────────────────────────────>│                                 │
     │                              │                                 │
     │ 2. Devuelve HTML (Skeleton)  │                                 │
     │<─────────────────────────────┤                                 │
     │                              │                                 │
     │ 3. useEffect() ejecuta:      │                                 │
     │    fetch("/api/products")    │                                 │
     ├─────────────────────────────>│                                 │
     │                              │ 4. ¿Tiene copia fresca en       │
     │                              │    el Data Cache?               │
     │                              ├────────┐                        │
     │                              │        │ SÍ (Caché hit)         │
     │                              │<───────┘                        │
     │                              │                                 │
     │                              │ -- SINO (Caché miss/expired) -- │
     │                              │ 5. fetch("api.terbol.com/...")  │
     │                              ├────────────────────────────────>│
     │                              │                                 │
     │                              │ 6. Retorna JSON y lo guarda     │
     │                              │<────────────────────────────────┤
     │                              │                                 │
     │ 7. Retorna JSON al cliente   │                                 │
     │<─────────────────────────────┤                                 │
     │                              │                                 │
     │ 8. Oculta skeleton y         │                                 │
     │    renderiza los productos   │                                 │
     *                              *                                 *
```

---

## 4. Preguntas Frecuentes (FAQ) de Caché y Carga

### ¿Por qué la página de productos muestra un skeleton inicialmente si la data está cacheada?
Porque es un componente cliente (`"use client"`). 
1. El navegador descarga el HTML inicial de `/products` que no contiene los productos renderizados (es una cáscara estática).
2. Luego se monta el componente en el navegador y se dispara el hook `useEffect` que inicia la petición a `/api/products`.
3. Aunque la respuesta de `/api/products` sea instantánea porque está cacheada en el servidor de Next.js, **siempre hay un viaje de red** (Browser -> Servidor -> Browser) que toma unos milisegundos. Durante este viaje de red, se muestra la animación de esqueleto para evitar saltos bruscos de maquetación.

### ¿Cuál es la diferencia concreta entre SSR e ISR?
- **ISR (Incremental Static Regeneration):** El servidor guarda un archivo HTML ya renderizado en disco. Cuando el usuario entra, se le sirve ese archivo instantáneamente. Si el caché expiró, se le entrega esa versión vieja (stale) de todos modos, y el servidor se pone a reconstruir el HTML en segundo plano para el siguiente usuario.
- **SSR (Server-Side Rendering):** El servidor **no** tiene ningún HTML guardado de antemano. Cuando el usuario entra, el servidor realiza los fetches al CMS en ese mismo instante, espera a que terminen, construye el HTML y se lo envía. Si el CMS tarda 2 segundos en responder, el usuario ve la pantalla en blanco durante 2 segundos antes de empezar a recibir la página.

### ¿Qué pasa si nadie ingresa al sitio por 2 días?
1. Los servidores Serverless (ej: Vercel) entran en reposo y limpian sus cachés temporales si no hay tráfico (evicción).
2. El primer usuario que ingrese después de ese tiempo experimentará un **Cold Start (arranque en frío)**:
   - El servidor de Next.js tarda un poco más en arrancar la función.
   - El caché está vacío, por lo que Next.js obligatoriamente debe ir a consultar al CMS Laravel.
   - Si el CMS Laravel también estuvo inactivo, su base de datos y servidor también tardarán en responder.
3. Para evitar que la petición al CMS se quede colgada de forma indefinida en estos escenarios, implementamos un **timeout de seguridad de 8 segundos** (`AbortSignal.timeout(8000)`). Si el CMS excede ese tiempo, la petición se cancela y el frontend muestra un estado vacío controlado en lugar de congelarse.

### Si agrego un producto nuevo al CMS, ¿el usuario verá un 404 al entrar a `/products/51`?
**No.** Por defecto, Next.js tiene configurada la directiva `dynamicParams = true` en la ruta de detalle de producto:
- Si el usuario visita `/products/51` (un ID que no existía cuando se hizo el build), Next.js detecta que no tiene esa página pre-renderizada en caché.
- En lugar de dar 404, hace un renderizado bajo demanda (tipo SSR): consulta al CMS Laravel por el producto 51.
- Si el CMS responde con los datos del producto, Next.js renderiza la página del detalle, se la entrega al usuario y la **guarda en caché** para futuras visitas.
- Si el CMS responde que el producto no existe, entonces sí devuelve un 404 controlado.

---

## 5. Estructura de Directorios (Vertical Slices)

El código de **Terbol WebApp** está organizado bajo una arquitectura de **Feature-First / Vertical Slices** dentro de la carpeta `src/`. Esto agrupa el código por dominio de negocio en lugar de agruparlo por rol técnico (como controladores, componentes, estilos, etc.).

```text
src/
├── app/                          ← Routing y puntos de entrada (Thin Pages)
│   ├── products/
│   │   └── page.tsx              ← Thin Page del catálogo
│   └── api/
│       └── products/
│           └── route.ts          ← Route Handler de productos
├── components/                   ← Componentes compartidos globales (Navbar, Footer, Button)
├── features/                     ← Lógica de negocio auto-contenida (slices)
│   ├── home/                     ← Dominio de la página de inicio
│   └── products/                 ← Dominio de catálogo y detalle de producto
│       ├── components/           ← Componentes específicos de productos (Filtros, Cards)
│       ├── api/                  ← Consultas al CMS o APIs internas
│       ├── types/                ← Definiciones de tipos TypeScript de productos
│       └── views/                ← Vistas principales (ej: ProductsView)
├── lib/                          ← Utilidades compartidas (logger, formateadores)
└── styles/                       ← Tokens de diseño y estilos globales (Tailwind)
```

### Reglas Clave de la Arquitectura
1. **Thin Pages (Páginas Delgadas):** Los archivos en `src/app/` no deben contener lógica compleja de renderizado ni estilos. Solo sirven como wrappers de enrutamiento que importan una `View` de un Feature y la envuelven en un layout común.
2. **Autocontención (Self-Containment):** Todo lo relacionado con un dominio (componentes de UI específicos, hooks personalizados, tipos, llamadas de API) debe vivir dentro de su propia carpeta en `src/features/[feature_name]/`.
3. **No Cross-Imports:** Un Feature nunca debe importar código directamente desde la carpeta interna de otro Feature. Si dos Features necesitan compartir un componente o una utilidad, esta debe moverse a carpetas globales como `src/components/` o `src/lib/`.
4. **Barrel Exports (`index.ts`):** Cada Feature tiene un archivo `index.ts` que actúa como su API pública. Solo se exporta lo necesario (normalmente las Vistas principales) para que el resto de la aplicación lo consuma.
