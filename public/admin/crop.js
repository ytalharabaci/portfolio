// Shared crop dialog for the admin: a fixed 1200 × 630 frame (the Open Graph card size) in which
// the image is dragged and zoomed. Used by the `cover-image` CMS field (cover-image.js) and the
// Görseller page (media/media.js). Exposes `window.YCCrop.openCropper(blob)`, which resolves to a
// 1200 × 630 PNG, or null when cancelled.
(() => {
  const OUT_W = 1200;
  const OUT_H = 630;
  const MAX_ZOOM = 8;
  // Safe zone from blog-publishing-procedure.md: keep the focal point inside the central 1080 × 560.
  const SAFE_W = 1080 / OUT_W;
  const SAFE_H = 560 / OUT_H;

  const STYLE = `
.ycc-dialog { width: min(1000px, 94vw); max-height: 94vh; padding: 0; border: 0; border-radius: 12px;
  background: #fff; color: #1f2933; box-shadow: 0 24px 64px rgba(0,0,0,.35); font: 14px/1.5 system-ui, sans-serif; }
.ycc-dialog::backdrop { background: rgba(15,23,42,.6); }
.ycc-body { display: flex; flex-direction: column; gap: 12px; padding: 20px; }
.ycc-title { margin: 0; font-size: 18px; font-weight: 600; }
.ycc-help { margin: 0; color: #52606d; }
.ycc-stage { position: relative; width: 100%; aspect-ratio: ${OUT_W} / ${OUT_H}; overflow: hidden;
  border-radius: 8px; background: #111 repeating-conic-gradient(#222 0 25%, #1a1a1a 0 50%) 0 0 / 24px 24px;
  cursor: grab; touch-action: none; user-select: none; outline: none; }
.ycc-stage:focus-visible { box-shadow: 0 0 0 3px #3b82f6; }
.ycc-stage.ycc-dragging { cursor: grabbing; }
.ycc-stage img { position: absolute; left: 0; top: 0; max-width: none; transform-origin: 0 0;
  pointer-events: none; -webkit-user-drag: none; }
.ycc-grid { position: absolute; inset: 0; pointer-events: none;
  background-image: linear-gradient(to right, rgba(255,255,255,.35) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,.35) 1px, transparent 1px);
  background-size: calc(100% / 3) calc(100% / 3); background-position: -1px -1px; }
.ycc-safe { position: absolute; pointer-events: none; border: 1px dashed rgba(255,255,255,.85);
  left: ${((1 - SAFE_W) / 2) * 100}%; top: ${((1 - SAFE_H) / 2) * 100}%;
  width: ${SAFE_W * 100}%; height: ${SAFE_H * 100}%; }
.ycc-controls { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.ycc-controls label { display: flex; align-items: center; gap: 8px; flex: 1 1 260px; }
.ycc-controls input[type=range] { flex: 1; }
.ycc-info { margin: 0; color: #52606d; font-size: 13px; }
.ycc-warn { margin: 0; color: #b45309; font-size: 13px; }
.ycc-footer { display: flex; justify-content: flex-end; gap: 8px; }
.ycc-btn { padding: 8px 14px; border-radius: 6px; border: 1px solid #cbd2d9; background: #fff; color: #1f2933;
  font: inherit; cursor: pointer; }
.ycc-btn:hover { background: #f5f7fa; }
.ycc-btn:disabled { opacity: .55; cursor: default; }
.ycc-btn-primary { background: #2563eb; border-color: #2563eb; color: #fff; }
.ycc-btn-primary:hover { background: #1d4ed8; }
.ycc-field { display: flex; flex-direction: column; gap: 10px; }
.ycc-thumb { width: 100%; max-width: 480px; aspect-ratio: ${OUT_W} / ${OUT_H}; object-fit: cover;
  border-radius: 8px; border: 1px solid rgba(127,127,127,.35); background: rgba(127,127,127,.12); }
.ycc-empty { display: flex; align-items: center; justify-content: center; color: #7b8794; }
.ycc-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.ycc-error { margin: 0; color: #dc2626; }
@media (prefers-color-scheme: dark) {
  .ycc-dialog { background: #1f2430; color: #e4e7eb; }
  .ycc-help, .ycc-info { color: #9aa5b1; }
  .ycc-btn { background: #2a3140; border-color: #3e4c59; color: #e4e7eb; }
  .ycc-btn:hover { background: #323b4c; }
}`;

  const ensureStyle = () => {
    if (document.getElementById("ycc-style")) return;
    const style = document.createElement("style");
    style.id = "ycc-style";
    style.textContent = STYLE;
    document.head.append(style);
  };

  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === "text") node.textContent = value;
      else node.setAttribute(key, value);
    });
    children.forEach((child) => node.append(child));
    return node;
  };

  const loadImage = (blob) =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => resolve({ img, url });
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Görsel açılamadı. Desteklenen biçimler: JPEG, PNG, WebP, AVIF, GIF."));
      };
      img.src = url;
    });

  /**
   * Show the crop dialog for the given image.
   * @param {Blob} blob Source image.
   * @returns {Promise<Blob | null>} 1200 × 630 PNG, or null when cancelled.
   */
  const openCropper = async (blob) => {
    ensureStyle();
    const { img, url } = await loadImage(blob);
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;

    const stage = el("div", {
      class: "ycc-stage",
      tabindex: "0",
      role: "application",
      "aria-label": "Kırpma alanı: sürükleyerek veya ok tuşlarıyla kaydırın, + ve - ile yakınlaştırın",
    });
    img.alt = "";
    img.draggable = false;
    stage.append(img, el("div", { class: "ycc-grid" }), el("div", { class: "ycc-safe" }));

    const zoomInput = el("input", { type: "range", min: "1", max: String(MAX_ZOOM), step: "0.01", value: "1" });
    const fitButton = el("button", { type: "button", class: "ycc-btn", text: "Sığdır" });
    const info = el("p", { class: "ycc-info" });
    const warn = el("p", { class: "ycc-warn", hidden: "" });
    const cancelButton = el("button", { type: "button", class: "ycc-btn", text: "İptal" });
    const saveButton = el("button", { type: "button", class: "ycc-btn ycc-btn-primary", text: "Kırp ve kullan" });

    const dialog = el("dialog", { class: "ycc-dialog", "aria-labelledby": "ycc-title" }, [
      el("div", { class: "ycc-body" }, [
        el("h2", { class: "ycc-title", id: "ycc-title", text: `Kapak görselini kırp (${OUT_W} × ${OUT_H})` }),
        el("p", {
          class: "ycc-help",
          text:
            "Çerçeve kapak alanının tamamıdır. Görseli sürükleyerek konumlandırın, fare tekerleği, " +
            "kaydırıcı ya da iki parmakla yakınlaştırın. Kesikli çizgi güvenli alanı gösterir: " +
            "önemli öğeleri bunun içinde tutun.",
        }),
        stage,
        el("div", { class: "ycc-controls" }, [el("label", { text: "Yakınlaştırma" }, [zoomInput]), fitButton]),
        info,
        warn,
        el("div", { class: "ycc-footer" }, [cancelButton, saveButton]),
      ]),
    ]);

    // State in natural image pixels: the point shown at the centre of the frame, and the zoom.
    let zoom = 1;
    let cx = nw / 2;
    let cy = nh / 2;

    const metrics = () => {
      const sw = stage.clientWidth || 1;
      const sh = stage.clientHeight || 1;
      const scale = Math.max(sw / nw, sh / nh) * zoom;
      return { sw, sh, scale };
    };

    const clampCenter = ({ sw, sh, scale }) => {
      const halfW = sw / scale / 2;
      const halfH = sh / scale / 2;
      cx = Math.min(Math.max(cx, halfW), nw - halfW);
      cy = Math.min(Math.max(cy, halfH), nh - halfH);
    };

    const cropRect = () => {
      const m = metrics();
      clampCenter(m);
      const w = m.sw / m.scale;
      const hgt = m.sh / m.scale;
      return { x: cx - w / 2, y: cy - hgt / 2, w, h: hgt };
    };

    const render = () => {
      const m = metrics();
      clampCenter(m);
      const tx = m.sw / 2 - cx * m.scale;
      const ty = m.sh / 2 - cy * m.scale;
      img.style.width = `${nw}px`;
      img.style.height = `${nh}px`;
      img.style.transform = `translate(${tx}px, ${ty}px) scale(${m.scale})`;
      zoomInput.value = String(zoom);
      const r = cropRect();
      info.textContent =
        `Kaynak: ${nw} × ${nh} px · Seçilen alan: ${Math.round(r.w)} × ${Math.round(r.h)} px · ` +
        `Çıktı: ${OUT_W} × ${OUT_H} WebP (featured.webp)`;
      const upscaled = r.w < OUT_W - 0.5;
      warn.hidden = !upscaled;
      warn.textContent = upscaled
        ? `Seçilen alan ${Math.round(r.w)} px genişliğinde, ${OUT_W} px'e büyütülecek; kapak bulanık görünebilir. ` +
          "Daha az yakınlaştırın ya da daha büyük bir görsel kullanın."
        : "";
    };

    const setZoom = (next, anchorX, anchorY) => {
      const before = metrics();
      const target = Math.min(Math.max(next, 1), MAX_ZOOM);
      // Keep the image point under the anchor (pointer or frame centre) in place.
      const ax = anchorX ?? before.sw / 2;
      const ay = anchorY ?? before.sh / 2;
      const px = cx + (ax - before.sw / 2) / before.scale;
      const py = cy + (ay - before.sh / 2) / before.scale;
      zoom = target;
      const after = metrics();
      cx = px - (ax - after.sw / 2) / after.scale;
      cy = py - (ay - after.sh / 2) / after.scale;
      render();
    };

    const panBy = (dx, dy) => {
      const { scale } = metrics();
      cx -= dx / scale;
      cy -= dy / scale;
      render();
    };

    // Pointer drag and two-finger pinch.
    const pointers = new Map();
    let pinchDistance = 0;
    stage.addEventListener("pointerdown", (event) => {
      stage.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      stage.classList.add("ycc-dragging");
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
      }
    });
    stage.addEventListener("pointermove", (event) => {
      const previous = pointers.get(event.pointerId);
      if (!previous) return;
      const current = { x: event.clientX, y: event.clientY };
      pointers.set(event.pointerId, current);
      if (pointers.size === 1) {
        panBy(current.x - previous.x, current.y - previous.y);
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDistance > 0) {
          const box = stage.getBoundingClientRect();
          setZoom(zoom * (distance / pinchDistance), (a.x + b.x) / 2 - box.left, (a.y + b.y) / 2 - box.top);
        }
        pinchDistance = distance;
      }
    });
    const endPointer = (event) => {
      pointers.delete(event.pointerId);
      pinchDistance = 0;
      if (!pointers.size) stage.classList.remove("ycc-dragging");
    };
    stage.addEventListener("pointerup", endPointer);
    stage.addEventListener("pointercancel", endPointer);
    stage.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        const box = stage.getBoundingClientRect();
        setZoom(zoom * Math.exp(-event.deltaY * 0.0015), event.clientX - box.left, event.clientY - box.top);
      },
      { passive: false },
    );
    stage.addEventListener("keydown", (event) => {
      const step = event.shiftKey ? 40 : 10;
      const moves = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
      if (moves[event.key]) {
        event.preventDefault();
        panBy(...moves[event.key]);
      } else if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        setZoom(zoom * 1.1);
      } else if (event.key === "-") {
        event.preventDefault();
        setZoom(zoom / 1.1);
      }
    });
    zoomInput.addEventListener("input", () => setZoom(Number(zoomInput.value)));
    fitButton.addEventListener("click", () => {
      zoom = 1;
      cx = nw / 2;
      cy = nh / 2;
      render();
    });

    const resizeObserver = new ResizeObserver(() => render());

    return new Promise((resolve) => {
      const close = (result) => {
        resizeObserver.disconnect();
        dialog.close();
        dialog.remove();
        URL.revokeObjectURL(url);
        resolve(result);
      };

      cancelButton.addEventListener("click", () => close(null));
      dialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        close(null);
      });
      saveButton.addEventListener("click", () => {
        saveButton.disabled = true;
        const r = cropRect();
        const canvas = document.createElement("canvas");
        canvas.width = OUT_W;
        canvas.height = OUT_H;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, r.x, r.y, r.w, r.h, 0, 0, OUT_W, OUT_H);
        canvas.toBlob((png) => close(png), "image/png");
      });

      document.body.append(dialog);
      dialog.showModal();
      resizeObserver.observe(stage);
      render();
      stage.focus();
    });
  };

  window.YCCrop = { openCropper, ensureStyle, OUT_W, OUT_H };
})();
