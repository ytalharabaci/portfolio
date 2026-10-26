import { marked } from "marked";
import { parseFragment, serialize } from "parse5";
import { createHighlighter } from "shiki";
import YAML from "yaml";
import { z } from "astro/zod";
import { TOPICS, type Lang, type Topic } from "../config/site";
import { inlineFontAwesome } from "./icons";
import { getImageSize } from "./images";

export interface ContentData {
  title: string;
  description: string;
  date: string;
  dateModified?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  type: EntryType;
  draft: boolean;
  tags: string[];
  category?: string;
  series?: string[];
  /** Curated for the home page. */
  featured: boolean;
  topic?: Topic;
}

export interface ContentEntry {
  lang: Lang;
  id: string;
  slug: string;
  data: ContentData;
  body: string;
}

export type EntryType = "posts" | "writeups";

// `<slug>/index.<lang>.md` is the Sveltia CMS `multiple_files` i18n layout (public/admin/config.yml).
const localizedMarkdownFiles = import.meta.glob("../../content/*/index.{tr,en}.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const baseUrl = import.meta.env.BASE_URL ?? "/";
const TOPIC_KEYS = Object.keys(TOPICS) as [Topic, ...Topic[]];

const FrontmatterSchema = z.looseObject({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateModified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  draft: z.union([z.boolean(), z.enum(["true", "false"])]).optional(),
  type: z.enum(["posts", "post", "writeups", "writeup"]).optional(),
  featuredImage: z.string().trim().min(1).optional(),
  featuredImageAlt: z.string().trim().min(1).optional(),
  coverImage: z.string().trim().min(1).optional(),
  image: z.string().trim().min(1).optional(),
  audioFile: z.string().trim().min(1).optional(),
  audio: z.string().trim().min(1).optional(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  category: z.string().trim().min(1).optional(),
  series: z.union([z.array(z.string()), z.string()]).optional(),
  featured: z.union([z.boolean(), z.enum(["true", "false"])]).optional(),
  topic: z.enum(TOPIC_KEYS).optional(),
});

const ContentDataSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateModified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  featuredImage: z.string().optional(),
  featuredImageAlt: z.string().trim().min(1).optional(),
  type: z.enum(["posts", "writeups"]),
  draft: z.boolean(),
  tags: z.array(z.string()),
  category: z.string().optional(),
  series: z.array(z.string()),
  featured: z.boolean(),
  topic: z.enum(TOPIC_KEYS).optional(),
});

function prefixBaseUrl(path: string): string {
  if (!path.startsWith("/")) {
    return path;
  }

  if (baseUrl === "/") {
    return path;
  }

  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

export function isLang(value: string): value is Lang {
  return value === "tr" || value === "en";
}

function sanitizeYaml(raw: string): string {
  return raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}

function parseFrontmatter(source: string, sourcePath: string): { data: z.infer<typeof FrontmatterSchema>; body: string } {
  const normalized = source.replace(/^\uFEFF/, "");
  const match = normalized.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);
  if (match) {
    const frontmatter = sanitizeYaml(match[1]);
    const body = match[2].trim();
    try {
      const parsed = YAML.parse(frontmatter);
      return { data: FrontmatterSchema.parse(parsed && typeof parsed === "object" ? parsed : {}), body };
    } catch (error) {
      throw new Error(`Invalid frontmatter in ${sourcePath}`, { cause: error });
    }
  }
  return { data: FrontmatterSchema.parse({}), body: normalized };
}

function isTrue(value: unknown): boolean {
  return value === true || value === "true";
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .replace(/-{2,}/g, "-");
}

