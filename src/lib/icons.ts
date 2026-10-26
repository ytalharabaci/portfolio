import fs from "node:fs";
import path from "node:path";

export type IconSet = "solid" | "regular" | "brands";

const ICON_ROOT = path.join(process.cwd(), "node_modules", "@fortawesome", "fontawesome-free", "svgs");
const cache = new Map<string, string>();

/**
 * Returns a Font Awesome icon as an inline SVG string (build-time only).
 * Inlining avoids shipping the ~100 KB Font Awesome stylesheet and its webfonts.
 */
export function iconSvg(set: IconSet, name: string, className = "icon"): string {
  const key = `${set}/${name}`;
  let svg = cache.get(key);
  if (svg === undefined) {
    const file = path.join(ICON_ROOT, set, `${name}.svg`);
    svg = fs.existsSync(file) ? fs.readFileSync(file, "utf8").trim() : "";
    cache.set(key, svg);
  }
  if (!svg) return "";
  return svg.replace("<svg ", `<svg class="${className}" aria-hidden="true" focusable="false" `);
}

/** Replaces `<i class="fa-solid fa-name"></i>` markup in rendered HTML with inline SVG. */
export function inlineFontAwesome(html: string): string {
  return html.replace(
    /<i\s+class="fa-(solid|regular|brands)\s+fa-([a-z0-9-]+)"[^>]*>\s*<\/i>/g,
    (match, set: IconSet, name: string) => iconSvg(set, name) || match,
  );
}
