# ytalharabaci.dev

> Personal bilingual (TR/EN) portfolio & cybersecurity blog built with Astro, Cloudflare Workers and Sveltia CMS.

🌐 **Live:** [https://ytalharabaci.dev](https://ytalharabaci.dev)

---

### 🛠️ Tech Stack & Architecture

- **Framework:** [Astro](https://astro.build/) (Static Site Generation — SSG)
- **Deployment & Edge:** [Cloudflare Workers](https://workers.cloudflare.com/) (Assets binding, OAuth & edge routing)
- **Content Management:** [Sveltia CMS](https://sveltiacms.app/) (Decoupled, Git-based CMS with custom media manager)
- **Styling:** Custom CSS design system (Dark/Light modes, design tokens)
- **CI/CD:** GitHub Actions (Automated build & Cloudflare deployment)

---

### 📂 Repository Structure

- `content/` — Bilingual (TR/EN) blog posts, write-ups, and post-relative WebP assets
- `src/` — Astro layouts, UI components, and TypeScript source
- `worker/` — Cloudflare Edge Worker handling GitHub OAuth & edge routing
- `public/` — Static assets and Sveltia CMS `/admin/` interface
