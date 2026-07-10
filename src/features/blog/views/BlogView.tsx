import { BlogHero } from "../components/BlogHero";
import { ArticlesSection } from "../components/ArticlesSection";
import { EndBanner } from "@/components/layout/EndBanner";
import type {
  BlogCategory,
  BlogHeroContent,
  BlogPagination,
  BlogPost,
} from "../data/cmsBlog";

interface BlogViewProps {
  cover?: BlogHeroContent;
  categories: BlogCategory[];
  posts: BlogPost[];
  pagination: BlogPagination;
  currentCategoryId?: number;
  currentSearch?: string;
}

export function BlogView({
  cover,
  categories,
  posts,
  pagination,
  currentCategoryId,
  currentSearch,
}: BlogViewProps) {
  return (
    <>
      <BlogHero data={cover} />
      <ArticlesSection
        categories={categories}
        posts={posts}
        pagination={pagination}
        currentCategoryId={currentCategoryId}
        currentSearch={currentSearch}
      />
      <EndBanner variant="expanded" />
    </>
  );
}
