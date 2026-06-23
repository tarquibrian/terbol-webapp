import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { BlogView } from "@/features/blog";
import { cmsApi } from "@/lib/cms-api";
import { CMS_PAGE_SCHEMAS } from "@/lib/cms-data";
import { getRequiredCmsPageData } from "@/lib/cms-page-data";
import { createPageMetadata, SEO_IMAGES } from "@/lib/seo";
import {
  mapCmsBlogCategories,
  mapCmsBlogList,
  type CmsLearnData,
} from "@/features/blog/data/cmsBlog";

interface BlogPageProps {
  searchParams: Promise<{
    category?: string | string[];
    category_blog_id?: string | string[];
    search?: string | string[];
    page?: string | string[];
  }>;
}

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description:
    "Explora nuestros artículos más recientes sobre nutrición, salud mental y estilo de vida para encontrar tu balance perfecto.",
  path: "/blog",
  image: SEO_IMAGES.blog,
});

function getSingleSearchParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getPositiveNumber(value: string, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentCategoryId = getPositiveNumber(
    getSingleSearchParam(params.category_blog_id ?? params.category),
    0,
  );
  const currentSearch = getSingleSearchParam(params.search);
  const currentPage = getPositiveNumber(getSingleSearchParam(params.page), 1);

  const [learnData, blogData] = await Promise.all([
    getRequiredCmsPageData<CmsLearnData>(
      () => cmsApi.getLearn(),
      CMS_PAGE_SCHEMAS.learn,
      "learn",
    ),
    getRequiredCmsPageData(
      () => cmsApi.getBlogsFiltered(currentCategoryId, currentSearch, currentPage),
      CMS_PAGE_SCHEMAS.blogList,
      "blog-list",
    ),
  ]);
  const categories = mapCmsBlogCategories(learnData?.categories);
  const { posts, pagination } = mapCmsBlogList(blogData);

  return (
    <PageLayout>
      <BlogView
        cover={learnData?.cover_section}
        categories={categories}
        posts={posts}
        pagination={pagination}
        currentCategoryId={currentCategoryId}
        currentSearch={currentSearch}
      />
    </PageLayout>
  );
}
