# Terbol Ecommerce WebApp

Este es el repositorio oficial del Frontend para el Ecommerce de Terbol, construido con [Next.js](https://nextjs.org/) (App Router), React 19, Tailwind CSS v4 y Framer Motion.

## 🏗 Arquitectura del Proyecto (Feature-First)

Este proyecto utiliza una arquitectura de **"Vertical Slices" (Feature-First)**. El objetivo es mantener el código altamente escalable y modularizado por dominio de negocio, en lugar de agrupar todo por tipo técnicos (aislar componentes, hooks, etc.).

### Estructura de Directorios

```text
src/
├── app/                          ← Routing exclusivo (Thin Pages)
├── components/                   ← Componentes SHARED (cross-feature)
│   ├── layout/                   ← PageLayout, Navbar, Footer
│   └── ui/                       ← Componentes primitivos (Button, Input, AnimateOnScroll)
├── features/                     ← LÓGICA DE NEGOCIO (Vertical Slices)
│   ├── home/
│   ├── about/
│   ├── products/
│   └── success-plan/
├── lib/                          ← Utilidades generales (ej. utils.ts)
└── styles/                       ← Design Tokens (colors, typography, base)
```

### Reglas de la Arquitectura

1. **Thin Pages (`app/`)**: Los archivos en `app/` **solo** deben encargarse del routing de Next.js. Deben ser wrappers mínimos (Thin Pages) que componen un `PageLayout` y la vista principal (`View`) importada desde un feature. *Nunca escribir UI directamente en `app/`.*
2. **Autocontención (`features/`)**: Cada dominio de negocio (home, products, cart) tiene su propia carpeta dentro de `features/`. Cada feature encapsula sus propios componentes, hooks, tipos y vistas vinculados estrictamente a ese dominio.
3. **No Cross-Imports**: Un feature **NUNCA** debe importar código de la carpeta interna de otro feature. Si dos features necesitan compartir algo, ese código debe moverse a `src/components/` o `src/lib/`.
4. **Barrel Exports (`index.ts`)**: Cada feature expone públicamente solo lo que otras partes de la app necesitan usar a través de su archivo `index.ts`. Regla general: exportar solo `Views` y `Types` públicos.

### Flujo: ¿Cómo crear una nueva página?

Ejemplo: crear la página de "Contacto" (`/contact`).

1. **Crear el Feature**: Crear `src/features/contact/`
2. **Crear Componentes**: Crear `src/features/contact/components/ContactForm/ContactForm.tsx` (y su `index.ts`)
3. **Crear la Vista**: Crear `src/features/contact/views/ContactView.tsx` (compone los componentes)
4. **Exportar**: En `src/features/contact/index.ts` exportar la vista: `export { ContactView } from "./views/ContactView";`
5. **Enlazar la Ruta**: Crear `src/app/contact/page.tsx` como un Thin Wrapper:

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

## ✨ Animaciones (Framer Motion)

El proyecto utiliza un componente reutilizable para animaciones atadas al scroll:

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

## 🚀 Desarrollo

### Requisitos

- Node.js 24 LTS. El proyecto incluye `.nvmrc`, `.node-version` y `engine-strict=true` para bloquear instalaciones con otra version mayor de Node.
- npm 11 o compatible.

Si usas `nvm`:

```bash
nvm install
nvm use
```

### Variables de entorno

Crea un archivo `.env` tomando como base `.env.example`. No commitees `.env`; solo `.env.example` debe versionarse.

| Variable | Requerida | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No en local, sí en producción | URL pública del sitio para metadata, canonicals y Open Graph. |
| `NEXT_PUBLIC_API_URL` | Sí | URL base del CMS/API general para secciones, blog y contenido. |
| `NEXT_PUBLIC_STORAGE_URL` | Sí | URL base de imágenes/archivos servidos por el CMS. |
| `REVALIDATE_SECRET` | Sí para revalidación | Secret del webhook `POST /api/revalidate`; se envía en `x-revalidate-secret`. |
| `PRODUCTS_API_URL` | No | Endpoint server-side del catálogo real. Si está vacío, `/api/products` usa el mock local. |
| `PRODUCTS_DETAIL_API_URL` | No | Endpoint server-side del detalle de producto. Acepta `{id}` o `:id`; si está vacío, intenta `PRODUCTS_API_URL/{id}`. |
| `PRODUCTS_API_TOKEN` | No | Token opcional para el API de productos; solo se usa en el servidor. |

Notas operativas:
- `PRODUCTS_API_URL` puede ser una URL absoluta o una ruta relativa a `NEXT_PUBLIC_API_URL`.
- `PRODUCTS_DETAIL_API_URL` puede ser una URL absoluta o relativa, por ejemplo `/products/{id}`.
- `REVALIDATE_SECRET` debe ser un valor aleatorio y diferente por entorno.
- Las variables con prefijo `NEXT_PUBLIC_` son visibles para el cliente; no guardar secretos ahí.

Para iniciar el servidor local:

```bash
npm run dev
# o
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

### Verificación local

```bash
npm run test
npm run lint
./node_modules/.bin/tsc --noEmit
npm run build
```

`npm run test` cubre los contratos críticos de revalidación, productos, normalización CMS, sanitización HTML y headers de seguridad.

## 🎨 Estilos

Usamos **Tailwind CSS v4** con un sistema de tokens en CSS puro. Todos los tokens (colores, tipografía, espacios) se deben modificar en la carpeta `src/styles/` (`colors.css`, `typography.css`, etc.) y NO hardcodearse en línea.

## 📝 Convenciones de Git (Conventional Commits)

Este proyecto utiliza el estándar **Conventional Commits** para mantener un historial de control de versiones limpio, legible y automatizable.

Cada mensaje de commit debe seguir esta estructura:
`<tipo>(<ámbito opcional>): <descripción corta>`

**Tipos válidos:**
* `feat`: Una nueva característica o funcionalidad (ej. *feat(navbar): añadir menú desplegable*).
* `fix`: Solución a un error/bug (ej. *fix(cart): resolver cálculo de impuestos*).
* `refactor`: Cambio de código que no añade features ni arregla bugs (ej. *refactor(architecture): migrar a patrón feature-first*).
* `style`: Cambios de formato que no afectan la lógica (espacios, punto y coma).
* `docs`: Cambios en la documentación (ej. *docs: actualizar README con convenciones de git*).
* `chore`: Tareas de mantenimiento, configuración, instalación de dependencias, etc.
* `test`: Añadir o modificar pruebas.

**Regla de oro:** Realiza commits lógicos y atómicos (un commit por cada unidad lógica de trabajo) en lugar de un macro-commit gigante.