function readTitle(markdown: string): string {
  const line = markdown
    .split(/\r?\n/)
    .find((item) => item.trim().startsWith("# "))
    ?.replace(/^#\s+/, "")
    .trim();
  return line ?? "Untitled";
}

function readDescription(markdown: string): string {
  const lines = markdown.split(/\r?\n/).map((line) => line.trim());
  for (const line of lines) {
    if (!line) continue;
    if (line.startsWith("#")) continue;
    if (line.startsWith("![](")) continue;
    if (line === "---") continue;
    if (/^\[(.*?)\]\(.*\)$/.test(line)) continue;
    return line;
  }
  return "";
}

function readFeaturedImage(markdown: string, frontmatter: Record<string, any>): string | undefined {
  const directValue = frontmatter.featuredImage ?? frontmatter.coverImage ?? frontmatter.image;
  if (typeof directValue === "string" && directValue.trim()) {
    return directValue.trim();
  }

  const imageMatch = markdown.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
  return imageMatch?.[1];
}
function parseLocalizedFileMeta(path: string): {
  lang: Lang;
  bucket: string;
} | null {
  const normalized = path.replace(/\\/g, "/");
  const pathMatch = normalized.match(/\/content\/([^/]+)\/index\.(tr|en)\.md$/);
  if (!pathMatch) {
    return null;
  }

  return { bucket: pathMatch[1], lang: pathMatch[2] as Lang };
}

function extractDateFromSlug(slug: string): string | undefined {
  const dateMatch = slug.match(/(\d{4}-\d{2}-\d{2})/);
  return dateMatch?.[1];
}
function dedupeEntries(entries: ContentEntry[]): ContentEntry[] {
  const byKey = new Map<string, ContentEntry>();
  for (const entry of entries) {
    const key = `${entry.lang}:${slugify(String(entry.data.title ?? ""))}:${String(entry.data.date ?? "")}`;
    if (!byKey.has(key)) {
      byKey.set(key, entry);
    }
  }

  return [...byKey.values()];
}

function toContentEntry(path: string, markdown: string): ContentEntry | null {
  const meta = parseLocalizedFileMeta(path);
  if (!meta) {
    return null;
  }

  if (meta.bucket === "about" || meta.bucket === "projects") {
    return null;
  }

  const parsed = parseFrontmatter(markdown, path);
  const frontmatter = parsed.data && typeof parsed.data === "object" ? parsed.data : {};
  const body = parsed.body.trim() || markdown;

  const title = typeof frontmatter.title === "string" && frontmatter.title.trim() ? frontmatter.title.trim() : readTitle(body);
  const description =
    typeof frontmatter.description === "string" && frontmatter.description.trim()
      ? frontmatter.description.trim()
      : readDescription(body);
  const slug = slugify(meta.bucket) || slugify(title);
  const date =
    (typeof frontmatter.date === "string" && frontmatter.date.trim() ? frontmatter.date.trim() : undefined) ??
    extractDateFromSlug(meta.bucket);
  const draft = isTrue(frontmatter.draft);
  const entryType: EntryType =
    frontmatter.type === "writeups" || frontmatter.type === "writeup" ? "writeups" : "posts";
  const contentSection = entryType === "writeups" ? "writeups" : "blog";

  const rawFeaturedImage = readFeaturedImage(body, frontmatter);
  let resolvedFeaturedImage: string | undefined = undefined;

  if (rawFeaturedImage) {
    if (rawFeaturedImage.startsWith("http://") || rawFeaturedImage.startsWith("https://") || rawFeaturedImage.startsWith("//")) {
      resolvedFeaturedImage = rawFeaturedImage;
    } else if (rawFeaturedImage.startsWith("/")) {
      resolvedFeaturedImage = prefixBaseUrl(rawFeaturedImage);
    } else {
      // Relative to post folder
      resolvedFeaturedImage = prefixBaseUrl(`/${meta.lang}/${contentSection}/${slug}/${rawFeaturedImage}`);
    }
  }

  const tags = Array.isArray(frontmatter.tags)
    ? frontmatter.tags.map((tag) => tag.trim()).filter(Boolean)
    : typeof frontmatter.tags === "string"
      ? frontmatter.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];
  const series = Array.isArray(frontmatter.series)
    ? frontmatter.series.map((item) => item.trim()).filter(Boolean)
    : typeof frontmatter.series === "string"
      ? frontmatter.series.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

  const data = ContentDataSchema.parse({
    title,
    description,
    date,
    dateModified: frontmatter.dateModified ?? frontmatter.updated,
    featuredImage: resolvedFeaturedImage,
    featuredImageAlt: frontmatter.featuredImageAlt,
    type: entryType,
    draft,
    tags,
    category: frontmatter.category,
    series,
    featured: isTrue(frontmatter.featured),
    topic: frontmatter.topic,
  });

  return {
    lang: meta.lang,
    id: `${meta.bucket}/index.${meta.lang}.md`,
    slug,
    data,
    body,
  };
}

