import { defineConfig } from "astro/config";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import m2dx from "astro-m2dx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import rehypeExternalLinks from "rehype-external-links";
import fauxRemarkEmbedder from "@remark-embedder/core";
import fauxOembedTransformer from "@remark-embedder/transformer-oembed";

const remarkEmbedder = fauxRemarkEmbedder.default;
const oembedTransformer = fauxOembedTransformer.default;

import vue from "@astrojs/vue";
/** @type {import('astro-m2dx').Options} */

const m2dxOptions = {
  exportComponents: true,
  unwrapImages: true,
  autoImports: true,
};
const site = (
  process.env.SITE_URL ??
  process.env.CF_PAGES_URL ??
  "https://10billion.pages.dev"
).replace(/\/$/, "");

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [
    icon(),
    mdx({}),
    sitemap(),
    tailwind(),
    vue({
      appEntrypoint: "/src/pages/_app",
    }),
  ],
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [
      [
        remarkEmbedder,
        {
          transformers: [oembedTransformer],
        },
      ],
      [m2dx, m2dxOptions],
    ],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          rel: ["nofollow"],
          target: ["_blank"],
        },
      ],
    ],
  },
  vite: {
      assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.webp'],
      build: {
        optimizeDeps: {
        include: ['vue3-popper'],
      },
      ssr: {
        noExternal: ['vue3-popper'],
      },
      rollupOptions: {
        external: [
          "/_pagefind/pagefind.js",
          "/_pagefind/pagefind-ui.js",
          "/_pagefind/pagefind-ui.css",
        ],
      },
      assetsInlineLimit: 10096,
    },
  },
  build: {
    inlineStylesheets: "always",
  },
  scopedStyleStrategy: "attribute",
  prefetch: {
    defaultStrategy: "viewport",
  },
});
