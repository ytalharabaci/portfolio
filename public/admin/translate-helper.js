// Cloudflare Workers AI Translation Helper for Sveltia CMS
// Uses the edge endpoint /api/translate powered by Llama 3.1 & M2M-100 on Workers AI
(() => {
  const addTranslateButton = () => {
    const hash = window.location.hash;
    if (!hash.includes("/entries/")) {
      const existing = document.getElementById("yc-translate-btn");
      if (existing) existing.remove();
      return;
    }

    if (document.getElementById("yc-translate-btn")) return;

    const btn = document.createElement("button");
    btn.id = "yc-translate-btn";
    btn.type = "button";
    btn.style.cssText = `
      position: fixed;
      top: 12px;
      right: 320px;
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
      transition: all 0.2s ease;
    `;
    btn.innerHTML = `🌐 <span>AI Çeviri (TR ↔ EN)</span>`;
    btn.onmouseenter = () => { btn.style.transform = "translateY(-1px)"; };
    btn.onmouseleave = () => { btn.style.transform = "none"; };
    btn.onclick = openTranslateModal;
    document.body.appendChild(btn);
  };

  const findFieldValue = (fieldName) => {
    // 1. Try standard name attribute
    const input = document.querySelector(`input[name='${fieldName}'], textarea[name='${fieldName}']`);
    if (input && input.value) return input.value;

    // 2. Try Sveltia data-key-path
    const keyed = document.querySelector(`[data-key-path='${fieldName}'] input, [data-key-path='${fieldName}'] textarea`);
    if (keyed && keyed.value) return keyed.value;

    // 3. For body / markdown editor
    if (fieldName === "body") {
      const editor = document.querySelector(".cm-content, textarea[name='body'], .ProseMirror");
      if (editor) return editor.innerText || editor.value || "";
    }

    return "";
  };

  const setFieldValue = (fieldName, value) => {
    let target = document.querySelector(`input[name='${fieldName}'], textarea[name='${fieldName}']`);
    if (!target) {
      target = document.querySelector(`[data-key-path='${fieldName}'] input, [data-key-path='${fieldName}'] textarea`);
    }

    if (target) {
      target.value = value;
      target.dispatchEvent(new Event("input", { bubbles: true }));
      target.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }

    // Markdown / CodeMirror body handling
    if (fieldName === "body") {
      const ta = document.querySelector("textarea[name='body']");
      if (ta) {
        ta.value = value;
        ta.dispatchEvent(new Event("input", { bubbles: true }));
        ta.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      }
    }

    return false;
  };

  const openTranslateModal = () => {
    const existing = document.getElementById("yc-translate-modal");
    if (existing) {
      existing.remove();
      return;
    }

    const currentTitle = findFieldValue("title");
    const currentDesc = findFieldValue("description");
    const currentBody = findFieldValue("body");

    const modal = document.createElement("div");
    modal.id = "yc-translate-modal";
    modal.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 10000;
      background: rgba(0, 0, 0, 0.65);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      backdrop-filter: blur(4px);
    `;

    modal.innerHTML = `
      <div style="background: var(--sui-surface-color, #fff); color: var(--sui-text-color, #1e293b); max-width: 720px; width: 100%; border-radius: 12px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); font-family: system-ui, -apple-system, sans-serif; max-height: 90vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid rgba(120,120,120,0.2); padding-bottom: 12px;">
          <div>
            <h3 style="margin: 0; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
              <span>🌐</span> Cloudflare Workers AI · Çeviri Asistanı
            </h3>
            <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">
              Llama 3.1 & M2M-100 modelleriyle Markdown, kod ve teknik terimleri koruyarak çevirir.
            </p>
          </div>
          <button id="yc-close-translate" type="button" style="border: none; background: none; font-size: 20px; cursor: pointer; color: inherit;">✕</button>
        </div>

        <div style="display: flex; gap: 12px; margin-bottom: 16px; align-items: center;">
          <label style="font-size: 13px; font-weight: 500;">Çeviri Yönü:</label>
          <select id="yc-trans-direction" style="padding: 6px 10px; border-radius: 6px; border: 1px solid #cbd5e1; background: var(--sui-surface-color, #fff); color: inherit; font-size: 13px;">
            <option value="tr-en">🇹🇷 Türkçe ➔ 🇬🇧 English</option>
            <option value="en-tr">🇬🇧 English ➔ 🇹🇷 Türkçe</option>
          </select>
          <button id="yc-pull-form" type="button" style="margin-left: auto; padding: 5px 10px; font-size: 12px; border-radius: 6px; border: 1px solid #cbd5e1; background: rgba(0,0,0,0.04); cursor: pointer; color: inherit;">
            🔄 Formdan Yeniden Çek
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          <!-- Title -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <label style="font-size: 12px; font-weight: 600;">Başlık (Title)</label>
              <label style="font-size: 11px; color: #64748b; cursor: pointer;"><input type="checkbox" id="yc-chk-title" checked> Çeviriye dahil et</label>
            </div>
            <input type="text" id="yc-src-title" value="${currentTitle.replace(/"/g, '&quot;')}" placeholder="Başlık metni..." style="width: 100%; box-sizing: border-box; padding: 8px 10px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 13px; background: inherit; color: inherit;" />
          </div>

          <!-- Description -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <label style="font-size: 12px; font-weight: 600;">Açıklama (Description)</label>
              <label style="font-size: 11px; color: #64748b; cursor: pointer;"><input type="checkbox" id="yc-chk-desc" checked> Çeviriye dahil et</label>
            </div>
            <textarea id="yc-src-desc" rows="2" placeholder="Kısa açıklama..." style="width: 100%; box-sizing: border-box; padding: 8px 10px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 13px; background: inherit; color: inherit; resize: vertical;">${currentDesc}</textarea>
          </div>

          <!-- Body -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <label style="font-size: 12px; font-weight: 600;">Gövde (Markdown Body)</label>
              <label style="font-size: 11px; color: #64748b; cursor: pointer;"><input type="checkbox" id="yc-chk-body" checked> Çeviriye dahil et</label>
            </div>
            <textarea id="yc-src-body" rows="6" placeholder="Markdown gövde metni..." style="width: 100%; box-sizing: border-box; padding: 8px 10px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 12px; font-family: monospace; background: inherit; color: inherit; resize: vertical;">${currentBody}</textarea>
          </div>
        </div>

        <div style="margin-top: 18px; display: flex; gap: 10px; align-items: center;">
          <button id="yc-start-translate" type="button" style="padding: 8px 16px; background: #0284c7; color: #ffffff; border: none; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            ⚡ Çeviriyi Başlat
          </button>
          <span id="yc-trans-status" style="font-size: 12px; color: #64748b;"></span>
        </div>

        <!-- Results section -->
        <div id="yc-trans-results" style="display: none; margin-top: 20px; border-top: 1px dashed rgba(120,120,120,0.3); padding-top: 16px;">
          <h4 style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #10b981;">
            ✓ Çeviri Sonuçları
          </h4>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div id="yc-res-title-box" style="display: none;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b;">Çevrilen Başlık</span>
                <div style="display: flex; gap: 6px;">
                  <button type="button" class="yc-copy-btn" data-target="yc-out-title" style="padding: 2px 8px; font-size: 11px; border-radius: 4px; border: 1px solid #cbd5e1; background: inherit; cursor: pointer;">Kopyala</button>
                  <button type="button" class="yc-apply-btn" data-field="title" data-target="yc-out-title" style="padding: 2px 8px; font-size: 11px; border-radius: 4px; border: 1px solid #0284c7; background: rgba(2,132,199,0.1); color: #0284c7; cursor: pointer;">Forma Yaz</button>
                </div>
              </div>
              <input type="text" id="yc-out-title" readonly style="width: 100%; box-sizing: border-box; padding: 6px 10px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 13px; background: rgba(0,0,0,0.02); color: inherit;" />
            </div>

            <div id="yc-res-desc-box" style="display: none;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b;">Çevrilen Açıklama</span>
                <div style="display: flex; gap: 6px;">
                  <button type="button" class="yc-copy-btn" data-target="yc-out-desc" style="padding: 2px 8px; font-size: 11px; border-radius: 4px; border: 1px solid #cbd5e1; background: inherit; cursor: pointer;">Kopyala</button>
                  <button type="button" class="yc-apply-btn" data-field="description" data-target="yc-out-desc" style="padding: 2px 8px; font-size: 11px; border-radius: 4px; border: 1px solid #0284c7; background: rgba(2,132,199,0.1); color: #0284c7; cursor: pointer;">Forma Yaz</button>
                </div>
              </div>
              <textarea id="yc-out-desc" rows="2" readonly style="width: 100%; box-sizing: border-box; padding: 6px 10px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 13px; background: rgba(0,0,0,0.02); color: inherit;"></textarea>
            </div>

            <div id="yc-res-body-box" style="display: none;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b;">Çevrilen Gövde (Markdown)</span>
                <div style="display: flex; gap: 6px;">
                  <button type="button" class="yc-copy-btn" data-target="yc-out-body" style="padding: 2px 8px; font-size: 11px; border-radius: 4px; border: 1px solid #cbd5e1; background: inherit; cursor: pointer;">Kopyala</button>
                  <button type="button" class="yc-apply-btn" data-field="body" data-target="yc-out-body" style="padding: 2px 8px; font-size: 11px; border-radius: 4px; border: 1px solid #0284c7; background: rgba(2,132,199,0.1); color: #0284c7; cursor: pointer;">Forma Yaz</button>
                </div>
              </div>
              <textarea id="yc-out-body" rows="8" readonly style="width: 100%; box-sizing: border-box; padding: 6px 10px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 12px; font-family: monospace; background: rgba(0,0,0,0.02); color: inherit;"></textarea>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    document.getElementById("yc-close-translate").onclick = () => modal.remove();
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };

    document.getElementById("yc-pull-form").onclick = () => {
      document.getElementById("yc-src-title").value = findFieldValue("title");
      document.getElementById("yc-src-desc").value = findFieldValue("description");
      document.getElementById("yc-src-body").value = findFieldValue("body");
      const status = document.getElementById("yc-trans-status");
      status.textContent = "Form verileri yenilendi.";
      setTimeout(() => { if (status.textContent === "Form verileri yenilendi.") status.textContent = ""; }, 2000);
    };

    const callTranslateApi = async (text, sourceLang, targetLang) => {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sourceLang, targetLang }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      return data.translation || "";
    };

    document.getElementById("yc-start-translate").onclick = async () => {
      const direction = document.getElementById("yc-trans-direction").value;
      const [sourceLang, targetLang] = direction.split("-");
      const transBtn = document.getElementById("yc-start-translate");
      const status = document.getElementById("yc-trans-status");
      const resultsDiv = document.getElementById("yc-trans-results");

      const doTitle = document.getElementById("yc-chk-title").checked;
      const doDesc = document.getElementById("yc-chk-desc").checked;
      const doBody = document.getElementById("yc-chk-body").checked;

      const titleVal = document.getElementById("yc-src-title").value.trim();
      const descVal = document.getElementById("yc-src-desc").value.trim();
      const bodyVal = document.getElementById("yc-src-body").value.trim();

      if (!titleVal && !descVal && !bodyVal) {
        status.textContent = "Lütfen çevrilecek en az bir alan girin.";
        return;
      }

      transBtn.disabled = true;
      transBtn.style.opacity = "0.7";
      transBtn.textContent = "⏳ Çevriliyor…";
      status.style.color = "#0284c7";
      resultsDiv.style.display = "block";

      try {
        if (doTitle && titleVal) {
          status.textContent = "Başlık çevriliyor…";
          const translatedTitle = await callTranslateApi(titleVal, sourceLang, targetLang);
          document.getElementById("yc-out-title").value = translatedTitle;
          document.getElementById("yc-res-title-box").style.display = "block";
        }

        if (doDesc && descVal) {
          status.textContent = "Açıklama çevriliyor…";
          const translatedDesc = await callTranslateApi(descVal, sourceLang, targetLang);
          document.getElementById("yc-out-desc").value = translatedDesc;
          document.getElementById("yc-res-desc-box").style.display = "block";
        }

        if (doBody && bodyVal) {
          status.textContent = "Markdown gövdesi Workers AI ile çevriliyor…";
          const translatedBody = await callTranslateApi(bodyVal, sourceLang, targetLang);
          document.getElementById("yc-out-body").value = translatedBody;
          document.getElementById("yc-res-body-box").style.display = "block";
        }

        status.style.color = "#10b981";
        status.textContent = "Tüm çeviriler tamamlandı!";
      } catch (err) {
        status.style.color = "#ef4444";
        status.textContent = `Hata: ${err.message || String(err)}`;
      } finally {
        transBtn.disabled = false;
        transBtn.style.opacity = "1";
        transBtn.textContent = "⚡ Çeviriyi Başlat";
      }
    };

    // Copy buttons
    modal.querySelectorAll(".yc-copy-btn").forEach((btn) => {
      btn.onclick = async () => {
        const targetId = btn.getAttribute("data-target");
        const val = document.getElementById(targetId)?.value || "";
        if (!val) return;
        await navigator.clipboard.writeText(val);
        const original = btn.textContent;
        btn.textContent = "✓ Kopyalandı";
        btn.style.color = "#10b981";
        setTimeout(() => {
          btn.textContent = original;
          btn.style.color = "inherit";
        }, 1500);
      };
    });

    // Apply to Form buttons
    modal.querySelectorAll(".yc-apply-btn").forEach((btn) => {
      btn.onclick = () => {
        const field = btn.getAttribute("data-field");
        const targetId = btn.getAttribute("data-target");
        const val = document.getElementById(targetId)?.value || "";
        if (!val) return;
        const success = setFieldValue(field, val);
        const original = btn.textContent;
        if (success) {
          btn.textContent = "✓ Forma Yazıldı";
          btn.style.color = "#10b981";
        } else {
          btn.textContent = "⚠️ Alan Bulunamadı";
          btn.style.color = "#eab308";
        }
        setTimeout(() => {
          btn.textContent = original;
          btn.style.color = "#0284c7";
        }, 2000);
      };
    });
  };

  // Poll for entry screen navigation
  setInterval(addTranslateButton, 1000);
  window.addEventListener("hashchange", addTranslateButton);
})();

