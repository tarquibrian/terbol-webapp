import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { BlogDetailView } from "@/features/blog";
import { cmsApi } from "@/lib/cms-api";
import {
  mapCmsBlogList,
  mapCmsBlogPost,
  stripHtml,
  type CmsBlogItem,
  type CmsBlogListData,
} from "@/features/blog/data/cmsBlog";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const postResponse = await cmsApi.getBlogDetail(id).catch(() => null);
  const post = mapCmsBlogPost(postResponse?.data as CmsBlogItem);

  if (!post) {
    return {
      title: "Artículo no encontrado - Terbol",
    };
  }

  return {
    title: `${post.title} - Terbol Blog`,
    description: stripHtml(post.content).slice(0, 160) || post.title,
    openGraph: {
      title: `${post.title} - Terbol Blog`,
      description: stripHtml(post.content).slice(0, 160) || post.title,
      images: [
        {
          url: post.image,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const [postResponse, latestResponse] = await Promise.all([
    cmsApi.getBlogDetail(id).catch(() => null),
    cmsApi.getBlogsFiltered(0, "", 1).catch(() => null),
  ]);

  const post = mapCmsBlogPost(postResponse?.data as CmsBlogItem);

  if (!post) {
    notFound();
  }

  const { posts: latestPosts } = mapCmsBlogList(
    latestResponse?.data as CmsBlogListData | undefined,
  );

  return (
    <PageLayout>
      <BlogDetailView
        post={post}
        latestPosts={latestPosts.filter((latestPost) => latestPost.id !== post.id).slice(0, 3)}
      />
    </PageLayout>
  );
}
