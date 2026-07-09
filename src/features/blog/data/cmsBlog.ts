import { isCmsRecord, normalizeCmsRecordList } from "@/lib/cms-data";
import { resolveImageAsset } from "@/lib/image-assets";

export interface CmsBlogCategory {
  id?: number | string;
  title?: string;
  order?: number | string;
  Order?: number | string;
  orden?: number | string;
  sort_order?: number | string;
  sortOrder?: number | string;
  position?: number | string;
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

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toStringValue(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return undefined;
}

function getCategoryOrder(category: Partial<CmsBlogCategory>): number {
  return toNumber(
    category.order ??
      category.Order ??
      category.orden ??
      category.sort_order ??
      category.sortOrder ??
      category.position,
    Number.MAX_SAFE_INTEGER,
  );
}

function resolveStorageImage(path?: unknown): string {
  const imagePath = toStringValue(path);

  return resolveImageAsset(imagePath, "/images/image14.png") ?? "/images/image14.png";
}

function formatBlogDate(value?: unknown): string {
  const dateValue = toStringValue(value);
  if (!dateValue) return "";

  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateValue;

  return DATE_FORMATTER.format(date).replace(".", "");
}

export function mapCmsBlogCategories(
  categories: unknown,
): BlogCategory[] {
  const mappedCategories = normalizeCmsRecordList<CmsBlogCategory>(
    categories,
    "learn.categories",
  )
    .map((category) => ({
      id: toNumber(category.id),
      title: toStringValue(category.title) ?? "",
      order: getCategoryOrder(category),
    }))
    .filter((category) => category.id > 0 && category.title.length > 0)
    .sort((a, b) => a.order - b.order)
    .map(({ id, title }) => ({ id, title }));

  return [ALL_CATEGORIES, ...mappedCategories];
}

export function mapCmsBlogPost(item?: unknown): BlogPost | null {
  if (!isCmsRecord(item)) return null;

  const id = toStringValue(item.id);
  const title = toStringValue(item.title);

  if (!id || !title) return null;

  const category = isCmsRecord(item.category) ? item.category : undefined;
  const categoryId = toNumber(item.category_blog_id ?? category?.id);

  return {
    id,
    title,
    image: resolveStorageImage(item.image),
    category: toStringValue(category?.title) ?? "",
    categoryId,
    date: formatBlogDate(item.published_at),
    href: `/blog/${id}`,
    content: toStringValue(item.detail),
  };
}

export function mapCmsBlogList(data: unknown): {
  posts: BlogPost[];
  pagination: BlogPagination;
} {
  const listData = isCmsRecord(data) ? data : undefined;
  const items = Array.isArray(listData?.items) ? listData.items : [];
  const pagination = isCmsRecord(listData?.pagination)
    ? listData.pagination
    : undefined;
  const posts = items
    .map(mapCmsBlogPost)
    .filter((post): post is BlogPost => Boolean(post));

  return {
    posts,
    pagination: {
      currentPage:
        toNumber(pagination?.current_page, DEFAULT_PAGINATION.currentPage),
      totalPages: toNumber(pagination?.last_page, DEFAULT_PAGINATION.totalPages),
      perPage: toNumber(pagination?.per_page, DEFAULT_PAGINATION.perPage),
      total: toNumber(pagination?.total, posts.length),
    },
  };
}

export function stripHtml(value?: string): string {
  return value?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() ?? "";
}
