import type { APIRoute } from "astro";
import { EMAILS, SITE } from "../../config/site";

export const prerender = true;

// RFC 9116. `Expires` is renewed on every deploy; redeploy at least once a year to keep it valid.
export const GET: APIRoute = () => {
  const expires = new Date();
  expires.setUTCFullYear(expires.getUTCFullYear() + 1);

  const lines = [
    `Contact: mailto:${EMAILS.en}`,
    `Contact: mailto:${EMAILS.tr}`,
    `Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, "Z")}`,
    "Preferred-Languages: en, tr",
    `Canonical: ${new URL("/.well-known/security.txt", SITE.url).toString()}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
