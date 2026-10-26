(() => {
  const { CMS } = window;
  if (!CMS || typeof CMS.registerEditorComponent !== "function") return;

  // 1. GitHub-style callouts: > [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING], > [!CAUTION]
  CMS.registerEditorComponent({
    id: "callout",
    label: "Uyarı Kutusu (Callout)",
    fields: [
      {
        name: "type",
        label: "Tür",
        widget: "select",
        default: "NOTE",
        options: [
          { label: "Bilgi (NOTE)", value: "NOTE" },
          { label: "İpucu (TIP)", value: "TIP" },
          { label: "Önemli (IMPORTANT)", value: "IMPORTANT" },
          { label: "Uyarı (WARNING)", value: "WARNING" },
          { label: "Dikkat / Tehlike (CAUTION)", value: "CAUTION" },
        ],
      },
      {
        name: "text",
        label: "Metin",
        widget: "markdown",
        default: "Buraya açıklama metnini girin.",
      },
    ],
    pattern: /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n((?:>[^\n]*\n?)+)/m,
    fromBlock: (match) => {
      const type = match[1];
      const rawText = match[2] || "";
      const text = rawText
        .split("\n")
        .map((line) => line.replace(/^>\s?/, ""))
        .join("\n")
        .trim();
      return { type, text };
    },
    toBlock: ({ type, text }) => {
      const alertType = type || "NOTE";
      const lines = (text || "Açıklama").split("\n").map((line) => `> ${line}`);
      return `> [!${alertType}]\n${lines.join("\n")}\n`;
    },
    toPreview: ({ type, text }) => {
      const alertType = type || "NOTE";
      return `<div style="border-left: 4px solid var(--accent, #2563eb); padding: 8px 12px; margin: 12px 0; background: rgba(37,99,235,0.06); border-radius: 4px;">
        <strong style="display:block; margin-bottom:4px; text-transform:uppercase; font-size:12px;">${alertType}</strong>
        <div>${(text || "").replace(/\n/g, "<br>")}</div>
      </div>`;
    },
  });

  // 2. Mermaid Diagram
  CMS.registerEditorComponent({
    id: "mermaid",
    label: "Mermaid Diyagramı",
    fields: [
      {
        name: "code",
        label: "Mermaid Kodu",
        widget: "code",
        default: "graph LR\n    A[Saldırgan] -->|Prompt Injection| B[AI İstemcisi]\n    class A node-danger;\n    class B node-accent;",
      },
    ],
    pattern: /^```mermaid\s*\n([\s\S]*?)\n```$/m,
    fromBlock: (match) => ({ code: match[1]?.trim() ?? "" }),
    toBlock: ({ code }) => `\`\`\`mermaid\n${(code || "").trim()}\n\`\`\`\n`,
    toPreview: ({ code }) => `<pre style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 6px; font-family: monospace;"><code>${code || ""}</code></pre>`,
  });

  // 3. Glass Panel
  CMS.registerEditorComponent({
    id: "glass-panel",
    label: "Bilgi / Kıyaslama Paneli (Glass)",
    fields: [
      {
        name: "content",
        label: "İçerik",
        widget: "markdown",
        default: "Öne çıkarılacak içerik veya kıyaslama tablosu.",
      },
    ],
    pattern: /^<div class="glass-panel reveal-on-scroll">\s*\n([\s\S]*?)\n<\/div>$/m,
    fromBlock: (match) => ({ content: match[1]?.trim() ?? "" }),
    toBlock: ({ content }) => `<div class="glass-panel reveal-on-scroll">\n\n${(content || "").trim()}\n\n</div>\n`,
    toPreview: ({ content }) => `<div style="border: 1px solid rgba(120,120,120,0.3); border-radius: 8px; padding: 14px; background: rgba(255,255,255,0.05);">${content || ""}</div>`,
  });
})();

