import type { APIRoute } from "astro";
import { EMAILS, SITE, type Lang } from "../config/site";
import { PROJECTS } from "../data/projects";
import {
  getEntriesByLang,
  getPostSlug,
  isPostEntry,
  isWriteupEntry,
  sortByDateDesc,
  type ContentEntry,
} from "../lib/content";

export const prerender = true;

function absolute(path: string): string {
  return new URL(path, SITE.url).toString();
}

function clean(value: string): string {
  return value.replace(/\s+/g, " ").replace(/[\r\n]+/g, " ").trim();
}

function entryLine(entry: ContentEntry, lang: Lang): string {
  const section = isWriteupEntry(entry) ? "writeups" : "blog";
  const url = absolute(`/${lang}/${section}/${getPostSlug(entry)}/`);
  return `- [${clean(entry.data.title)}](${url}): ${clean(entry.data.description)}`;
}

function section(title: string, entries: ContentEntry[], lang: Lang): string[] {
  if (entries.length === 0) return [];
  return [`## ${title}`, "", ...entries.map((entry) => entryLine(entry, lang)), ""];
}

export const GET: APIRoute = () => {
  const trEntries = sortByDateDesc(getEntriesByLang("tr"));
  const enEntries = sortByDateDesc(getEntriesByLang("en"));

  const lines = [
    `# ${SITE.author} — ${SITE.title}`,
    "",
    `> Bilingual (TR/EN) portfolio of ${SITE.author}, a Security Engineer focused on detection & response, application security & DevSecOps, cloud and infrastructure hardening, and AI security research.`,
    "",
    `Contact: ${EMAILS.en} (English), ${EMAILS.tr} (Turkish)`,
    "",
    "## Primary pages",
    "",
    `- [Turkish home](${absolute("/tr/")}): Türkçe ana sayfa ve son teknik yayınlar.`,
    `- [English home](${absolute("/en/")}): English home page and recent technical publications.`,
    `- [About — TR](${absolute("/tr/about/")}): Deneyim, eğitim ve çalışma alanları.`,
    `- [About — EN](${absolute("/en/about/")}): Experience, education and areas of focus.`,
    `- [Projects — TR](${absolute("/tr/projects/")}): Seçilmiş yazılım ve güvenlik projeleri.`,
    `- [Projects — EN](${absolute("/en/projects/")}): Selected software and security projects.`,
    "",
    "## Projects and web books",
    "",
    ...PROJECTS.map((project) => `- [${project.name.en}](${project.demo ?? project.repo}): ${clean(project.description.en)} Source: ${project.repo}`),
    "",
    ...section("Türkçe blog yazıları", trEntries.filter(isPostEntry), "tr"),
    ...section("English blog posts", enEntries.filter(isPostEntry), "en"),
    ...section("Türkçe write-up'lar", trEntries.filter(isWriteupEntry), "tr"),
    ...section("English write-ups", enEntries.filter(isWriteupEntry), "en"),
    "## Canonical profiles",
    "",
    ...SITE.socials
      .filter((social) => social.url.startsWith("https://"))
      .map((social) => `- [${social.name}](${social.url})`),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
