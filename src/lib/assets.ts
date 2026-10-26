import fs from "node:fs";
import path from "node:path";
import { LANGS } from "../config/site";
import { getEntriesByLang, getEntryBucket, getPostSlug, type ContentEntry } from "./content";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
};

function listFiles(dir: string, baseDir = dir): Array<{ relativePath: string; absolutePath: string }> {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((dirent) => {
    const absolutePath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) return listFiles(absolutePath, baseDir);
    const relativePath = path.relative(baseDir, absolutePath).split(path.sep).join("/");
    return [{ relativePath, absolutePath }];
  });
}

/** Static paths for every media file stored next to a post's markdown, e.g. /tr/blog/<slug>/featured.webp */
export function contentAssetPaths(filter: (entry: ContentEntry) => boolean) {
  return LANGS.flatMap((lang) =>
    getEntriesByLang(lang)
      .filter(filter)
      .flatMap((entry) => {
        const contentDir = path.join(process.cwd(), "content", getEntryBucket(entry));
        return listFiles(contentDir)
          .filter((file) => path.extname(file.relativePath).toLowerCase() in MIME_TYPES)
          .map((file) => ({
            params: { lang, slug: getPostSlug(entry), image: file.relativePath },
            props: { filePath: file.absolutePath },
          }));
      }),
  );
}

export function serveContentAsset(filePath: string): Response {
  const contentType = MIME_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
  return new Response(fs.readFileSync(filePath), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
