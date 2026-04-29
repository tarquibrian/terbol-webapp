import { env } from "@/config/env";

export interface CmsBlogCategory {
  id?: number | string;
  title?: string;
  order?: number;
}

export interface CmsLearnData {
  cover_section?: BlogHeroContent;
  categories?: CmsBlogCategory[];
}

export interface CmsBlogItem {
  id?: number | string;
  title?: string;
  image?: string;
  published_at?: string;
  category_blog_id?: number | string;
  category?: CmsBlogCategory;
  detail?: string;
}

export interface CmsBlogPagination {
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}

export interface CmsBlogListData {
  items?: CmsBlogItem[];
  pagination?: CmsBlogPagination;
}

export interface BlogHeroContent {
  label?: string;
  title?: string;
  description?: string;
}

export interface BlogCategory {
  id: number;
  title: string;
}

export interface BlogPost {
  id: string;
  title: string;
  image: string;
  category: string;
  categoryId: number;
  date: string;
  href: string;
  content?: string;
}

export interface BlogPagination {
  currentPage: number;
  totalPages: number;
  perPage: number;
  total: number;
}

const ALL_CATEGORIES: BlogCategory = {
  id: 0,
  title: "Todos",
};

const DEFAULT_PAGINATION: BlogPagination = {
  currentPage: 1,
  totalPages: 1,
  perPage: 6,
  total: 0,
};

const DATE_FORMATTER = new Intl.DateTimeFormat("es-BO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function toNumber(value: number | string | undefined, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function resolveStorageImage(path?: string): string {
  if (!path) return "/images/image14.png";
  if (/^https?:\/\//.test(path) || path.startsWith("data:")) return path;

  const localPublicPathPrefixes = [
    "/banner/",
    "/categories/",
    "/homegrid/",
    "/images/",
  ];

  if (localPublicPathPrefixes.some((prefix) => path.startsWith(prefix))) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const baseStorage = env.STORAGE_URL.endsWith("/")
    ? env.STORAGE_URL
    : `${env.STORAGE_URL}/`;

  return `${baseStorage}${cleanPath}`;
}

function formatBlogDate(value?: string): string {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return DATE_FORMATTER.format(date).replace(".", "");
}

export function mapCmsBlogCategories(
  categories: CmsBlogCategory[] | undefined,
): BlogCategory[] {
  const mappedCategories = (categories ?? [])
    .map((category) => ({
      id: toNumber(category.id),
      title: category.title?.trim() ?? "",
      order: category.order ?? 0,
    }))
    .filter((category) => category.id > 0 && category.title.length > 0)
    .sort((a, b) => a.order - b.order)
    .map(({ id, title }) => ({ id, title }));

  return [ALL_CATEGORIES, ...mappedCategories];
}

export function mapCmsBlogPost(item?: CmsBlogItem | null): BlogPost | null {
  if (!item?.id || !item.title) return null;

  const id = String(item.id);
  const categoryId = toNumber(item.category_blog_id ?? item.category?.id);

  return {
    id,
    title: item.title,
    image: resolveStorageImage(item.image),
    category: item.category?.title ?? "",
    categoryId,
    date: formatBlogDate(item.published_at),
    href: `/blog/${id}`,
    content: item.detail,
  };
}

export function mapCmsBlogList(data: CmsBlogListData | undefined): {
  posts: BlogPost[];
  pagination: BlogPagination;
} {
  const posts = (data?.items ?? [])
    .map(mapCmsBlogPost)
    .filter((post): post is BlogPost => Boolean(post));

  return {
    posts,
    pagination: {
      currentPage:
        data?.pagination?.current_page ?? DEFAULT_PAGINATION.currentPage,
      totalPages: data?.pagination?.last_page ?? DEFAULT_PAGINATION.totalPages,
      perPage: data?.pagination?.per_page ?? DEFAULT_PAGINATION.perPage,
      total: data?.pagination?.total ?? posts.length,
    },
  };
}

export function stripHtml(value?: string): string {
  return value?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() ?? "";
}
