<div align="center">

# Terbol Ecommerce WebApp

Frontend oficial del ecommerce de **Terbol**, construido con Next.js (App Router),
React 19, Tailwind CSS v4 y Framer Motion.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Node](https://img.shields.io/badge/Node-24%20LTS-339933?logo=node.js)](https://nodejs.org/)

</div>

---

## Tabla de contenidos

- [Stack tecnológico](#stack-tecnológico)
- [Requisitos](#requisitos)
- [Puesta en marcha](#puesta-en-marcha)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Estrategia de renderizado](#estrategia-de-renderizado)
- [Animaciones](#animaciones)
- [Estilos](#estilos)
- [Despliegue](#despliegue)
- [Convenciones de Git](#convenciones-de-git)

---

## Stack tecnológico

| Capa | Tecnología |
| --- | --- |
| Framework | Next.js 16 (App Router, React Server Components, ISR) |
| UI | React 19 + React Compiler |
| Estilos | Tailwind CSS v4 (tokens en CSS puro) |
| Animación | Framer Motion |
| Carruseles | Embla Carousel |
| Correo | Nodemailer (formulario de contacto) |
| Lenguaje | TypeScript 5 |
| Runtime | Node.js 24 LTS |

La aplicación expone *route handlers* (`/api/*`) y usa renderizado en servidor
(SSR) e ISR con `revalidateTag`, por lo que **requiere un runtime Node** y no
puede servirse como sitio puramente estático.

---

## Requisitos

- **Node.js 24 LTS.** El repositorio incluye `.nvmrc`, `.node-version` y
  `engine-strict=true` para bloquear instalaciones con otra versión mayor de Node.
- **npm 11** o compatible.

Con [`nvm`](https://github.com/nvm-sh/nvm):

```bash
nvm install
nvm use
```

---

## Puesta en marcha

```bash
# 1. Instalar dependencias
npm ci

# 2. Configurar entorno (ver sección Variables de entorno)
cp .env.example .env

# 3. Levantar el servidor de desarrollo
npm run dev
```

La aplicación queda disponible en [http://localhost:3000](http://localhost:3000).

---

## Variables de entorno

Crea un archivo `.env` tomando como base `.env.example`. **No commitees `.env`**;
solo `.env.example` debe versionarse.

| Variable | Requerida | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No en local, **sí en producción** | URL pública del sitio para metadata, canonicals y Open Graph. |
| `NEXT_PUBLIC_API_URL` | Sí | URL base del CMS/API general para secciones, blog y contenido. |
| `NEXT_PUBLIC_STORAGE_URL` | Sí | URL base de imágenes/archivos servidos por el CMS. |
| `REVALIDATE_SECRET` | Sí para revalidación | Secret del webhook `POST /api/revalidate`; se envía en `x-revalidate-secret`. |
| `CMS_REVALIDATE_SECONDS` | No | Fallback ISR cuando el webhook no se ejecuta; por defecto `86400` (1 día). |
| `PRODUCTS_API_TOKEN` | No | Token opcional si el API de productos requiere `Authorization: Bearer`. |
| `PRODUCTS_API_KEY` | No | API key opcional si el API de productos requiere un header dedicado. |
| `PRODUCTS_API_KEY_HEADER` | No | Nombre del header para `PRODUCTS_API_KEY`; por defecto `ApiKey`. |
| `SMTP_HOST` · `SMTP_PORT` · `SMTP_SECURE` · `SMTP_USER` · `SMTP_PASS` · `CONTACT_TO` · `CONTACT_FROM` | No | Configuración SMTP del formulario de contacto (`/about`). Si faltan, `POST /api/contact` responde un 500 controlado. |

**Notas operativas:**

- Las variables con prefijo `NEXT_PUBLIC_` se **compilan dentro del build**:
  cambiarlas exige reconstruir la aplicación (`npm run build` / redeploy).
- En producción, la app aplica *fail-fast*: si falta `NEXT_PUBLIC_SITE_URL`,
  `NEXT_PUBLIC_API_URL` o `NEXT_PUBLIC_STORAGE_URL`, el build/arranque falla en
  lugar de degradar silenciosamente a `localhost`.
- Productos usa por defecto los endpoints fijos del CMS: `/products`,
  `/products/{id}`, `/products/types`, `/products/consumption-types` y
  `/products/focuses`. En producción no hay datos locales de *fallback*: si el
  CMS no responde, la UI muestra un estado vacío/error controlado.
- `REVALIDATE_SECRET` debe ser un valor aleatorio y distinto por entorno.
- Nunca guardar secretos en variables `NEXT_PUBLIC_` (son visibles para el cliente).
- El contrato esperado del API real de productos está documentado en
  [`docs/products-api-contract.md`](docs/products-api-contract.md).

---

## Scripts disponibles

| Script | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo (`localhost:3000`). |
| `npm run build` | Build de producción. |
| `npm run start` | Sirve el build de producción. |
| `npm run lint` | ESLint. |
| `npm run test` | Suite de tests (`node --test`). |

### Verificación local recomendada

```bash
npm run test
npm run lint
./node_modules/.bin/tsc --noEmit
npm run build
```

`npm run test` cubre los contratos críticos de revalidación, productos,
normalización del CMS, sanitización de HTML y headers de seguridad.

---

## Arquitectura del proyecto

El proyecto utiliza una arquitectura de **"Vertical Slices" (Feature-First)**: el
código se organiza por dominio de negocio en lugar de por tipo técnico,
priorizando escalabilidad y modularidad.

### Estructura de directorios

```text
src/
├── app/                          ← Routing exclusivo (Thin Pages)
├── components/                   ← Componentes SHARED (cross-feature)
│   ├── layout/                   ← PageLayout, Navbar, Footer
│   └── ui/                       ← Componentes primitivos (Button, Input, AnimateOnScroll)
├── features/                     ← LÓGICA DE NEGOCIO (Vertical Slices)
│   ├── about/
│   ├── blog/
│   ├── faq/
│   ├── home/
│   ├── products/
│   ├── promoter/
│   ├── science-and-quality/
│   └── success-plan/
├── lib/                          ← Utilidades generales (ej. utils.ts)
└── styles/                       ← Design Tokens (colors, typography, base)
```

### Reglas de la arquitectura

1. **Thin Pages (`app/`)**: los archivos en `app/` **solo** se encargan del
   routing de Next.js. Son wrappers mínimos que componen un `PageLayout` y la
   `View` principal importada desde un feature. *Nunca escribir UI directamente
   en `app/`.*
2. **Autocontención (`features/`)**: cada dominio de negocio tiene su propia
   carpeta dentro de `features/` y encapsula sus componentes, hooks, tipos y
   vistas.
3. **No Cross-Imports**: un feature **nunca** importa código de la carpeta
   interna de otro feature. Lo compartido se mueve a `src/components/` o `src/lib/`.
4. **Barrel Exports (`index.ts`)**: cada feature expone públicamente solo lo
   necesario a través de su `index.ts` (regla general: solo `Views` y `Types`).

### Flujo: crear una nueva página

Ejemplo: página de "Contacto" (`/contact`).

1. **Crear el feature**: `src/features/contact/`
2. **Crear componentes**: `src/features/contact/components/ContactForm/ContactForm.tsx` (y su `index.ts`)
3. **Crear la vista**: `src/features/contact/views/ContactView.tsx` (compone los componentes)
4. **Exportar**: en `src/features/contact/index.ts` → `export { ContactView } from "./views/ContactView";`
5. **Enlazar la ruta**: `src/app/contact/page.tsx` como Thin Wrapper:

```tsx
import { PageLayout } from "@/components/layout/PageLayout";
import { ContactView } from "@/features/contact";

export default function ContactPage() {
  return (
    <PageLayout>
      <ContactView />
    </PageLayout>
  );
}
```

---

## Estrategia de renderizado

La app combina dos patrones de renderizado según las necesidades de cada página:

### Páginas con ISR (Server-Side)

La mayoría de las páginas (Home, About, Science, Promoter, FAQ, Success Plan)
usan **Server Components** que obtienen datos del CMS en el servidor. El HTML
llega al navegador con el contenido ya incluido — sin skeletons ni loading.

El contenido se refresca de dos formas:

| Mecanismo | Cómo funciona | Latencia |
| --- | --- | --- |
| Webhook (`POST /api/revalidate`) | El CMS notifica un cambio → se purga el cache del tag correspondiente | Próximo request |
| Fallback temporal | Si el webhook no se dispara, ISR auto-refresca según `CMS_REVALIDATE_SECONDS` (1 día por defecto) | Máximo ~1 día |

### Páginas con CSR (Client-Side)

La página de **Productos** (`/products`) usa un componente `"use client"` que
obtiene datos mediante `fetch()` en el navegador. Esto permite interactividad
dinámica (filtros, paginación, búsqueda) sin recargar la página.

```
Browser → fetch("/api/products") → API Route (Next.js) → Data Cache → CMS
```

El API Route intermedio cachea las respuestas del CMS con ISR para no
sobrecargar el backend con requests repetidos. Las respuestas al browser
incluyen `Cache-Control: no-store` para que el navegador siempre pida data
fresca al servidor.

### Detalles de producto (SSG + ISR)

Las páginas `/products/[id]` se pre-renderizan en build con `generateStaticParams`.
Productos nuevos que no existían en el build se renderizan al vuelo (on-demand)
la primera vez que alguien los visita.

---

## Animaciones

El proyecto usa un componente reutilizable para animaciones atadas al scroll:

```tsx
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

// Fade simple
<AnimateOnScroll variant="fade" delay={0.2}>
  <img src="..." />
</AnimateOnScroll>

// Slide-up (sube desde abajo) para títulos/textos
<AnimateOnScroll variant="slide-up">
  <h2>Título</h2>
</AnimateOnScroll>
```

---

## Estilos

Se utiliza **Tailwind CSS v4** con un sistema de tokens en CSS puro. Todos los
tokens (colores, tipografía, espacios) se modifican en `src/styles/`
(`colors.css`, `typography.css`, etc.) y **no** se hardcodean en línea.

---

## Despliegue

La aplicación se despliega como **servidor Node**. Documentación operativa:

| Documento | Contenido |
| --- | --- |
| [`docs/deploy-windows-iis.md`](docs/deploy-windows-iis.md) | Despliegue completo desde cero en Windows Server (IIS + reverse proxy + servicio nssm). |
| [`docs/operacion-app.md`](docs/operacion-app.md) | Operación diaria: actualizar tras cambios, arrancar/detener el servicio, diagnóstico. |
| [`docs/products-api-contract.md`](docs/products-api-contract.md) | Contrato del API de productos del CMS. |
| [`docs/arquitectura-cache.md`](docs/arquitectura-cache.md) | Arquitectura de renderizado y cache (ISR, CSR, Data Cache, webhook). |
| [`docs/guia-renderizado-y-estructura.md`](docs/guia-renderizado-y-estructura.md) | Guía detallada sobre estrategias de renderizado (SSG, SSR, ISR, CSR) y arquitectura de Vertical Slices. |

> **Vercel:** las variables `NEXT_PUBLIC_*` deben definirse en
> *Project → Settings → Environment Variables* (no se toman del `.env` del
> repositorio). Al ser variables de build-time, cambiar el dominio requiere un
> nuevo deploy.

> **Self-host Windows:** antes de `npm run build` se define
> `NEXT_DEPLOYMENT_ID` con el SHA corto del commit. Next lo usa para evitar
> mezclar assets/payloads de builds distintos durante navegaciones client-side.

---

## Convenciones de Git

El proyecto sigue el estándar **[Conventional Commits](https://www.conventionalcommits.org/)**
para mantener un historial limpio y automatizable. Estructura del mensaje:

```
<tipo>(<ámbito opcional>): <descripción corta>
```

**Tipos válidos:**

| Tipo | Uso |
| --- | --- |
| `feat` | Nueva característica o funcionalidad. |
| `fix` | Corrección de un error/bug. |
| `refactor` | Cambio de código que no añade features ni corrige bugs. |
| `style` | Cambios de formato sin impacto en la lógica. |
| `docs` | Cambios en la documentación. |
| `chore` | Mantenimiento, configuración, dependencias. |
| `test` | Añadir o modificar pruebas. |

**Regla de oro:** commits lógicos y atómicos (una unidad de trabajo por commit)
en lugar de un macro-commit gigante.
