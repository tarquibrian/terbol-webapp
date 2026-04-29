"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Check } from "lucide-react";
import { ArticleCard } from "./ArticleCard";
import type { BlogCategory, BlogPagination, BlogPost } from "../data/cmsBlog";

interface ArticlesSectionProps {
  categories: BlogCategory[];
  posts: BlogPost[];
  pagination: BlogPagination;
  currentCategoryId?: number;
  currentSearch?: string;
}

export function ArticlesSection({
  categories,
  posts,
  pagination,
  currentCategoryId = 0,
  currentSearch = "",
}: ArticlesSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Leer parámetros de la URL
  const currentPage = Number(searchParams.get("page")) || pagination.currentPage;
  const activeCategoryId =
    Number(searchParams.get("category")) || currentCategoryId;
  const activeSearch = searchParams.get("search") ?? currentSearch;

  // Manejo de categorías
  const handleCategoryChange = (categoryId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === 0) {
      params.delete("category");
    } else {
      params.set("category", String(categoryId));
    }
    params.set("page", "1"); // reset page
    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(nextUrl, { scroll: false });
  };

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const search = value.trim();

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    params.set("page", "1");
    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(nextUrl, { scroll: false });
  };

  return (
    <section className="w-full bg-white">
      <div className="wrapper-content flex flex-col items-center gap-8">
        {/* Filtro de Categorías */}
        <AnimateOnScroll variant="slide-up" className="w-full">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {categories.map((cat) => {
              const isActive = activeCategoryId === cat.id;
              return (
                <Button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  variant={isActive ? "secondary" : "outline"}
                  size="sm"
                  className="rounded-full text-gray-500 whitespace-nowrap"
                  icon={isActive ? <Check size={16} /> : undefined}
                  iconPosition="left"
                >
                  {cat.title}
                </Button>
              );
            })}
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll variant="slide-up" className="w-full max-w-xl">
          <SearchInput
            defaultValue={activeSearch}
            onSearch={handleSearch}
            placeholder="Buscar artículos"
          />
        </AnimateOnScroll>

        <div className="flex flex-col gap-8 w-full">
          {/* <AnimateOnScroll variant="slide-up"> */}
          {/*   <h2 className="text-body-large font-bold text-gray-900 uppercase tracking-wider"> */}
          {/*     Últimos artículos */}
          {/*   </h2> */}
          {/* </AnimateOnScroll> */}
          <div className="flex items-center justify-between gap-4">
            <AnimateOnScroll variant="slide-up">
              <h3 className="heading-h5 font-bold text-foreground md:whitespace-nowrap">
                Últimos artículos
              </h3>
            </AnimateOnScroll>
            <div className="hidden md:block w-full h-px bg-transparent border-dashed border-b border-gray-200"></div>
          </div>

          {/* Grid de Artículos (3 columnas x 2 filas) */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-8 md:gap-y-12">
              {posts.map((post, idx) => (
                <AnimateOnScroll
                  key={post.id}
                  variant="slide-up"
                  delay={idx * 0.1}
                >
                  <ArticleCard post={post} />
                </AnimateOnScroll>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-500">
              No hay artículos disponibles para esta búsqueda.
            </div>
          )}

          {/* Paginación (si hay más de 1 página) */}
          {pagination.totalPages > 1 && (
            <AnimateOnScroll
              variant="fade"
              className="mt-8 border-t border-gray-100 pt-8"
            >
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
              />
            </AnimateOnScroll>
          )}
        </div>
      </div>
    </section>
  );
}
