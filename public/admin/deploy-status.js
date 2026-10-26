// Live deploy status pill for Sveltia CMS
// Queries GitHub Actions for the latest workflow run on ytalharabaci/portfolio
(() => {
  const REPO = "ytalharabaci/portfolio";
  const POLL_IDLE_MS = 60000;
  const POLL_BUSY_MS = 15000;
  let timer = null;

  const getToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem("sveltia-cms.user") ?? "null");
      return user?.token ?? "";
    } catch {
      return "";
    }
  };

  const createBadge = () => {
    if (document.getElementById("yc-deploy-badge")) return document.getElementById("yc-deploy-badge");

    const badge = document.createElement("div");
    badge.id = "yc-deploy-badge";
    badge.style.cssText = `
      position: fixed;
      bottom: 16px;
      right: 16px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: var(--sui-surface-color, #1e293b);
      color: var(--sui-text-color, #f8fafc);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 999px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 12px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      user-select: none;
      transition: all 0.2s ease;
    `;
    badge.title = "GitHub Actions deploy durumunu görmek için tıklayın";
    badge.innerHTML = `<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#94a3b8;"></span><span>Deploy durumu yükleniyor…</span>`;
    document.body.appendChild(badge);
    return badge;
  };

  const formatAgo = (dateStr) => {
    const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diffSec < 60) return "az önce";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} dk önce`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} sa önce`;
    return `${Math.floor(diffHour / 24)} gün önce`;
  };

  const updateStatus = async () => {
    const token = getToken();
    const badge = createBadge();
    if (!token) {
      badge.style.display = "none";
      return;
    }

    badge.style.display = "flex";

    try {
      const response = await fetch(`https://api.github.com/repos/${REPO}/actions/runs?per_page=1`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      });

      if (!response.ok) return;

      const data = await response.json();
      const run = data.workflow_runs?.[0];
      if (!run) return;

      badge.onclick = () => window.open(run.html_url, "_blank", "noopener,noreferrer");

      let nextPoll = POLL_IDLE_MS;

      if (run.status === "in_progress" || run.status === "queued") {
        badge.innerHTML = `
          <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#eab308; box-shadow:0 0 8px #eab308; animation: yc-pulse 1.5s infinite;"></span>
          <span>Deploy ediliyor…</span>
        `;
        badge.title = `Yazı yayına alınıyor: ${run.head_commit?.message || "Build & Deploy"}`;
        nextPoll = POLL_BUSY_MS;
      } else if (run.conclusion === "success") {
        badge.innerHTML = `
          <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10b981; box-shadow:0 0 6px #10b981;"></span>
          <span>Yayında · ${formatAgo(run.updated_at)}</span>
        `;
        badge.title = `Son deploy başarılı (${formatAgo(run.updated_at)}): ${run.head_commit?.message || ""}`;
      } else if (run.conclusion === "failure") {
        badge.innerHTML = `
          <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#ef4444; box-shadow:0 0 6px #ef4444;"></span>
          <span>Deploy Hatası</span>
        `;
        badge.title = `Son deploy başarısız oldu. İncelemek için tıklayın: ${run.html_url}`;
      }

      clearTimeout(timer);
      timer = setTimeout(updateStatus, nextPoll);
    } catch {
      clearTimeout(timer);
      timer = setTimeout(updateStatus, POLL_IDLE_MS);
    }
  };

  // Add keyframe animation for the pulse
  const style = document.createElement("style");
  style.textContent = `
    @keyframes yc-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.2); }
    }
    #yc-deploy-badge:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3) !important;
    }
  `;
  document.head.appendChild(style);

  // Start polling
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", updateStatus);
  } else {
    updateStatus();
  }
})();

