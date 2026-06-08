import type { CmsPageSchema } from "@/lib/cms-data";
import { normalizeCmsPageData } from "@/lib/cms-data";
import { logWarn } from "@/lib/logger";

interface CmsPageResponse {
  data?: unknown;
}

export async function getOptionalCmsPageData<T extends object>(
  fetchPage: () => Promise<CmsPageResponse | null | undefined>,
  schema: CmsPageSchema,
  context: string,
): Promise<Partial<T>> {
  try {
    const response = await fetchPage();

    return normalizeCmsPageData<T>(response?.data, schema, context);
  } catch (error) {
    logWarn("cms_page_data_fallback", {
      context,
      reason: error instanceof Error ? error.message : String(error),
    });

    return {};
  }
}