const contentEntries: ContentEntry[] = dedupeEntries(
  Object.entries(localizedMarkdownFiles)
  .map(([path, raw]) => toContentEntry(path, raw))
  .filter((entry): entry is ContentEntry => Boolean(entry)),
);

interface StaticPage {
  title?: string;
  description?: string;
  body: string;
}

const staticPages: Record<string, StaticPage> = {};
for (const [path, raw] of Object.entries(localizedMarkdownFiles)) {
  const meta = parseLocalizedFileMeta(path);
  if (!meta) {
    continue;
  }
  if (meta.bucket !== "about" && meta.bucket !== "projects") {
    continue;
  }

  const parsed = parseFrontmatter(raw, path);
  staticPages[`${meta.lang}:${meta.bucket}`] = {
    title: typeof parsed.data.title === "string" ? parsed.data.title : undefined,
    description: typeof parsed.data.description === "string" ? parsed.data.description : undefined,
    body: parsed.body,
  };
}

export function parseDate(value: unknown): Date {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === "string") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }
  return new Date(0);
}

export function formatDate(value: unknown, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === "tr" ? "tr-TR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parseDate(value));
}

export function isDraft(entry: ContentEntry): boolean {
  return isTrue(entry.data.draft);
}

export function sortByDateDesc<T extends ContentEntry>(entries: T[]): T[] {
  return [...entries].sort(
    (a, b) => parseDate(b.data.date).getTime() - parseDate(a.data.date).getTime(),
  );
}

export function getPostSlug(entry: ContentEntry): string {
  return entry.slug;
}

export function isPostEntry(entry: ContentEntry): boolean {
  return entry.data.type === "posts";
}

export function isWriteupEntry(entry: ContentEntry): boolean {
  return entry.data.type === "writeups";
}

export function getEntriesByLang(lang: Lang): ContentEntry[] {
  return contentEntries.filter((entry) => entry.lang === lang && !isDraft(entry));
}

export function getStaticPage(lang: Lang, page: "about" | "projects"): StaticPage | null {
  return staticPages[`${lang}:${page}`] ?? null;
}

function getAlertIcon(type: string): string {
  switch (type) {
    case "note":
      return `<svg class="octicon" viewBox="0 0 16 16" width="16" height="16"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-5a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0v-4.5A.75.75 0 0 0 8 3ZM8 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path></svg>`;
    case "tip":
      return `<svg class="octicon" viewBox="0 0 16 16" width="16" height="16"><path d="M8 1.5c-2.363 0-4 1.83-4 4.05 0 1.583.992 2.735 1.56 3.332-.018.067-.035.15-.05.25H5a2 2 0 0 0-2 2v1.5c0 .276.224.5.5.5h9c.276 0 .5-.224.5-.5V11a2 2 0 0 0-2-2h-.51c-.015-.1-.032-.183-.05-.25.568-.597 1.56-1.749 1.56-3.332 0-2.22-1.637-4.05-4-4.05Z"></path></svg>`;
    case "important":
      return `<svg class="octicon" viewBox="0 0 16 16" width="16" height="16"><path d="M0 1.75C0 .783.783 0 1.75 0h12.5C15.217 0 16 .783 16 1.75v12.5c0 .967-.783 1.75-1.75 1.75H1.75A1.75 1.75 0 0 1 0 14.25ZM6.5 3a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5Zm-2 3a.75.75 0 0 0 0 1.5h7a.75.75 0 0 0 0-1.5Zm0 3a.75.75 0 0 0 0 1.5h7a.75.75 0 0 0 0-1.5Z"></path></svg>`;
    case "warning":
      return `<svg class="octicon" viewBox="0 0 16 16" width="16" height="16"><path d="M6.457 1.047c.659-1.091 2.227-1.091 2.886 0l6.012 9.948c.671 1.11-.129 2.505-1.443 2.505H2.088c-1.314 0-2.114-1.395-1.443-2.505L6.457 1.047ZM8 4a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0v-3.5A.75.75 0 0 0 8 4Zm0 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"></path></svg>`;
    case "caution":
      return `<svg class="octicon" viewBox="0 0 16 16" width="16" height="16"><path d="M4.47 2.22c.32-.32.84-.32 1.16 0L10 6.59l4.37-4.37a.82.82 0 1 1 1.16 1.16L11.16 7.75l4.37 4.37a.82.82 0 1 1-1.16 1.16L10 8.91l-4.37 4.37a.82.82 0 1 1-1.16-1.16l4.37-4.37-4.37-4.37a.82.82 0 0 1 0-1.16Z"></path></svg>`;
    default:
      return "";
  }
}

