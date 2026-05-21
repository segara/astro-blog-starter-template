import type { ImageMetadata } from "astro";

const FALLBACK_IMAGE = "/src/assets/blog-placeholder-2.jpg";

type LocalImage = ImageMetadata & {
  src: string;
  width: number;
  height: number;
};

type LocalImageModule = {
  default: LocalImage;
};

const localImages = import.meta.glob<LocalImageModule>("/src/assets/*", {
  eager: true,
});

function splitPathAndSuffix(value: string): { path: string; suffix: string } {
  const suffixIndex = value.search(/[?#]/);

  if (suffixIndex === -1) {
    return { path: value, suffix: "" };
  }

  return {
    path: value.slice(0, suffixIndex),
    suffix: value.slice(suffixIndex),
  };
}

function normalizeAssetPath(value: string): string {
  return value.startsWith("/") ? value : `/${value}`;
}

export function resolveImage(src: unknown): LocalImage | string | null {
  if (typeof src !== "string") {
    return src as LocalImage | null;
  }

  const value = src.trim();
  if (!value) return null;

  const { path, suffix } = splitPathAndSuffix(value);
  const normalizedPath = normalizeAssetPath(path);

  if (!normalizedPath.startsWith("/src/assets/")) {
    return value;
  }

  const localImage =
    localImages[normalizedPath]?.default ?? localImages[FALLBACK_IMAGE]?.default;

  if (!localImage) return null;
  if (!suffix) return localImage;

  return {
    ...localImage,
    src: `${localImage.src}${suffix}`,
  };
}

export function resolveImageUrl(src: unknown): string | null {
  const resolved = resolveImage(src);

  if (!resolved) return null;
  if (typeof resolved === "string") return resolved;

  return resolved.src;
}
