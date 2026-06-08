import sanitizeHtml from "sanitize-html";

const CMS_HTML_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "a",
    "b",
    "blockquote",
    "br",
    "em",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "i",
    "li",
    "ol",
    "p",
    "span",
    "strong",
    "u",
    "ul",
  ],
  allowedAttributes: {
    a: ["href", "rel", "target", "title"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    a: (tagName, attribs) => {
      const nextAttribs = { ...attribs };

      if (nextAttribs.target === "_blank") {
        nextAttribs.rel = "noopener noreferrer";
      }

      return { tagName, attribs: nextAttribs };
    },
  },
};

export function sanitizeCmsHtml(value?: string | null): string {
  return sanitizeHtml(value ?? "", CMS_HTML_OPTIONS);
}
