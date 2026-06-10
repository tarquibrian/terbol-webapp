import { logWarn } from "@/lib/logger";

export type CmsRecord = Record<string, unknown>;
export type CmsSectionKind = "object" | "array";
export type CmsPageSchema = Record<string, CmsSectionKind>;

export const CMS_PAGE_SCHEMAS = {
  home: {
    hero_section: "object",
    video_section: "object",
    pillars: "array",
    development_products: "array",
    featured_products: "array",
    featured_focuses: "array",
  },
  about: {
    identity: "object",
    about_us: "object",
  },
  help: {
    cover_section: "object",
    faq: "array",
  },
  science: {
    cover_section: "object",
    development_products: "array",
    evidence: "object",
  },
  successPlan: {
    plan: "object",
    video_section: "object",
    our_proposal: "object",
    how_it_works: "object",
  },
  promoter: {
    cover_section: "object",
    meaning: "object",
    why_be: "object",
    requirements: "object",
    affiliation_process: "object",
  },
  learn: {
    cover_section: "object",
    categories: "array",
  },
  blogList: {
    items: "array",
    pagination: "object",
  },
} satisfies Record<string, CmsPageSchema>;

const RECORD_ARRAY_KEYS = new Set([
  "categories",
  "details",
  "faq",
  "faqs",
  "items",
  "pillars",
  "social_networks",
  "steps",
]);

export function isCmsRecord(value: unknown): value is CmsRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function warnInvalidCmsData(context: string, expected: string) {
  logWarn("cms_data_invalid_shape", {
    context,
    expected,
  });
}

function isSerializablePrimitive(value: unknown) {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function normalizeRecordArray(value: unknown, context: string): CmsRecord[] | undefined {
  if (!Array.isArray(value)) {
    warnInvalidCmsData(context, "array");
    return undefined;
  }

  const records = value
    .filter(isCmsRecord)
    .map((item, index) => normalizeCmsRecord(item, `${context}[${index}]`));

  if (records.length !== value.length) {
    logWarn("cms_data_invalid_items", {
      context,
      invalidItemCount: value.length - records.length,
    });
  }

  return records;
}

export function normalizeCmsRecord(value: CmsRecord, context: string): CmsRecord {
  return Object.entries(value).reduce<CmsRecord>((normalized, [key, item]) => {
    if (item === null || item === undefined) return normalized;

    if (RECORD_ARRAY_KEYS.has(key)) {
      const records = normalizeRecordArray(item, `${context}.${key}`);
      if (records) normalized[key] = records;
      return normalized;
    }

    if (Array.isArray(item)) {
      normalized[key] = item.filter(
        (entry) => isSerializablePrimitive(entry) || isCmsRecord(entry),
      );
      return normalized;
    }

    if (isCmsRecord(item)) {
      normalized[key] = normalizeCmsRecord(item, `${context}.${key}`);
      return normalized;
    }

    if (isSerializablePrimitive(item)) {
      normalized[key] = item;
    }

    return normalized;
  }, {});
}

export function normalizeCmsRecordValue<T extends object = CmsRecord>(
  value: unknown,
  context: string,
): Partial<T> | undefined {
  if (!isCmsRecord(value)) {
    if (value !== undefined && value !== null) {
      warnInvalidCmsData(context, "object");
    }

    return undefined;
  }

  return normalizeCmsRecord(value, context) as Partial<T>;
}

export function normalizeCmsRecordList<T extends object = CmsRecord>(
  value: unknown,
  context: string,
): Partial<T>[] {
  if (value === undefined || value === null) return [];

  return (normalizeRecordArray(value, context) ?? []) as Partial<T>[];
}

export function normalizeCmsPageData<T extends object = CmsRecord>(
  value: unknown,
  schema: CmsPageSchema,
  context: string,
): Partial<T> {
  const root = normalizeCmsRecordValue<CmsRecord>(value, context);
  if (!root) return {};

  return Object.entries(schema).reduce<CmsRecord>((normalized, [key, kind]) => {
    const section = root[key];
    const sectionContext = `${context}.${key}`;

    if (section === undefined) return normalized;

    if (kind === "object") {
      const record = normalizeCmsRecordValue(section, sectionContext);
      if (record) normalized[key] = record;
      return normalized;
    }

    normalized[key] = normalizeCmsRecordList(section, sectionContext);
    return normalized;
  }, {}) as Partial<T>;
}
