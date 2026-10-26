import rss from "@astrojs/rss";
import { getEntriesByLang, sortByDateDesc } from "../../lib/content";
import { SITE, type Lang } from "../../config/site";

export async function GET(context: any) {
  const lang = context.params.lang as Lang;
  const entries = sortByDateDesc(getEntriesByLang(lang));

  return rss({
    title: `${SITE.author} | Blog & Write-ups`,
    description: SITE.description[lang] ?? SITE.description.en,
    site: context.site || SITE.url,
    items: entries.map((entry) => ({
      title: entry.data.title || "Untitled",
      pubDate: new Date(entry.data.date || Date.now()),
      description: entry.data.description || "",
      link: `/${lang}/${entry.data.type === "writeups" ? "writeups" : "blog"}/${entry.slug}/`,
      categories: entry.data.tags,
    })),
    customData: `<language>${lang === "tr" ? "tr-TR" : "en-US"}</language>`,
  });
}

export function getStaticPaths() {
  return [
    { params: { lang: "tr" } },
    { params: { lang: "en" } },
  ];
}
