# Contrato del API de productos

Este documento define el contrato esperado por `terbol-webapp` para integrar el API real de productos.

La app consume estos endpoints sobre `NEXT_PUBLIC_API_URL`, igual que el resto de secciones del CMS. En produccion, el frontend no muestra datos locales como si fueran contenido real; si el CMS no responde, la seccion correspondiente queda vacia o muestra error controlado. Los mocks locales quedan solo para desarrollo/test.

## Variables de entorno

| Variable | Requerida | Descripcion |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Si | URL base del CMS. Productos usa `/products` sobre esta URL. |
| `PRODUCTS_API_TOKEN` | Opcional | Token bearer enviado solo desde servidor si el endpoint lo requiere. No se expone al navegador. |
| `PRODUCTS_API_KEY` | Opcional | API key para endpoints que usan un header dedicado. |
| `PRODUCTS_API_KEY_HEADER` | Opcional | Nombre del header para `PRODUCTS_API_KEY`; por defecto `ApiKey`. |

Ejemplos:

```bash
NEXT_PUBLIC_API_URL=https://cms.terbolinspira.com/api
PRODUCTS_API_TOKEN=
PRODUCTS_API_KEY=
PRODUCTS_API_KEY_HEADER=ApiKey
```

## Listado de productos

La app llama `GET /products` con metodo `GET` y header:

```http
Accept: application/json
Authorization: Bearer <PRODUCTS_API_TOKEN> # solo si PRODUCTS_API_TOKEN existe
```

Query params enviados por el frontend:

| Parametro | Tipo | Descripcion |
| --- | --- | --- |
| `page` | number | Pagina actual. Minimo `1`. |
| `limit` | number | Cantidad por pagina. La app limita a maximo `60`. |
| `product_type_ids[]` | string[] | IDs de tipo de producto del CMS. |
| `consumption_type_ids[]` | string[] | IDs de tipo de consumo del CMS. |
| `focus_ids[]` | string[] | IDs de enfoque del CMS. |
| `name` | string | Busqueda libre por nombre. Solo se envia si tiene valor. |

Ejemplo:

```http
GET /products?page=1&per_page=9&product_type_ids[]=2&consumption_type_ids[]=1&focus_ids[]=3&name=omega
Accept: application/json
```

Respuesta preferida:

```json
{
  "data": [
    {
      "id": "1",
      "name": "Terbol Colageno",
      "price": 120,
      "description": "Descripcion completa del producto.",
      "featured_image": "products/catalog/featured/image1.webp",
      "benefits": ["Piel", "Articulaciones"],
      "tags": ["colageno", "bienestar"],
      "availability": true,
      "featured": true,
      "currency": { "id": 1, "name": "Bolivianos", "symbol": "BOB" },
      "product_type": { "id": 2, "name": "Suplementos Y Vitaminas" },
      "consumption_type": { "id": 1, "name": "Rendimiento Y Energía" },
      "focus": { "id": 3, "name": "Foco y Antiestrés", "image": "products/focuses/focuses3.png" }
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 9,
    "total": 42
  }
}
```

Los productos destacados del Home salen de este mismo listado. La app prioriza productos con `featured: true`; si el CMS no marca ninguno como destacado, usa los primeros productos devueltos por el CMS.

## Detalle de producto

La app llama `GET /products/{id}` para el detalle.

Ejemplo:

```http
GET /products/1
Accept: application/json
```

Respuesta preferida:

```json
{
  "data": {
    "product": {
      "id": "1",
      "name": "Terbol Colageno",
      "shortDescription": "Apoyo diario para piel, cabello y articulaciones.",
      "description": "Descripcion completa del producto.",
      "cardImage": "/storage/products/colageno-card.png",
      "category": "Suplementos",
      "consumptionType": "Belleza y Piel"
    },
    "relatedProducts": [
      {
        "id": "2",
        "name": "Vitamina C",
        "shortDescription": "Soporte antioxidante.",
        "cardImage": "/storage/products/vitamina-c-card.png",
        "category": "Vitaminas",
        "consumptionType": "Defensas"
      }
    ]
  }
}
```

Para producto inexistente, el API debe responder:

```http
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
{
  "message": "Producto no encontrado"
}
```

## Campos requeridos

Para que un item sea considerado valido, el frontend necesita como minimo:

| Campo | Requerido | Fallback |
| --- | --- | --- |
| `id` | Si | No hay fallback; sin id el producto se descarta. |
| `name` | Si | No hay fallback; sin nombre el producto se descarta. |
| `shortDescription` | No | `""` |
| `description` | No | Usa `shortDescription`. |
| `category` | No | `"Sin categoria"` |
| `consumptionType` | No | Usa `category`. |
| `cardImage` | No | Imagen local de fallback. |
| `price` | No | `0` |

