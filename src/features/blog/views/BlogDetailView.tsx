import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { ArticleCard } from "../components/ArticleCard";
import { EndBanner } from "@/components/layout/EndBanner";
import type { BlogPost } from "../data/cmsBlog";

interface BlogDetailViewProps {
  post: BlogPost;
  latestPosts?: BlogPost[];
}

export function BlogDetailView({
  post,
  latestPosts = [],
}: BlogDetailViewProps) {
  const hasLatestPosts = latestPosts.length > 0;

  return (
    <>
      <section className="wrapper-section pt-32 pb-16 md:pb-24">
        <div className="wrapper-content">
          <AnimateOnScroll variant="fade" className="mb-8">
            <nav className="flex items-center gap-2 text-body-medium text-gray-500 mb-6">
              <Link
                href="/"
                className="hover:text-primary-orange transition-colors duration-200"
              >
                Inicio
              </Link>
              <span className="text-gray-300">/</span>
              <Link
                href="/blog"
                className="hover:text-primary-orange transition-colors duration-200"
              >
                Blog
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium line-clamp-1">{post.title}</span>
            </nav>
          </AnimateOnScroll>

          <div
            className={
              hasLatestPosts
                ? "grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16 items-start"
                : "flex justify-center"
            }
          >
            {/* Columna Principal: Contenido del Artículo */}
            <article
              className={
                hasLatestPosts
                  ? "flex flex-col gap-8 w-full max-w-4xl mx-auto lg:mx-0 lg:col-span-3"
                  : "flex flex-col gap-8 w-full max-w-4xl"
              }
            >
              <AnimateOnScroll variant="slide-up" className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  {post.category && (
                    <span className="text-body-small font-medium text-white bg-primary-orange px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  )}
                  {post.date && (
                    <span className="text-body-small text-gray-400">{post.date}</span>
                  )}
                </div>
                <h1 className="heading-h2 font-bold text-gray-900 leading-tight">
                  {post.title}
                </h1>
              </AnimateOnScroll>

              <AnimateOnScroll variant="fade" delay={0.2} className="w-full aspect-video relative rounded-2xl overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                  priority
                />
              </AnimateOnScroll>

              <AnimateOnScroll variant="slide-up" delay={0.3} viewportAmount={0}>
                <div
                  className="prose prose-lg prose-orange max-w-none text-gray-600 
                    prose-headings:text-gray-900 prose-headings:font-bold prose-h2:heading-h4 prose-h2:mt-8 prose-h2:mb-4
                    prose-p:text-body-large prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-primary-orange hover:prose-a:text-orange-600
                    prose-strong:text-gray-900 prose-strong:font-bold
                    prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-li:mb-2"
                  dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
                />
              </AnimateOnScroll>
            </article>

            {/* Columna Secundaria: Últimos Artículos */}
            {hasLatestPosts && (
              <aside className="sticky top-32 flex flex-col gap-8 w-full lg:col-span-1">
                <AnimateOnScroll variant="slide-up">
                  <h3 className="heading-h5 font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                    Últimos artículos
                  </h3>
                  <div className="flex flex-col gap-8">
                    {latestPosts.map((latestPost, idx) => (
                      <AnimateOnScroll key={latestPost.id} variant="slide-up" delay={0.1 * idx}>
                        <ArticleCard post={latestPost} />
                      </AnimateOnScroll>
                    ))}
                  </div>
                </AnimateOnScroll>
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* EndBanner en variante compacta (solo 3 cards pequeñas) */}
      <EndBanner variant="compact" />
    </>
  );
}
