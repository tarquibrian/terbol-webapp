import * as React from "react";

/**
 * Skeleton loader para el componente ProductCard.
 * Utiliza un efecto "shimmer" moderno (estilo Facebook/Youtube).
 * El bloque de la imagen es completamente transparente según los requerimientos.
 */
export function ProductCardSkeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>
      <div className="relative flex flex-col overflow-hidden rounded-lg bg-primary-soft-gray-balance border border-primary-soft-gray-balance">
        {/* Badge Skeleton */}
        <div className="absolute top-6 left-6 z-11">
          <div className="w-20 h-6 skeleton-shimmer rounded-md"></div>
        </div>

        {/* Image Block (Transparent placeholder) */}
        <div className="relative w-full aspect-square bg-transparent"></div>

        {/* Text Info Skeleton */}
        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-3">
            {/* Title row */}
            <div className="w-3/4 h-6 skeleton-shimmer rounded"></div>
            {/* Description rows */}
            <div className="w-full h-4 skeleton-shimmer rounded mt-1"></div>
            {/* <div className="w-5/6 h-4 skeleton-shimmer rounded"></div> */}
          </div>

          {/* Price & Button Skeleton */}
          <div className="flex justify-between items-center mt-2">
            {/* Price */}
            <div className="w-24 h-7 skeleton-shimmer rounded"></div>
            {/* Button */}
            <div className="w-20 h-9 skeleton-shimmer rounded-md"></div>
          </div>
        </div>
      </div>
    </>
  );
}
