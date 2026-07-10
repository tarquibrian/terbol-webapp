import sanitizeHtml from "sanitize-html";

const CMS_HTML_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "a",
    "b",
    "blockquote",
    "br",
    "em",
    "figcaption",
    "figure",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "i",
    "img",
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
    figure: ["class"],
    img: ["src", "alt", "width", "height", "style"],
  },
  allowedClasses: {
    figure: ["image", "image-style-side"],
  },
  allowedStyles: {
    img: {
      "aspect-ratio": [
        /^\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?$/,
      ],
    },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowProtocolRelative: false,
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
