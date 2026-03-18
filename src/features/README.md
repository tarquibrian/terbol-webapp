# Arquitectura de Características (Features)

Este directorio contiene la **lógica vertical** de la aplicación, organizada por dominios de negocio.

## Principios

1. **Autocontenido**: Cada feature encapsula sus propios componentes, hooks, api, tipos y vistas.
2. **Barrel exports**: Solo se expone públicamente lo necesario vía `index.ts`.
3. **Thin pages**: Los archivos `app/*/page.tsx` son wrappers mínimos que importan la `View` del feature correspondiente.
4. **No cross-imports**: Un feature **no** importa de otro feature. Los módulos compartidos van en `components/` o `lib/`.

## Estructura de un Feature

```
src/features/<nombre>/
├── components/           ← Componentes específicos del feature
│   └── <Componente>/
│       ├── <Componente>.tsx
│       └── index.ts
├── views/                ← Vistas que componen la página completa
│   └── <Feature>View.tsx
├── hooks/                ← (opcional) Hooks específicos del feature
├── api/                  ← (opcional) Llamadas API / server actions
├── types/                ← (opcional) Interfaces y tipos del dominio
└── index.ts              ← Barrel export público
```

## Convenciones

| Regla | Ejemplo |
|---|---|
| Nombre del feature | `kebab-case` → `success-plan/` |
| Nombre del View | `PascalCase` + `View` → `SuccessPlanView` |
| Nombre del Hero | `PascalCase` + `Hero` → `SuccessPlanHero` |
| Import desde app/ | `import { XView } from "@/features/x"` |
| Export público | Solo Views y tipos vía `index.ts` |

## Flujo de creación de una nueva página

1. Crear el feature en `src/features/<nombre>/`
2. Crear componentes en `components/`
3. Crear la vista en `views/<Feature>View.tsx`
4. Exportar la vista en `index.ts`
5. Crear `app/<nombre>/page.tsx` como thin wrapper:

```tsx
import { PageLayout } from "@/components/layout/PageLayout";
import { XView } from "@/features/x";

export default function XPage() {
  return (
    <PageLayout>
      <XView />
    </PageLayout>
  );
}
```
