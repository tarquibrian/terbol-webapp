import * as React from "react";

export function ArticleCardSkeleton() {
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
      <article className="flex flex-col gap-4 overflow-hidden h-full">
        {/* Image Placeholder */}
        <div className="rounded-lg aspect-[4/3] w-full skeleton-shimmer"></div>
        {/* Content Placeholder */}
        <div className="flex flex-col flex-1 gap-2 pt-2">
          <div className="flex flex-col gap-2">
            <div className="w-full h-6 skeleton-shimmer rounded"></div>
            <div className="w-3/4 h-6 skeleton-shimmer rounded"></div>
          </div>
          <div className="mt-auto pt-2">
            <div className="w-24 h-5 skeleton-shimmer rounded"></div>
          </div>
        </div>
      </article>
    </>
  );
}
