export const LANGS = ["tr", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "en";

export interface Social {
  name: string;
  icon: { set: "solid" | "regular" | "brands"; name: string };
  url: string;
}

/** Public contact addresses for localized communication. */
export const EMAILS: Record<Lang, string> = {
  tr: "iletisim@ytalharabaci.dev",
  en: "contact@ytalharabaci.dev",
};

export const SITE = {
  title: "ytalharabaci.dev",
  author: "Yusuf Talha ARABACI",
  url: "https://ytalharabaci.dev",
  email: EMAILS.en,
  emails: EMAILS,
  /** Job-search status shown on the home and About pages; set to `null` to hide it. */
  availability: <Record<Lang, string> | null>{
    tr: "Tam zamanlı Güvenlik Mühendisi rollerine açık",
    en: "Available for full-time Security Engineer roles",
  },
  /** Branded card used as default og:image and Person schema image. */
  ogImage: "/link-card.jpg",
  /** 1200×630 branded card used as og:image for pages without their own cover. */
  ogDefault: "/link-card.jpg",
  description: {
    tr: "Tehdit tespiti, olay müdahalesi ve altyapı güvenliği üzerine çalışan bir güvenlik mühendisiyim. Savunma süreçlerini açık kaynaklı araçlar ve otomasyonla güçlendirmeye odaklanıyorum.",
    en: "Security Engineer specializing in detection & response, infrastructure defense, and security automation. Focused on building practical tools and resilient systems.",
  },
  /** Security domains shown on the home page and published as `knowsAbout` in the Person schema. */
  domains: [
    "Detection & Response",
    "Network & Endpoint Defense",
    "Vulnerability Management",
    "SecOps & Automation",
    "Infrastructure Hardening",
    "Offensive Testing",
    "AppSec & DevSecOps",
    "Identity & Access Management",
  ],
  socials: <Social[]>[
    {
      name: "Github",
      icon: { set: "brands", name: "github" },
      url: "https://github.com/ytalharabaci",
    },
    {
      name: "LinkedIn",
      icon: { set: "brands", name: "linkedin" },
      url: "https://www.linkedin.com/in/ytalharabaci/",
    },
    {
      name: "ORCID",
      icon: { set: "brands", name: "orcid" },
      url: "https://orcid.org/0009-0001-9185-4356",
    },
    {
      name: "X",
      icon: { set: "brands", name: "x-twitter" },
      url: "https://x.com/ytalharabaci",
    },
    {
      name: "Mastodon",
      icon: { set: "brands", name: "mastodon" },
      url: "https://infosec.exchange/@ytalharabaci",
    },
    {
      name: "Docker Hub",
      icon: { set: "brands", name: "docker" },
      url: "https://hub.docker.com/u/ytalharabaci",
    },
    {
      name: "Email",
      icon: { set: "solid", name: "envelope" },
      url: `mailto:${EMAILS.en}`,
    },
  ],
};

export const MENU: Record<Lang, Array<{ label: string; href: string; external?: boolean }>> = {
  tr: [
    { label: "Blog", href: "/tr/blog/" },
    { label: "Write-up", href: "/tr/writeups/" },
    { label: "Projeler", href: "/tr/projects/" },
    { label: "Hakkımda", href: "/tr/about/" },
    { label: "İletişim", href: `mailto:${EMAILS.tr}`, external: true },
  ],
  en: [
    { label: "Blog", href: "/en/blog/" },
    { label: "Write-ups", href: "/en/writeups/" },
    { label: "Projects", href: "/en/projects/" },
    { label: "About", href: "/en/about/" },
    { label: "Contact", href: `mailto:${EMAILS.en}`, external: true },
  ],
};

/** Fixed topic set used to filter the blog and write-up lists (frontmatter `topic`). */
export const TOPICS = {
  "detection-response": { tr: "Tespit & Müdahale", en: "Detection & Response" },
  "appsec-devsecops": { tr: "AppSec & DevSecOps", en: "AppSec & DevSecOps" },
  "cloud-infrastructure": { tr: "Bulut & Altyapı", en: "Cloud & Infrastructure" },
  "network-endpoint": { tr: "Ağ & Uç Nokta", en: "Network & Endpoint" },
  "offensive-security": { tr: "Ofansif Güvenlik", en: "Offensive Security" },
} as const satisfies Record<string, Record<Lang, string>>;

export type Topic = keyof typeof TOPICS;
