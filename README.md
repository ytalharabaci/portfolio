# ytalharabaci.dev (Astro + Cloudflare Worker)

Bilingual (TR/EN) personal site and technical blog, built with Astro and published as a static site.

## Requirements

- Node.js 22.12 or newer (CI uses Node 22)

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Project structure

- `content/<slug>/index.{tr,en}.md`: posts and write-ups, with their images in the same folder (see `./blog-publishing-procedure.md`). The `index.<lang>.md` naming is the Sveltia CMS `multiple_files` i18n layout.
- `content/about`, `content/projects`: standalone pages (the Projects page only takes its title and intro from markdown).
- `src/data/projects.ts`: project cards for the Projects page and the home page (`featured: true`).
- `src/config/site.ts`: site metadata, contact email, availability status, navigation, and the `TOPICS` used to filter posts.
- `src/lib/content.ts`: frontmatter parsing, markdown rendering (marked + build-time Shiki highlighting), HTML sanitizing, table of contents.
- `src/components/`: `ArticlePage` (post/write-up layout), `PostCard`, `Icon` (inline Font Awesome SVGs).
- `src/layouts/BaseLayout.astro`: page shell, SEO metadata, theme toggle, Mermaid loader.
- `src/lib/csp.ts`: registers CSP hashes for the two render-blocking inline scripts. Every other script must be a bundled `<script>` (not `is:inline`), or the page CSP blocks it.
- `src/pages/.well-known/security.txt.ts`: RFC 9116 security.txt; its `Expires` date is renewed on each deploy.
- `src/styles/base.css`: the single global stylesheet (design tokens, typography, components).
- `public/`: files served as-is at the site root.

## Deployment

- Deployed to Cloudflare Workers using Wrangler (`npx wrangler deploy`).

## Content editing (CMS)

Posts, write-ups, and the About/Projects pages can be edited in the browser with [Sveltia CMS](https://sveltiacms.app/en/docs) at `https://ytalharabaci.dev/admin/` (`public/admin/`). Every save is a commit to `main`.

- **Sign-in:** both "Sign in with GitHub" (OAuth handled natively by the Cloudflare Worker at `/auth` and `/callback`) and "Sign In with Token" (fine-grained personal access token for `ytalharabaci/portfolio`) are supported.
- **Local editing:** with `npm run dev`, open `http://localhost:4321/admin/` in Chrome or Edge, choose "Work with Local Repository", and select the `portfolio` folder. Changes are written to disk; commit them yourself.
- **Collections:** "Yazılar" holds blog posts and write-ups (the `Type` field decides which), with TR and EN side by side in one entry. The slug is the folder name and URL. "Sayfalar" holds the About and Projects pages.
- **Images:** every uploaded raster image is converted to WebP (quality 85) and scaled down to at most 1200 px wide before it is committed, and is stored next to the post. Inside a post, the image picker's "İçeriğe Özel Medyalar" lists that post's folder. Images for the About and Projects pages go to `public/images/`.
- **Görseller page (`/admin/media/`):** shows each post folder (`content/<slug>/`) with its cover, title and image count; inside a folder you upload (WebP, max 1200 px), delete, copy the Markdown for an image, or crop a cover. It flags images the post does not reference. Sveltia's own Media page redirects here (`public/admin/media-link.js`), because Sveltia lists entry-relative media as one flat folder. It signs in with the same token and commits through the GitHub API, one commit per upload or delete.
- **Cover image:** the `cover-image` field (`public/admin/cover-image.js`) and the Görseller page share the crop dialog in `public/admin/crop.js`: a fixed 1200 × 630 frame (drag, wheel/slider/pinch zoom, safe-zone guide). The result is saved as the post's `featured.webp`, overwriting the previous one, with a warning when the selected area is narrower than 1200 px.
- **Upgrading Sveltia:** the script in `public/admin/index.html` is pinned to one version with an SRI hash; the comment there shows how to recompute the hash after changing the version.

