# ytalharabaci.dev

> Personal bilingual (TR/EN) portfolio & cybersecurity blog built with Astro, Cloudflare Workers, Workers AI and Sveltia CMS.

🌐 **Live:** [https://ytalharabaci.dev](https://ytalharabaci.dev)

---

### 🛠️ Tech Stack & Architecture

- **Framework & SSG:** [Astro](https://astro.build/) (Static Site Generation with custom Marked + Shiki + Parse5 markdown engine)
- **Deployment & Edge:** [Cloudflare Workers](https://workers.cloudflare.com/) (Assets binding, GitHub OAuth, proxy & edge routing)
- **AI & Automation:** [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) (Llama 3.1 & M2M-100 bilingual translation engine for posts)
- **Content Management:** [Sveltia CMS](https://sveltiacms.app/) (Decoupled, Git-based CMS with custom media manager, SEO and AI translation tools)
- **Styling:** Custom CSS design system (Dark/Light modes, design tokens)
- **CI/CD:** GitHub Actions (Automated type checking, build & Cloudflare deployment)

---

### 📂 Repository Structure

- `content/` — Bilingual (TR/EN) blog posts, write-ups, and post-relative WebP assets
- `src/` — Astro layouts, UI components, and TypeScript source
- `worker/` — Cloudflare Edge Worker handling GitHub OAuth & edge routing
- `public/` — Static assets and Sveltia CMS `/admin/` interface