## Aliases tolerados por el frontend

El contrato preferido usa camelCase, pero el normalizador actual acepta aliases para facilitar la integracion.

| Campo interno | Aliases aceptados |
| --- | --- |
| `id` | `id`, `productId`, `product_id`, `slug` |
| `name` | `name`, `title`, `productName`, `product_name` |
| `shortDescription` | `shortDescription`, `short_description`, `summary`, `excerpt` |
| `description` | `description`, `body`, `content` |
| `category` | `category`, `categoryName`, `category_name`, `category.name`, `category.title` |
| `consumptionType` | `consumptionType`, `consumption_type`, `consumptionCategory`, `consumption_category`, `consumptionType.name`, `consumption_type.name` |
| `cardImage` | `cardImage`, `card_image`, `image`, `imageUrl`, `image_url`, `thumbnail`, `thumbnail_url`, `image.url`, `media.url` |
| `featuredCoverImage` | `featuredCoverImage`, `featured_cover_image` |
| `featuredBgImage` | `featuredBgImage`, `featured_bg_image` |
| `detailsSubtitle` | `detailsSubtitle`, `details_subtitle`, `subtitle` |
| `detailsList` | `detailsList`, `details_list` |
| `usageInstructions` | `usageInstructions`, `usage_instructions`, `instructions` |
| `featuredProduct` | `featuredProduct`, `featured_product`, `featured` |

Arrays aceptados:

- `benefits`
- `tags`
- `extraImages`, `extra_images`, `gallery`

Meta/paginacion aceptada:

| Campo interno | Aliases aceptados |
| --- | --- |
| `total` | `total`, `totalItems`, `total_items` |
| `page` | `page`, `currentPage`, `current_page` |
| `limit` | `limit`, `perPage`, `per_page` |
| `totalPages` | `totalPages`, `total_pages`, `lastPage`, `last_page` |

## Formas de respuesta toleradas

Listado:

```json
{ "data": [{ "id": "1", "name": "Producto" }], "meta": {} }
```

```json
{ "data": { "data": [{ "id": "1", "name": "Producto" }], "meta": {} } }
```

```json
{ "products": [{ "id": "1", "name": "Producto" }], "pagination": {} }
```

```json
[{ "id": "1", "name": "Producto" }]
```

Detalle:

```json
{ "data": { "product": { "id": "1", "name": "Producto" } } }
```

```json
{ "product": { "id": "1", "name": "Producto" } }
```

```json
{ "id": "1", "name": "Producto" }
```

## Imagenes

Las imagenes pueden llegar como:

- Ruta relativa al storage: `/storage/products/product.png`
- URL absoluta permitida por `next.config.ts`

Si el API usa un dominio nuevo para imagenes, hay que agregarlo a `NEXT_PUBLIC_STORAGE_URL` o permitirlo en `src/config/image-remote-patterns.ts`.

## Filtros y enfoques visuales

La app llama estos endpoints para los filtros del catalogo:

```http
GET /products/types
GET /products/consumption-types
GET /products/focuses
Accept: application/json
```

El carrusel visual de enfoques del Home y del detalle de producto usa `/products/focuses`. Para que un enfoque aparezca en ese carrusel debe traer imagen.

Campos aceptados por cada opcion:

| Campo UI | Alias aceptados |
| --- | --- |
| `id` | `id`, `value`, `slug` |
| `name` | `name`, `label`, `title` |
| `imageSrc` | `image`, `imageSrc`, `image_src`, `icon` |
| `featured` | `featured` |
| `order` | `order`, `sort` |

## Revalidacion

Cuando el API de productos tenga eventos de create/update/delete, debe llamar al webhook del frontend:

```http
POST /api/revalidate
x-revalidate-secret: <REVALIDATE_SECRET>
Content-Type: application/json
```

Eventos recomendados:

| Evento | Tags |
| --- | --- |
| Crear producto | `products-list`, `sitemap` |
| Editar producto | `products-list`, `product-{id}` |
| Eliminar producto | `products-list`, `product-{id}`, `sitemap` |

La app ya habilita estos tags en `/api/revalidate` y usa cache `next.tags` en los fetches server-side hacia el API real de productos.

## Manejo de errores

Comportamiento esperado:

- `404`: producto inexistente; la app muestra `notFound()` en detalle.
- `401`/`403`: problema de token o permisos; la app registra error y no inventa contenido local en produccion.
- `5xx`: API no disponible; la app registra error y no inventa contenido local en produccion.
- Respuesta invalida: la app descarta items sin `id` o `name`; si no hay lista valida, la seccion queda vacia o muestra error controlado.
