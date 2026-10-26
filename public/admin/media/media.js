// Görseller: post images folder by folder (content/<slug>/), next to Sveltia CMS.
// It signs in with the token Sveltia keeps in this origin's localStorage and works through the
// GitHub API: uploads are converted to WebP (max 1200 px wide, quality 0.85) in the browser, and
// every upload or delete is a single commit made with the Git Data API, so the site deploys once.
(() => {
  const CONTENT_DIR = "content";
  const PAGE_FOLDERS = new Set(["about", "projects"]);
  const IMAGE_RE = /\.(webp|png|jpe?g|gif|avif|svg)$/i;
  const MAX_WIDTH = 1200;
  const QUALITY = 0.85;
  const COVER_NAME = "featured.webp";
  const API = "https://api.github.com";

  const statusBox = document.querySelector(".status");
  const view = document.querySelector(".view");
  const crumbs = document.querySelector(".crumbs");
  const searchInput = document.querySelector(".search");

  const state = {
    token: "",
    repo: "",
    branch: "main",
    posts: new Map(), // slug -> { slug, files: Map(name -> { path, sha, size }), meta, mdText }
    thumbs: new Map(), // blob sha -> object URL
    selected: new Set(),
    busy: false,
  };

  // ---------- small helpers ----------

  const el = (tag, props = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([key, value]) => {
      if (value === undefined || value === null || value === false) return;
      if (key === "class") node.className = value;
      else if (key === "text") node.textContent = value;
      else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
      else node.setAttribute(key, value === true ? "" : value);
    });
    [].concat(children).forEach((child) => child && node.append(child));
    return node;
  };

  const setStatus = (message, kind = "") => {
    statusBox.replaceChildren(message ? el("span", { class: kind, text: message }) : "");
  };

  const kb = (bytes) => `${Math.max(1, Math.round(bytes / 1024))} KB`;

  /** Lowercase ASCII words joined by hyphens; Turkish dotted/dotless i and accents are folded. */
  const normalizeWords = (text) =>
    text
      .replace(/ı/g, "i")
      .replace(/İ/g, "i")
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const slugifyName = (name) => normalizeWords(name.replace(/\.[^.]+$/, "")) || "gorsel";

  const parseFrontmatter = (text) => {
    const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const front = match ? match[1] : "";
    const get = (key) => {
      const m = front.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
      return m ? m[1].trim().replace(/^(['"])(.*)\1$/, "$2") : "";
    };
    return { title: get("title"), date: get("date"), draft: get("draft") === "true", type: get("type"), image: get("image") };
  };

  const toBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });

  const decodeImage = (blob) =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`${blob.name ?? "Görsel"} açılamadı (desteklenen: JPEG, PNG, WebP, AVIF, GIF).`));
      };
      img.src = url;
    });

  /** Convert a raster image to WebP, at most MAX_WIDTH wide. GIF and SVG are kept as they are. */
  const toWebp = async (blob) => {
    if (/^image\/(gif|svg\+xml)$/.test(blob.type)) {
      return { blob, ext: blob.type === "image/gif" ? "gif" : "svg" };
    }
    const img = await decodeImage(blob);
    const scale = Math.min(1, MAX_WIDTH / img.naturalWidth);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const webp = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", QUALITY));
    if (!webp || webp.type !== "image/webp") {
      throw new Error("Bu tarayıcı WebP üretemiyor. Chrome, Edge veya Firefox kullanın.");
    }
    return { blob: webp, ext: "webp", width: canvas.width, height: canvas.height };
  };

  // ---------- GitHub API ----------

  const gh = async (path, { method = "GET", body, raw = false } = {}) => {
    const response = await fetch(`${API}${path}`, {
      method,
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${state.token}`,
        Accept: raw ? "application/vnd.github.raw+json" : "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      const error = new Error(
        response.status === 401
          ? "Oturum geçersiz. Panelden çıkış yapıp token ile yeniden giriş yapın."
          : `GitHub ${response.status}: ${detail.message ?? response.statusText}`,
      );
      error.status = response.status;
      throw error;
    }
    if (raw) return response.blob();
    return response.status === 204 ? null : response.json();
  };

  const readBlob = (sha) => gh(`/repos/${state.repo}/git/blobs/${sha}`, { raw: true });

  /**
   * Apply file changes in one commit on the configured branch.
   * @param {{ path: string, blob?: Blob, remove?: boolean }[]} changes
   * @param {string} message
   */
  const commitChanges = async (changes, message) => {
    const blobs = new Map();
    for (const change of changes) {
      if (change.remove) continue;
      const created = await gh(`/repos/${state.repo}/git/blobs`, {
        method: "POST",
        body: { content: await toBase64(change.blob), encoding: "base64" },
      });
      blobs.set(change.path, created.sha);
    }
    // Retry once if the branch moved between reading and updating it (e.g. a CMS save).
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const ref = await gh(`/repos/${state.repo}/git/ref/heads/${state.branch}`);
      const head = await gh(`/repos/${state.repo}/git/commits/${ref.object.sha}`);
      const tree = await gh(`/repos/${state.repo}/git/trees`, {
        method: "POST",
        body: {
          base_tree: head.tree.sha,
          tree: changes.map((change) => ({
            path: change.path,
            mode: "100644",
            type: "blob",
            sha: change.remove ? null : blobs.get(change.path),
          })),
        },
      });
      const commit = await gh(`/repos/${state.repo}/git/commits`, {
        method: "POST",
        body: { message, tree: tree.sha, parents: [ref.object.sha] },
      });
      try {
        await gh(`/repos/${state.repo}/git/refs/heads/${state.branch}`, { method: "PATCH", body: { sha: commit.sha } });
        return commit;
      } catch (error) {
        if (error.status !== 422 || attempt === 1) throw error;
      }
    }
    return null;
  };

  // ---------- data loading ----------

  const loadTree = async () => {
    const data = await gh(`/repos/${state.repo}/git/trees/${state.branch}?recursive=1`);
    if (data.truncated) setStatus("Uyarı: depo ağacı çok büyük, liste eksik olabilir.", "error");
    const posts = new Map();
    data.tree.forEach((item) => {
      if (item.type !== "blob" || !item.path.startsWith(`${CONTENT_DIR}/`)) return;
      const parts = item.path.slice(CONTENT_DIR.length + 1).split("/");
      if (parts.length !== 2 || PAGE_FOLDERS.has(parts[0])) return;
      const [slug, name] = parts;
      if (!posts.has(slug)) {
        const previous = state.posts.get(slug);
        posts.set(slug, { slug, files: new Map(), meta: previous?.meta, metaSha: previous?.metaSha, mdText: previous?.mdText ?? {} });
      }
      posts.get(slug).files.set(name, { path: item.path, sha: item.sha, size: item.size ?? 0 });
    });
    state.posts = posts;
  };

  /** Read title, date, type, draft and cover from index.tr.md (or index.en.md) for each post. */
  const loadMeta = async (slugs) => {
    const queue = [...slugs];
    const worker = async () => {
      while (queue.length) {
        const post = state.posts.get(queue.shift());
        const md = post.files.get("index.tr.md") ?? post.files.get("index.en.md");
        if (!md || post.metaSha === md.sha) continue;
        const text = await (await readBlob(md.sha)).text();
        post.meta = parseFrontmatter(text);
        post.metaSha = md.sha;
      }
    };
    await Promise.all(Array.from({ length: 6 }, worker));
  };

  /** Load both Markdown files of a post, to tell which images are referenced. */
  const loadPostText = async (post) => {
    await Promise.all(
      ["index.tr.md", "index.en.md"].map(async (name) => {
        const file = post.files.get(name);
        if (!file || post.mdText[name]?.sha === file.sha) return;
        post.mdText[name] = { sha: file.sha, text: await (await readBlob(file.sha)).text() };
      }),
    );
  };

  const isUsed = (post, name) => Object.values(post.mdText).some(({ text }) => text.includes(name));

  const imagesOf = (post) =>
    [...post.files.entries()]
      .filter(([name]) => IMAGE_RE.test(name))
      .sort(([a], [b]) => (a === COVER_NAME ? -1 : b === COVER_NAME ? 1 : a.localeCompare(b)));

  // ---------- thumbnails (private repo: fetched through the API) ----------

  const thumbObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(async ({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        thumbObserver.unobserve(target);
        const { sha } = target.dataset;
        try {
          if (!state.thumbs.has(sha)) state.thumbs.set(sha, URL.createObjectURL(await readBlob(sha)));
          target.src = state.thumbs.get(sha);
        } catch {
          target.alt = "Önizleme yüklenemedi";
        }
      });
    },
    { rootMargin: "200px" },
  );

  const thumb = (sha, className, alt = "") => {
    const img = el("img", { class: className, alt, "data-sha": sha, loading: "lazy" });
    if (state.thumbs.has(sha)) img.src = state.thumbs.get(sha);
    else thumbObserver.observe(img);
    return img;
  };

  // ---------- views ----------

  const renderCrumbs = (post) => {
    crumbs.replaceChildren(
      post
        ? el("span", {}, [el("a", { href: "#/", text: "Görseller" }), " / ", el("span", { text: post.meta?.title || post.slug })])
        : el("span", { text: "Görseller: yazı klasörleri" }),
    );
  };

  const renderList = () => {
    renderCrumbs(null);
    searchInput.hidden = false;
    // Every word must appear in the slug (hyphens read as spaces) or the title; case, Turkish
    // dotted/dotless i and accents are ignored, so "threat hunting" finds threat-hunting-… folders.
    const tokens = normalizeWords(searchInput.value).split("-").filter(Boolean);
    const posts = [...state.posts.values()]
      .filter((post) => {
        const haystack = normalizeWords(`${post.slug} ${post.meta?.title ?? ""}`);
        return tokens.every((token) => haystack.includes(token));
      })
      .sort((a, b) => (b.meta?.date ?? "").localeCompare(a.meta?.date ?? ""));

    const cards = posts.map((post) => {
      const images = imagesOf(post);
      const cover = post.files.get(COVER_NAME);
      const { meta = {} } = post;
      return el("article", { class: "card" }, [
        el("a", { class: "folder-link", href: `#/${encodeURIComponent(post.slug)}` }, [
          cover ? thumb(cover.sha, "thumb", "") : el("div", { class: "thumb" }),
          el("div", { class: "card-body" }, [
            el("h2", { class: "card-title", text: meta.title || post.slug }),
            el("div", { class: "meta", text: `${post.slug} · ${images.length} görsel` }),
            el("div", { class: "badges" }, [
              el("span", { class: "badge", text: meta.type === "writeups" ? "Write-up" : "Blog" }),
              meta.draft && el("span", { class: "badge draft", text: "Taslak" }),
              !cover && el("span", { class: "badge unused", text: "Kapak yok" }),
            ]),
          ]),
        ]),
      ]);
    });

    view.replaceChildren(
      el("p", { class: "hint", text: "Her kart bir yazının klasörüdür (content/<yazı>/). Görselleri görmek, yüklemek veya silmek için klasörü açın." }),
      cards.length ? el("div", { class: "grid" }, cards) : el("p", { class: "empty", text: "Eşleşen yazı yok." }),
    );
  };

  const renderFolder = async (slug) => {
    const post = state.posts.get(slug);
    if (!post) {
      window.location.hash = "#/";
      return;
    }
    searchInput.hidden = true;
    renderCrumbs(post);
    state.selected.clear();
    view.replaceChildren(el("p", { class: "empty", text: "Yükleniyor…" }));
    await loadPostText(post);

    const fileInput = el("input", { type: "file", accept: "image/*", multiple: true, hidden: true, onchange: (event) => {
      const files = [...event.target.files];
      event.target.value = "";
      uploadImages(post, files);
    } });
    const coverInput = el("input", { type: "file", accept: "image/*", hidden: true, onchange: async (event) => {
      const [file] = event.target.files;
      event.target.value = "";
      if (file) cropCover(post, file);
    } });

    const deleteButton = el("button", { class: "btn danger", type: "button", disabled: true, text: "Seçilenleri sil", onclick: () => deleteImages(post) });
    const updateSelection = () => {
      deleteButton.disabled = state.busy || state.selected.size === 0;
      deleteButton.textContent = state.selected.size ? `Seçilenleri sil (${state.selected.size})` : "Seçilenleri sil";
    };

    const dropzone = el("div", { class: "dropzone", text: "Görselleri buraya sürükleyip bırakın: WebP'ye çevrilir, en fazla 1200 px genişliğe küçültülür." });
    dropzone.addEventListener("dragover", (event) => { event.preventDefault(); dropzone.classList.add("over"); });
    dropzone.addEventListener("dragleave", () => dropzone.classList.remove("over"));
    dropzone.addEventListener("drop", (event) => {
      event.preventDefault();
      dropzone.classList.remove("over");
      const files = [...event.dataTransfer.files].filter((file) => file.type.startsWith("image/"));
      if (files.length) uploadImages(post, files);
    });

    const cover = post.files.get(COVER_NAME);
    const coverValue = post.meta?.image;
    const notes = [];
    if (!cover) notes.push("Bu yazının kapak görseli (featured.webp) yok.");
    else if (coverValue && coverValue !== COVER_NAME) notes.push(`Yazının kapak alanı "${coverValue}" gösteriyor; buradaki featured.webp kullanılmıyor olabilir.`);
    else if (!coverValue) notes.push("featured.webp var ama yazının kapak alanı boş. Yazıda Kapak görseli alanından seçin.");

    const findRemoteImages = (p) => {
      const list = [];
      const seen = new Set();
      const re = /!\[([^\]]*)\]\((https?:\/\/[^\s\)]+)\)/g;
      for (const [, { text }] of Object.entries(p.mdText ?? {})) {
        let m;
        while ((m = re.exec(text)) !== null) {
          const url = m[2];
          if (!seen.has(url)) {
            seen.add(url);
            list.push({ url, alt: m[1] });
          }
        }
      }
      return list;
    };
    const remoteImages = findRemoteImages(post);
    if (remoteImages.length) {
      notes.push(`Bu yazıda ${remoteImages.length} adet dış kaynaklı görsel tespit edildi. Aşağıdaki butona tıklayarak hepsini tek tıkla yazı klasörüne indirip WebP yapabilirsiniz.`);
    }

    const cards = imagesOf(post).map(([name, file]) => {
      const used = name === COVER_NAME ? coverValue === COVER_NAME : isUsed(post, name);
      // blog-publishing-procedure.md asks for descriptive alt text; the placeholder is meant to be replaced.
      const markdown = `![Görselin kısa açıklaması](${name})`;
      const checkbox = el("input", { class: "select-box", type: "checkbox", "aria-label": `${name} seç`, onchange: (event) => {
        if (event.target.checked) state.selected.add(name);
        else state.selected.delete(name);
        card.classList.toggle("selected", event.target.checked);
        updateSelection();
      } });
      const card = el("article", { class: "card" }, [
        checkbox,
        thumb(file.sha, "thumb img-thumb", name),
        el("div", { class: "card-body" }, [
          el("h3", { class: "card-title", text: name }),
          el("div", { class: "meta", text: kb(file.size) }),
          el("div", { class: "badges" }, [
            name === COVER_NAME && el("span", { class: "badge cover", text: "Kapak" }),
            !used && el("span", { class: "badge unused", text: "Yazıda kullanılmıyor" }),
          ]),
          el("div", { class: "card-actions" }, [
            name !== COVER_NAME &&
              el("button", { class: "btn", type: "button", text: "Markdown kopyala", onclick: async () => {
                await navigator.clipboard.writeText(markdown);
                setStatus(`Kopyalandı: ${markdown}`, "ok");
              } }),
            el("button", { class: "btn", type: "button", text: name === COVER_NAME ? "Yeniden kırp" : "Kapak yap", onclick: async () => {
              cropCover(post, await readBlob(file.sha));
            } }),
          ]),
        ]),
      ]);
      return card;
    });

    view.replaceChildren(
      el("div", { class: "toolbar" }, [
        el("button", { class: "btn primary", type: "button", text: "Görsel yükle", onclick: () => fileInput.click() }),
        el("button", { class: "btn", type: "button", text: cover ? "Kapağı değiştir (kırp)" : "Kapak yükle (kırp)", onclick: () => coverInput.click() }),
        remoteImages.length > 0 &&
          el("button", {
            class: "btn highlight",
            type: "button",
            text: `📥 Dış görselleri içe aktar (${remoteImages.length})`,
            onclick: () => importRemoteImages(post, remoteImages),
          }),
        el("span", { class: "spacer" }),
        deleteButton,
        fileInput,
        coverInput,
      ]),
      ...notes.map((text) => el("p", { class: "note warn", text })),
      dropzone,
      cards.length ? el("div", { class: "grid" }, cards) : el("p", { class: "empty", text: "Bu klasörde görsel yok." }),
    );
  };

  const render = () => {
    const slug = decodeURIComponent(window.location.hash.replace(/^#\/?/, ""));
    if (slug) renderFolder(slug);
    else renderList();
  };

  // ---------- actions ----------

  const withBusy = async (label, task) => {
    if (state.busy) return;
    state.busy = true;
    document.querySelectorAll(".view .btn").forEach((button) => { button.disabled = true; });
    try {
      await task();
    } catch (error) {
      setStatus(`${label} başarısız: ${error.message}`, "error");
    } finally {
      state.busy = false;
      try {
        await refresh();
      } catch (error) {
        setStatus(`Liste yenilenemedi: ${error.message}`, "error");
      }
    }
  };

  const refresh = async () => {
    await loadTree();
    await loadMeta([...state.posts.keys()]);
    render();
  };

  const uniqueName = (post, base, ext, taken) => {
    let name = `${base}.${ext}`;
    for (let i = 2; post.files.has(name) || taken.has(name); i += 1) name = `${base}-${i}.${ext}`;
    taken.add(name);
    return name;
  };

  const uploadImages = (post, files) =>
    withBusy("Yükleme", async () => {
      const taken = new Set();
      const changes = [];
      for (const [index, file] of files.entries()) {
        setStatus(`${index + 1}/${files.length} hazırlanıyor: ${file.name}`);
        const converted = await toWebp(file);
        const name = uniqueName(post, slugifyName(file.name), converted.ext, taken);
        changes.push({ path: `${CONTENT_DIR}/${post.slug}/${name}`, blob: converted.blob, name });
      }
      setStatus(`GitHub'a gönderiliyor (${changes.length} görsel)…`);
      const first = changes[0].path;
      await commitChanges(changes, `content: upload ${first}${changes.length > 1 ? ` +${changes.length - 1}` : ""}`);
      setStatus(`Yüklendi: ${changes.map((c) => c.name).join(", ")}. Site birkaç dakika içinde güncellenir.`, "ok");
    });

  const cropCover = (post, blob) =>
    withBusy("Kapak", async () => {
      const png = await window.YCCrop.openCropper(blob);
      if (!png) {
        setStatus("");
        return;
      }
      setStatus("Kapak hazırlanıyor…");
      const { blob: webp } = await toWebp(png);
      const path = `${CONTENT_DIR}/${post.slug}/${COVER_NAME}`;
      await commitChanges([{ path, blob: webp }], `content: ${post.files.has(COVER_NAME) ? "update" : "upload"} ${path}`);
      state.thumbs.delete(post.files.get(COVER_NAME)?.sha);
      setStatus(`Kapak kaydedildi (${COVER_NAME}, 1200 × 630, ${kb(webp.size)}). Site birkaç dakika içinde güncellenir.`, "ok");
    });

  const importRemoteImages = (post, remoteImages) =>
    withBusy("Dış görselleri aktarma", async () => {
      setStatus(`${remoteImages.length} adet dış görsel indiriliyor…`);
      const taken = new Set(post.files.keys());
      const changes = [];
      const replacements = new Map();

      let i = 1;
      for (const item of remoteImages) {
        setStatus(`İndiriliyor (${i}/${remoteImages.length}): ${item.url.slice(0, 50)}…`);
        try {
          const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(item.url)}`;
          const res = await fetch(proxyUrl);
          if (!res.ok) {
            console.warn("Görsel indirilemedi:", item.url, res.status);
            continue;
          }
          const rawBlob = await res.blob();
          const converted = await toWebp(rawBlob);

          const urlObj = new URL(item.url);
          const rawPath = urlObj.pathname.split("/").pop() || "";
          const baseFromUrl = rawPath.replace(/\.[^.]+$/, "");
          const baseName = slugifyName(item.alt || baseFromUrl) || `gorsel-${i}`;
          const localName = uniqueName(post, baseName, converted.ext, taken);

          changes.push({ path: `${CONTENT_DIR}/${post.slug}/${localName}`, blob: converted.blob });
          replacements.set(item.url, localName);
        } catch (err) {
          console.warn("Dönüştürme hatası:", item.url, err);
        }
        i++;
      }

      if (!replacements.size) {
        throw new Error("Dış görseller indirilemedi (erişim engeli veya geçersiz link).");
      }

      for (const [filename, fileObj] of Object.entries(post.mdText)) {
        let updated = fileObj.text;
        for (const [url, localName] of replacements.entries()) {
          const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          updated = updated.replace(new RegExp(`(!\\[[^\\]]*\\])\\(${escaped}\\)`, "g"), `$1(./${localName})`);
        }
        if (updated !== fileObj.text) {
          changes.push({
            path: `${CONTENT_DIR}/${post.slug}/${filename}`,
            blob: new Blob([updated], { type: "text/markdown;charset=utf-8" }),
          });
        }
      }

      setStatus(`GitHub'a kaydediliyor (${replacements.size} görsel + güncel yazılar)…`);
      await commitChanges(changes, `content: import ${replacements.size} remote images for ${post.slug}`);
      setStatus(`Başarıyla ${replacements.size} dış görsel indirildi, WebP yapıldı ve yazıya bağlandı.`, "ok");
    });

  const deleteImages = (post) => {
    const names = [...state.selected];
    if (!names.length) return;
    const used = names.filter((name) => (name === COVER_NAME ? post.meta?.image === COVER_NAME : isUsed(post, name)));
    const question = used.length
      ? `${used.join(", ")} yazıda kullanılıyor; silinirse sayfada kırık görsel olur.\n\n${names.length} görseli yine de silmek istiyor musunuz?`
      : `${names.length} görsel silinsin mi?\n\n${names.join("\n")}`;
    if (!window.confirm(question)) return undefined;
    return withBusy("Silme", async () => {
      setStatus("Siliniyor…");
      const changes = names.map((name) => ({ path: `${CONTENT_DIR}/${post.slug}/${name}`, remove: true }));
      await commitChanges(changes, `content: delete ${changes[0].path}${changes.length > 1 ? ` +${changes.length - 1}` : ""}`);
      setStatus(`Silindi: ${names.join(", ")}.`, "ok");
    });
  };

  // ---------- start ----------

  const start = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("sveltia-cms.user") ?? "null");
      state.token = user?.token ?? "";
    } catch {
      state.token = "";
    }
    if (!state.token) {
      view.replaceChildren(
        el("p", { class: "empty" }, ["Önce ", el("a", { href: "/admin/", text: "panelde" }), " token ile giriş yapın, sonra bu sayfayı yenileyin."]),
      );
      return;
    }
    const config = await (await fetch("/admin/config.yml", { cache: "no-store" })).text();
    state.repo = config.match(/^\s*repo:\s*(\S+)/m)?.[1] ?? "";
    state.branch = config.match(/^\s*branch:\s*(\S+)/m)?.[1] ?? "main";
    view.replaceChildren(el("p", { class: "empty", text: "Yazı klasörleri yükleniyor…" }));
    try {
      await refresh();
    } catch (error) {
      view.replaceChildren(el("p", { class: "empty" }, [el("span", { class: "error", text: error.message })]));
    }
  };

  window.addEventListener("hashchange", render);
  searchInput.addEventListener("input", () => renderList());
  start();
})();
