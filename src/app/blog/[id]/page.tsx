import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { BlogDetailView } from "@/features/blog";
import { cmsApi } from "@/lib/cms-api";
import {
  mapCmsBlogList,
  mapCmsBlogPost,
  stripHtml,
} from "@/features/blog/data/cmsBlog";
import { createPageMetadata } from "@/lib/seo";
import { logError } from "@/lib/logger";

/** Registra el fallo del CMS y degrada a `null` para no perder observabilidad. */
function logCmsFailure(event: string, context: Record<string, string>) {
  return (error: unknown) => {
    logError(event, error, context);
    return null;
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const postResponse = await cmsApi
    .getBlogDetail(id)
    .catch(logCmsFailure("blog_detail_fetch_failed", { id, scope: "metadata" }));
  const post = mapCmsBlogPost(postResponse?.data);

  if (!post) {
    return createPageMetadata({
      title: "Artículo no encontrado",
      description: "El artículo que buscas no está disponible.",
      path: `/blog/${encodeURIComponent(id)}`,
      noIndex: true,
    });
  }

  const description = stripHtml(post.content).slice(0, 160) || post.title;

  return createPageMetadata({
    title: post.title,
    description,
    path: `/blog/${encodeURIComponent(post.id)}`,
    image: {
      url: post.image,
      alt: post.title,
    },
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const [postResponse, latestResponse] = await Promise.all([
    cmsApi
      .getBlogDetail(id)
      .catch(logCmsFailure("blog_detail_fetch_failed", { id, scope: "page" })),
    cmsApi
      .getBlogsFiltered(0, "", 1)
      .catch(logCmsFailure("blog_latest_fetch_failed", { id, scope: "page" })),
  ]);

  const post = mapCmsBlogPost(postResponse?.data);

  if (!post) {
    notFound();
  }

  const { posts: latestPosts } = mapCmsBlogList(latestResponse?.data);

  return (
    <PageLayout>
      <BlogDetailView
        post={post}
        latestPosts={latestPosts.filter((latestPost) => latestPost.id !== post.id).slice(0, 3)}
      />
    </PageLayout>
  );
}
