import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://ytalharabaci.dev",
  trailingSlash: "always",
  prefetch: true,
  // Astro 7 defaults to 'jsx', which drops whitespace between inline elements; keep the HTML-safe mode.
  compressHTML: true,
  build: {
    format: "directory",
    assets: "_assets",
  },
  // Emits a Content-Security-Policy <meta> on every page (GitHub Pages cannot set headers).
  // Scripts are locked to hashes; styles stay permissive because Shiki colors tokens with inline
  // `style` attributes and Mermaid injects <style> elements at runtime.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "frame-src https://www.youtube.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
      ],
      styleDirective: {
        resources: [
          { resource: "'self'", kind: "element" },
          { resource: "'unsafe-inline'", kind: "element" },
          { resource: "'unsafe-inline'", kind: "attribute" },
        ],
      },
    },
  },
  image: {
    domains: ["cdn-images-1.medium.com"],
  },
  // Config redirects are emitted as 301s (instant meta refresh); Astro.redirect() defaults to a 2 s delay.
  redirects: {
    "/tr/blog/nextcloud-onlyoffice/": "/tr/blog/escaping-office-ecosystem/",
    "/en/blog/nextcloud-onlyoffice/": "/en/blog/escaping-office-ecosystem/",
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const url = new URL(page);
        const pathname = url.pathname;
        if (
          pathname === "/" ||
          pathname === "" ||
          /^\/(tr|en)\/(posts|series)(\/|$)/.test(pathname)
        ) {
          return false;
        }
        return true;
      },
    }),
  ],
  // Post bodies are rendered by src/lib/content.ts (marked + Shiki), not by Astro's markdown pipeline.
  markdown: {
    syntaxHighlight: false,
  },
  vite: {
    build: {
      // Mermaid's diagram chunks are large (~650 kB) but only downloaded on pages that contain diagrams.
      chunkSizeWarningLimit: 900,
    },
  },
});