const CODE_LANGUAGES = [
  "bash", "python", "bat", "powershell", "yaml", "java", "kusto", "ini", "go",
  "apache", "sql", "php", "hcl", "log", "json", "javascript", "typescript", "c", "cpp", "html", "xml", "dockerfile",
];
const CODE_LANGUAGE_ALIASES: Record<string, string> = {
  sh: "bash", shell: "bash", zsh: "bash", console: "bash",
  cmd: "bat", batch: "bat", ps: "powershell", ps1: "powershell",
  py: "python", yml: "yaml", kql: "kusto", golang: "go",
  js: "javascript", ts: "typescript", conf: "ini", docker: "dockerfile",
};

// Build-time syntax highlighting with light/dark token colors exposed as CSS variables.
const highlighter = await createHighlighter({
  themes: ["github-light", "github-dark"],
  langs: CODE_LANGUAGES,
});
const loadedLanguages = new Set(highlighter.getLoadedLanguages());

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function highlightCode(code: string, rawLang: string | undefined): string {
  const requested = (rawLang ?? "").trim().split(/\s+/)[0].toLowerCase();
  if (requested === "mermaid") {
    return `<pre><code class="language-mermaid">${escapeHtml(code)}</code></pre>\n`;
  }

  const lang = CODE_LANGUAGE_ALIASES[requested] ?? requested;
  const html = highlighter.codeToHtml(code, {
    lang: loadedLanguages.has(lang) ? lang : "text",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
  const pre = requested ? html.replace("<pre ", `<pre data-lang="${escapeHtml(requested)}" `) : html;
  // The wrapper hosts the copy button added on the client, without shifting layout.
  return `<div class="code-block">${pre}</div>\n`;
}

marked.use({
  walkTokens(token: any) {
    // marked rebuilds image alt text from child tokens without escaping it, so a `"` breaks the tag.
    // Render the plain alt text, escaped, instead.
    if (token.type === "image" && typeof token.text === "string") {
      token.tokens = undefined;
      token.text = token.text
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
    if (token.type === "blockquote") {
      const firstToken = token.tokens?.[0];
      if (firstToken && firstToken.type === "paragraph") {
        const firstChild = firstToken.tokens?.[0];
        if (firstChild && firstChild.type === "text") {
          const match = firstChild.text.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
          if (match) {
            const alertType = match[1].toLowerCase();
            token.isAlert = true;
            token.alertType = alertType;

            // Remove from first child text
            firstChild.text = firstChild.text.substring(match[0].length).replace(/^[\r\n\s]+/, "");
            firstChild.raw = firstChild.raw.substring(match[0].length).replace(/^[\r\n\s]+/, "");

            // Remove from parent paragraph
            firstToken.text = firstToken.text.substring(match[0].length).replace(/^[\r\n\s]+/, "");
            firstToken.raw = firstToken.raw.substring(match[0].length).replace(/^[\r\n\s]+/, "");

            // With `breaks: true` the newline after the marker becomes a leading <br>; drop it.
            while (firstToken.tokens.length > 0) {
              const lead = firstToken.tokens[0];
              if (lead.type === "br" || (lead.type === "text" && !String(lead.text).trim())) {
                firstToken.tokens.shift();
              } else {
                break;
              }
            }
          }
        }
      }
    }
  },
  renderer: {
    code(token: any) {
      return highlightCode(String(token.text ?? ""), token.lang);
    },
    blockquote(this: any, token: any) {
      const content = this.parser.parse(token.tokens);
      if (token.isAlert) {
        const alertType = token.alertType || "note";
        const titleText = alertType.toUpperCase();
        const icon = getAlertIcon(alertType);
        return `<div class="markdown-alert markdown-alert-${alertType}">` +
                 `<p class="markdown-alert-title">${icon}${titleText}</p>` +
                 content +
               `</div>\n`;
      }
      return `<blockquote>\n${content}</blockquote>\n`;
    }
  }
});

export interface RenderOptions {
  /** Content folder name, used to resolve relative image paths for intrinsic sizes. */
  bucket?: string;
  /** Page language, used to localize callout titles. */
  lang?: Lang;
}

const ALERT_TITLES_TR: Record<string, string> = {
  NOTE: "NOT",
  TIP: "İPUCU",
  IMPORTANT: "ÖNEMLİ",
  WARNING: "UYARI",
  CAUTION: "DİKKAT",
};

function localizeAlerts(html: string, lang: Lang | undefined): string {
  if (lang !== "tr") return html;
  return html.replace(
    /(<p class="markdown-alert-title">[\s\S]*?<\/svg>)(NOTE|TIP|IMPORTANT|WARNING|CAUTION)(<\/p>)/g,
    (_match, start, title, end) => `${start}${ALERT_TITLES_TR[title]}${end}`,
  );
}

export function renderMarkdown(markdown: string, options: RenderOptions = {}): string {
  const rendered = marked.parse(markdown, { gfm: true, breaks: true }) as string;

  const sanitized = sanitizeRenderedHtml(rendered, options);
  const withIcons = localizeAlerts(inlineFontAwesome(sanitized), options.lang);
  // Wide tables scroll inside their own container instead of being clipped by the page.
  const withTables = withIcons
    .replace(/<table(?=[\s>])/g, '<div class="table-wrap" role="region" tabindex="0"><table')
    .replace(/<\/table>/g, "</table></div>");
  return withTables.replace(/(src|href)=(['"])(\/(?!\/)[^'"]+)\2/g, (_match, attribute, quote, path) => {
    return `${attribute}=${quote}${prefixBaseUrl(path)}${quote}`;
  });
}

export function getEntryBucket(entry: ContentEntry): string {
  return entry.id.split("/")[0];
}

export function readingMinutes(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`|\-[\]()!]/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export interface TocGroup {
  id: string;
  text: string;
  children: Array<{ id: string; text: string }>;
}

function stripTags(value: string): string {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// Kept identical to the original implementation so existing #anchor links keep working.
function slugifyHeading(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Adds stable ids to h2–h4 headings and builds a table of contents.
 * `tocDepth` 2 lists only H2 sections; 3 nests H3 headings under their H2.
 */
export function buildToc(html: string, tocDepth: 2 | 3 = 2): { html: string; toc: TocGroup[] } {
  const usedIds = new Map<string, number>();
  const toc: TocGroup[] = [];

  const output = html.replace(/<h([234])([^>]*)>([\s\S]*?)<\/h\1>/g, (full, levelRaw, attrsRaw, inner) => {
    const level = Number(levelRaw);
    const text = stripTags(inner);
    if (!text) return full;

    const attrs = String(attrsRaw ?? "");
    const existingId = attrs.match(/\sid=["']([^"']+)["']/i)?.[1];
    let id = existingId ?? (slugifyHeading(text) || "section");
    const seen = usedIds.get(id) ?? 0;
    usedIds.set(id, seen + 1);
    if (seen > 0) id = `${id}-${seen + 1}`;

    if (level === 2) {
      toc.push({ id, text, children: [] });
    } else if (level === 3 && tocDepth === 3) {
      const parent = toc.at(-1);
      if (parent) parent.children.push({ id, text });
      else toc.push({ id, text, children: [] });
    }

    const attrsWithoutId = attrs.replace(/\sid=["'][^"']+["']/i, "");
    return `<h${level}${attrsWithoutId} id="${id}">${inner}</h${level}>`;
  });

  return { html: output, toc };
}

const BLOCKED_HTML_ELEMENTS = new Set(["script", "base", "meta", "link", "object", "embed"]);
const URL_ATTRIBUTES = new Set(["href", "src", "poster", "cite", "action", "formaction", "xlink:href"]);
const UNSAFE_STYLE = /(?:expression\s*\(|javascript\s*:|@import\b|behavior\s*:|-moz-binding\s*:)/i;

function isSafeUrl(value: string, tagName: string): boolean {
  const normalized = value.replace(/[\u0000-\u001F\u007F\s]+/g, "").toLowerCase();
  if (!normalized || normalized.startsWith("#") || normalized.startsWith("/") || normalized.startsWith("./") || normalized.startsWith("../")) {
    return true;
  }
  if (normalized.startsWith("data:image/png;base64,") || normalized.startsWith("data:image/jpeg;base64,") || normalized.startsWith("data:image/webp;base64,")) {
    return tagName === "img";
  }

  try {
    const url = new URL(value);
    if (tagName === "iframe") {
      return url.protocol === "https:" && (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") && url.pathname.startsWith("/embed/");
    }
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol);
  } catch {
    return !normalized.includes(":");
  }
}

function setAttr(node: any, name: string, value: string): void {
  if (!node.attrs.some((attribute: any) => attribute.name === name)) {
    node.attrs.push({ name, value });
  }
}

function enhanceImage(node: any, bucket: string | undefined): void {
  const attrs = node.attrs as Array<{ name: string; value: string }>;
  setAttr(node, "loading", "lazy");
  setAttr(node, "decoding", "async");

  // Intrinsic dimensions prevent layout shift; skip images whose size is driven by an inline style.
  const hasSize = attrs.some((attribute) => attribute.name === "width" || attribute.name === "height");
  const hasStyle = attrs.some((attribute) => attribute.name === "style");
  const src = attrs.find((attribute) => attribute.name === "src")?.value;
  if (!hasSize && !hasStyle && src) {
    const size = getImageSize(src, bucket);
    if (size) {
      attrs.push({ name: "width", value: String(size.width) }, { name: "height", value: String(size.height) });
    }
  }
}

function sanitizeRenderedHtml(html: string, options: RenderOptions = {}): string {
  const fragment = parseFragment(html) as any;

  const cleanChildren = (parent: any) => {
    if (!Array.isArray(parent.childNodes)) return;

    parent.childNodes = parent.childNodes.filter((node: any) => {
      const tagName = String(node.tagName ?? "").toLowerCase();
      if (BLOCKED_HTML_ELEMENTS.has(tagName)) {
        return false;
      }

      if (Array.isArray(node.attrs)) {
        node.attrs = node.attrs.filter((attribute: any) => {
          const name = String(attribute.name ?? "").toLowerCase();
          const value = String(attribute.value ?? "");
          if (name.startsWith("on") || name === "srcdoc") return false;
          if (name === "style" && UNSAFE_STYLE.test(value)) return false;
          if (URL_ATTRIBUTES.has(name) && !isSafeUrl(value, tagName)) return false;
          return true;
        });
      }

      if (tagName === "style" && node.childNodes?.some((child: any) => UNSAFE_STYLE.test(String(child.value ?? "")))) {
        return false;
      }

      if (tagName === "iframe") {
        const source = node.attrs?.find((attribute: any) => attribute.name === "src")?.value;
        if (!source || !isSafeUrl(source, tagName)) return false;
        node.attrs = (node.attrs ?? []).filter((attribute: any) => !["sandbox", "referrerpolicy", "loading"].includes(attribute.name));
        node.attrs.push(
          { name: "sandbox", value: "allow-scripts allow-same-origin allow-presentation" },
          { name: "referrerpolicy", value: "strict-origin-when-cross-origin" },
          { name: "loading", value: "lazy" },
        );
      }

      if (tagName === "img" && Array.isArray(node.attrs)) {
        enhanceImage(node, options.bucket);
      }

      if (tagName === "a" && node.attrs?.some((attribute: any) => attribute.name === "target" && attribute.value === "_blank")) {
        node.attrs = node.attrs.filter((attribute: any) => attribute.name !== "rel");
        node.attrs.push({ name: "rel", value: "noopener noreferrer" });
      }

      cleanChildren(node);
      if (node.content) cleanChildren(node.content);
      return true;
    });
  };

  cleanChildren(fragment);
  return serialize(fragment);
}

export function resolveAssetPath(path: string): string {
  return prefixBaseUrl(path);
}
