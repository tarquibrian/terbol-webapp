import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { BlogView } from "@/features/blog";
import { cmsApi } from "@/lib/cms-api";
import {
  mapCmsBlogCategories,
  mapCmsBlogList,
  type CmsBlogListData,
  type CmsLearnData,
} from "@/features/blog/data/cmsBlog";

interface BlogPageProps {
  searchParams: Promise<{
    category?: string | string[];
    search?: string | string[];
    page?: string | string[];
  }>;
}

export const metadata: Metadata = {
  title: "Blog - Terbol",
  description:
    "Explora nuestros artículos más recientes sobre nutrición, salud mental y estilo de vida para encontrar tu balance perfecto.",
};

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
    getSingleSearchParam(params.category),
    0,
  );
  const currentSearch = getSingleSearchParam(params.search);
  const currentPage = getPositiveNumber(getSingleSearchParam(params.page), 1);

  const [learnDataResponse, blogDataResponse] = await Promise.all([
    cmsApi.getLearn(),
    cmsApi.getBlogsFiltered(currentCategoryId, currentSearch, currentPage),
  ]);

  const learnData = learnDataResponse?.data as CmsLearnData | undefined;
  const blogData = blogDataResponse?.data as CmsBlogListData | undefined;
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
