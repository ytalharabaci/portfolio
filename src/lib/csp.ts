import { createHash } from "node:crypto";
import type { AstroGlobal } from "astro";

/**
 * Registers a CSP hash for an `is:inline` script and returns its source unchanged.
 * Astro only hashes the scripts it bundles, so render-blocking inline scripts must be added by hand.
 * Use with `<script is:inline set:html={inlineScript(Astro, CODE)} />` so the hashed text is exactly what ships.
 */
export function inlineScript(astro: AstroGlobal, code: string): string {
  const hash = createHash("sha256").update(code, "utf8").digest("base64");
  astro.csp?.insertScriptHash(`sha256-${hash}`);
  return code;
}
