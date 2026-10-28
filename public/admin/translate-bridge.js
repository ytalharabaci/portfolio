// Cloudflare Workers AI Bridge for Sveltia CMS
// Integrates Sveltia's native translation buttons (文A) directly with Cloudflare Workers AI.
// Runs before sveltia-cms.js so preferences and fetch interceptor are registered on startup.
(() => {
  const PREFS_KEY = "sveltia-cms.prefs";
  const DUMMY_KEY = "sk-cloudflareworkersaibuiltin00000000";

  // 1. Ensure Sveltia CMS uses DeepSeek service mapped to our Cloudflare Worker AI
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    const prefs = raw ? JSON.parse(raw) : {};
    let changed = false;

    if (prefs.defaultTranslationService !== "deepseek") {
      prefs.defaultTranslationService = "deepseek";
      changed = true;
    }

    prefs.apiKeys = prefs.apiKeys || {};
    if (!prefs.apiKeys.deepseek || !prefs.apiKeys.deepseek.startsWith("sk-")) {
      prefs.apiKeys.deepseek = DUMMY_KEY;
      changed = true;
    }

    if (changed) {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    }
  } catch (err) {
    console.warn("[translate-bridge] Failed to initialize translation preferences:", err);
  }

  // 2. Intercept outgoing translation API calls and route them to our Cloudflare Worker
  const originalFetch = window.fetch;
  window.fetch = async function (resource, init) {
    const url = typeof resource === "string" ? resource : resource?.url;
    if (
      url &&
      (url.includes("api.deepseek.com") ||
        url.includes("api.openai.com") ||
        url.includes("api.mistral.ai"))
    ) {
      console.log("[translate-bridge] Routing native Sveltia translation request to Cloudflare Workers AI...");
      return originalFetch.call(this, "/api/translate-sveltia", init);
    }
    return originalFetch.apply(this, arguments);
  };

  // 3. Clean UI: Hide field-level translate buttons so only the single top-level entry translator remains visible
  const style = document.createElement("style");
  style.id = "yc-single-translate-btn-style";
  style.textContent = `
    /* Hide translate buttons on individual field headers to keep UI clean and simple */
    .field header button[aria-label*="translate" i],
    .field header button[aria-label*="çevir" i],
    .field header button[title*="translate" i],
    .field header button[title*="çevir" i],
    [data-key-path] header button[aria-label*="translate" i],
    [data-key-path] header button[aria-label*="çevir" i],
    [data-key-path] header button[title*="translate" i],
    [data-key-path] header button[title*="çevir" i] {
      display: none !important;
    }
  `;
  document.head.appendChild(style);

  const hideFieldTranslateButtons = () => {
    const fieldHeaders = document.querySelectorAll(".field header, [data-key-path] header");
    fieldHeaders.forEach((header) => {
      const buttons = header.querySelectorAll("button");
      buttons.forEach((btn) => {
        const icon = btn.querySelector(".material-symbols-outlined, .icon");
        const isTranslateIcon = icon && icon.textContent.trim() === "translate";
        const aria = (btn.getAttribute("aria-label") || "").toLowerCase();
        const title = (btn.getAttribute("title") || "").toLowerCase();
        const isTranslateText =
          aria.includes("translate") ||
          aria.includes("çevir") ||
          title.includes("translate") ||
          title.includes("çevir");

        if (isTranslateIcon || isTranslateText) {
          btn.style.setProperty("display", "none", "important");
        }
      });
    });
  };

  const observer = new MutationObserver(hideFieldTranslateButtons);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // 4. Smart Markdown Paste Handler:
  // When pasting Markdown text (with ## headings, images ![], bullet lists, tables) into the WYSIWYG editor,
  // automatically switch to raw Markdown mode so headers, lists, and image syntax are never stripped!
  document.addEventListener("paste", (e) => {
    const lexicalRoot = e.target?.closest(".lexical-root");
    if (!lexicalRoot) return;

    const pastedText = e.clipboardData?.getData("text/plain") || "";
    const hasMarkdown = /(?:^|\n)(?:#{1,6}\s|[-*]\s|\!\[.*?\]\(.*?\)|```|\|.*?\|)/m.test(pastedText);
    if (!hasMarkdown) return;

    const widget = lexicalRoot.closest(".field, [class*='widget']");
    const modeBtn = widget?.querySelector(
      "button[aria-label*='markdown' i], button:has([name='markdown']), button:has(.material-symbols-outlined)"
    );
    if (modeBtn) {
      e.preventDefault();
      modeBtn.click();
      setTimeout(() => {
        const textarea = widget.querySelector("textarea");
        if (textarea) {
          const start = textarea.selectionStart || 0;
          const end = textarea.selectionEnd || 0;
          const val = textarea.value;
          textarea.value = val.slice(0, start) + pastedText + val.slice(end);
          textarea.selectionStart = textarea.selectionEnd = start + pastedText.length;
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
          textarea.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }, 60);
    }
  });

  console.info("⚡ [Cloudflare Workers AI] Sveltia CMS tek ana çeviri butonu ve Akıllı Markdown yapıştırma aktif.");
})();

