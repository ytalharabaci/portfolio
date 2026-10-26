// Sveltia CMS custom field type `cover-image`: pick or upload an image, crop it in a dialog to the
// 1200 × 630 cover size (1.91:1, the Open Graph card size), and store it next to the post as
// featured.webp. The crop is handed to the CMS as a lossless PNG, so the media library's
// `transformations` (WebP, quality 85) encode it exactly once; `replace` overwrites the previous
// featured.webp instead of creating featured-1.webp.
// The crop dialog itself lives in crop.js, loaded before this file.
// Docs: https://sveltiacms.app/en/docs/api/field-types
(() => {
  const { CMS } = window;
  if (!CMS) return;

  const { createElement: h, useEffect, useRef, useState } = CMS.React;

  const { openCropper, ensureStyle } = window.YCCrop ?? {};
  if (!openCropper) return;
  const OUTPUT_NAME = "featured.png"; // becomes featured.webp through the WebP transformation

  const assetUrl = (getAsset, value) => {
    if (!value || typeof getAsset !== "function") return "";
    const asset = getAsset(value);
    return asset?.url ?? (typeof asset?.toString === "function" ? asset.toString() : "") ?? "";
  };

  const CoverControl = (props) => {
    const { value, onChange, addFile, pickFile, getAsset, forID, classNameWrapper } = props;
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const fileInput = useRef(null);
    const src = assetUrl(getAsset, value);

    useEffect(ensureStyle, []);

    const cropAndStore = async (blob) => {
      setError("");
      setBusy(true);
      try {
        const png = await openCropper(blob);
        if (!png) return;
        const url = await addFile(png, { name: OUTPUT_NAME, replace: true });
        onChange(url);
      } catch (err) {
        setError(err?.message ?? String(err));
      } finally {
        setBusy(false);
      }
    };

    const fromComputer = (event) => {
      const [file] = event.target.files ?? [];
      event.target.value = "";
      if (file) cropAndStore(file);
    };

    const fromLibrary = async () => {
      setError("");
      try {
        const picked = await pickFile({ kind: "image", allowURL: false });
        if (!picked) return;
        if (!picked.file) {
          setError("Seçilen görsel okunamadı.");
          return;
        }
        await cropAndStore(picked.file);
      } catch (err) {
        setError(err?.message ?? String(err));
      }
    };

    const recrop = async () => {
      if (!src) return;
      try {
        const response = await fetch(src);
        await cropAndStore(await response.blob());
      } catch (err) {
        setError(`Mevcut görsel yüklenemedi: ${err?.message ?? err}`);
      }
    };

    return h("div", { className: `ycc-field ${classNameWrapper ?? ""}` }, [
      src
        ? h("img", { key: "thumb", className: "ycc-thumb", src, alt: "Kapak görseli önizlemesi" })
        : h("div", { key: "empty", className: "ycc-thumb ycc-empty" }, "Kapak görseli yok"),
      h("div", { key: "actions", className: "ycc-actions" }, [
        h(
          "button",
          { key: "upload", id: forID, type: "button", className: "ycc-btn ycc-btn-primary", disabled: busy, onClick: () => fileInput.current?.click() },
          "Bilgisayardan yükle ve kırp",
        ),
        h("button", { key: "pick", type: "button", className: "ycc-btn", disabled: busy, onClick: fromLibrary }, "Kütüphaneden seç ve kırp"),
        src && h("button", { key: "recrop", type: "button", className: "ycc-btn", disabled: busy, onClick: recrop }, "Yeniden kırp"),
        value && h("button", { key: "remove", type: "button", className: "ycc-btn", disabled: busy, onClick: () => onChange("") }, "Kaldır"),
      ]),
      h("input", { key: "file", ref: fileInput, type: "file", accept: "image/*", hidden: true, onChange: fromComputer }),
      error && h("p", { key: "error", className: "ycc-error", role: "alert" }, error),
    ]);
  };

  const CoverPreview = ({ value, getAsset }) => {
    const src = assetUrl(getAsset, value);
    return src ? h("img", { src, alt: "", style: { width: "100%", maxWidth: "600px", borderRadius: "8px" } }) : null;
  };

  CMS.registerFieldType("cover-image", CoverControl, CoverPreview);
})();
