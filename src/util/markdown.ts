import { marked } from "marked";

const assetUrls = import.meta.glob("/src/assets/*", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

export function renderMarkdown(content = "") {
  return String(marked.parse(content)).replace(
    /src="\/src\/assets\/([^"#?]+)([^"]*)"/g,
    (match, filename, suffix) => {
      const assetUrl = assetUrls[`/src/assets/${filename}`];
      return assetUrl ? `src="${assetUrl}${suffix}"` : match;
    },
  );
}