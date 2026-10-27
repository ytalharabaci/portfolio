// SEO and Publishing Helper for Sveltia CMS
// Features: Description character counter, H1 validator, and live SERP/Social card preview
(() => {
  // 1. Description Character Counter & H1 Checker
  const checkFields = () => {
    // Find description textarea
    const textareas = document.querySelectorAll("textarea");
    textareas.forEach((ta) => {
      // Check if this textarea belongs to description
      const fieldWrapper = ta.closest(".field, .field-editor, [class*='field']");
      const label = fieldWrapper?.querySelector("label, .label, [class*='label']")?.textContent || "";
      const isDesc = label.toLowerCase().includes("açıklama") || label.toLowerCase().includes("description");

      if (isDesc) {
        let counter = fieldWrapper.querySelector(".yc-char-counter");
        if (!counter) {
          counter = document.createElement("div");
          counter.className = "yc-char-counter";
          counter.style.cssText = `
            font-size: 11px;
            font-family: system-ui, sans-serif;
            margin-top: 4px;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: color 0.2s ease;
          `;
          ta.parentElement?.appendChild(counter);

          ta.addEventListener("input", () => updateDescCounter(ta, counter));
        }
        updateDescCounter(ta, counter);
      }
    });

    // Check for H1 in body markdown editor
    const codeEditors = document.querySelectorAll(".cm-content, textarea[name='body'], .ProseMirror");
    codeEditors.forEach((editor) => {
      const text = editor.innerText || editor.value || "";
      const hasH1 = /^#[^#\n].*$/m.test(text);

      const parent = editor.closest("[class*='widget'], .field, .field-editor");
      let h1Warn = parent?.querySelector(".yc-h1-warning");
      if (hasH1) {
        if (!h1Warn && parent) {
          h1Warn = document.createElement("div");
          h1Warn.className = "yc-h1-warning";
          h1Warn.style.cssText = `
            background: rgba(234, 179, 8, 0.12);
            color: #ca8a04;
            border: 1px solid rgba(234, 179, 8, 0.3);
            border-radius: 6px;
            padding: 6px 10px;
            margin: 6px 0;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
          `;
          h1Warn.innerHTML = `⚠️ <span>Gövde içinde <strong># H1</strong> başlığı tespit edildi. Sayfa başlığı otomatik H1 basıldığı için bölümlerde <strong>## H2</strong> kullanmanız SEO için önerilir.</span>`;
          editor.parentElement?.insertBefore(h1Warn, editor);
        }
      } else if (h1Warn) {
        h1Warn.remove();
      }
    });

    // Add Live SEO Preview Button if on entry page
    addSeoPreviewButton();
  };

  const updateDescCounter = (ta, counter) => {
    const len = ta.value.length;
    let color = "#10b981"; // green
    let hint = "İdeal aralık (140–160)";

    if (len === 0) {
      color = "#94a3b8";
      hint = "Arama ve sosyal medya kartları için 140–160 karakter yazın.";
    } else if (len < 130) {
      color = "#eab308"; // yellow
      hint = `Biraz kısa (${140 - len} karakter daha ekleyebilirsiniz)`;
    } else if (len > 165) {
      color = "#f97316"; // orange
      hint = `Uzun (${len - 160} karakter kırpılması önerilir)`;
    }

    counter.style.color = color;
    counter.innerHTML = `<strong>${len}</strong> / 160 karakter · <span>${hint}</span>`;
  };

  // 2. Live Social & SERP Card Preview Modal
  const addSeoPreviewButton = () => {
    const hash = window.location.hash;
    if (!hash.includes("/entries/")) return;

    if (document.getElementById("yc-seo-preview-btn")) return;

    // Place button in header actions or float top right
    const btn = document.createElement("button");
    btn.id = "yc-seo-preview-btn";
    btn.type = "button";
    btn.style.cssText = `
      position: fixed;
      top: 12px;
      right: 180px;
      z-index: 1000;
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid var(--sui-primary-border-color, #cbd5e1);
      background: var(--sui-surface-color, #ffffff);
      color: var(--sui-text-color, #1e293b);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    `;
    btn.innerHTML = `👁️ <span>Sosyal Kart & SERP</span>`;
    btn.onclick = openSeoModal;
    document.body.appendChild(btn);
  };

  const openSeoModal = () => {
    const existing = document.getElementById("yc-seo-modal");
    if (existing) {
      existing.remove();
      return;
    }

    // Collect values from the current form
    const titleInput = document.querySelector("input[name='title'], [data-key-path='title'] input");
    const descInput = document.querySelector("textarea[name='description'], [data-key-path='description'] textarea");
    const thumbImg = document.querySelector(".ycc-thumb, [data-key-path='image'] img");

    const title = titleInput?.value || document.querySelector("h1, h2")?.textContent || "Yazı Başlığı";
    const desc = descInput?.value || "Yazının açıklaması buraya gelecek...";
    const imgSrc = thumbImg?.src || "https://ytalharabaci.dev/link-card.jpg";

    const modal = document.createElement("div");
    modal.id = "yc-seo-modal";
    modal.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 10000;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      backdrop-filter: blur(4px);
    `;

    modal.innerHTML = `
      <div style="background: var(--sui-surface-color, #fff); color: var(--sui-text-color, #1e293b); max-width: 650px; width: 100%; border-radius: 12px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); font-family: system-ui, sans-serif; max-height: 90vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(120,120,120,0.2); padding-bottom: 12px;">
          <h3 style="margin: 0; font-size: 16px; font-weight: 600;">Canlı SEO & Sosyal Medya Önizlemesi</h3>
          <button id="yc-close-seo" type="button" style="border: none; background: none; font-size: 18px; cursor: pointer; color: inherit;">✕</button>
        </div>

        <!-- Google SERP Preview -->
        <div style="margin-bottom: 24px;">
          <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 8px;">Google Arama Sonucu</div>
          <div style="background: #ffffff; color: #1f2937; padding: 14px 16px; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <div style="font-size: 12px; color: #4b5563; display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
              <span>ytalharabaci.dev</span> › blog › ...
            </div>
            <div style="font-size: 18px; color: #1a0dab; font-weight: 400; text-decoration: none; cursor: pointer; line-height: 1.3; margin-bottom: 4px;">
              ${title} | ytalharabaci.dev
            </div>
            <div style="font-size: 13px; color: #4d5156; line-height: 1.4;">
              ${desc}
            </div>
          </div>
        </div>

        <!-- Social Media / Open Graph Card Preview -->
        <div>
          <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 8px;">LinkedIn, X (Twitter) & WhatsApp Kartı (1200 × 630)</div>
          <div style="border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <img src="${imgSrc}" alt="Kapak" style="width: 100%; aspect-ratio: 1200 / 630; object-fit: cover; display: block; background: #f1f5f9;" />
            <div style="padding: 12px 16px;">
              <div style="font-size: 12px; color: #64748b; text-transform: uppercase; margin-bottom: 2px;">ytalharabaci.dev</div>
              <div style="font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 4px; line-height: 1.3;">
                ${title}
              </div>
              <div style="font-size: 12px; color: #475569; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${desc}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.getElementById("yc-close-seo")?.addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
  };

  // Run observer
  const observer = new MutationObserver(checkFields);
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener("hashchange", () => {
    const btn = document.getElementById("yc-seo-preview-btn");
    if (btn && !window.location.hash.includes("/entries/")) {
      btn.remove();
    }
  });
})();

