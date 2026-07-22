// ============================================================
// COMMON.JS — Fungsi Bersama (Macro Game / Mod Game)
// Berisi: navbar, modal, kontak, events, utility video
// ============================================================

(function () {
  "use strict";

  const config = window.BAM_CONFIG;

  // ============================================================
  // UTILITY — Escape HTML & Video
  // ============================================================

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function hasVideoValue(value) {
    const text = String(value ?? "").trim();
    return Boolean(text && text !== "-");
  }

  function getYoutubeIdFromUrl(url) {
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || "";
    if (host.includes("youtube.com") || host.includes("youtube-nocookie.com")) {
      const queryId = url.searchParams.get("v");
      if (queryId) return queryId;
      const parts = url.pathname.split("/").filter(Boolean);
      const marker = parts.findIndex(part => ["embed", "shorts", "live"].includes(part));
      if (marker >= 0 && parts[marker + 1]) return parts[marker + 1];
    }
    return "";
  }

  function getVideoPlatform(url) {
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be" || host.includes("youtube.com") || host.includes("youtube-nocookie.com")) return "youtube";
    if (host.includes("tiktok.com")) return "tiktok";
    if (host.includes("instagram.com")) return "instagram";
    return "link";
  }

  function videoIcon(platform) {
    if (platform === "youtube") return "fa-brands fa-youtube";
    if (platform === "tiktok") return "fa-brands fa-tiktok";
    if (platform === "instagram") return "fa-brands fa-instagram";
    return "fa-solid fa-play";
  }

  function normalizeVideo(value) {
    if (!hasVideoValue(value)) return null;
    const raw = String(value).trim();
    const withProtocol = raw.startsWith("www.") ? `https://${raw}` : raw;
    const knownHostWithoutProtocol = /^(youtube\.com|youtu\.be|tiktok\.com|instagram\.com)\//i.test(withProtocol);
    const candidate = knownHostWithoutProtocol ? `https://${withProtocol}` : withProtocol;
    if (/^https?:\/\//i.test(candidate)) {
      try {
        const parsed = new URL(candidate);
        if (!["http:", "https:"].includes(parsed.protocol)) return null;
        const platform = getVideoPlatform(parsed);
        const youtubeId = getYoutubeIdFromUrl(parsed);
        return { raw, url: parsed.href, platform, youtubeId, icon: videoIcon(platform) };
      } catch { return null; }
    }
    if (!/^[A-Za-z0-9_-]{6,}$/.test(raw)) return null;
    return {
      raw, url: `https://youtube.com/watch?v=${raw}`,
      platform: "youtube", youtubeId: raw, icon: videoIcon("youtube")
    };
  }

  function isValidVideoId(videoId) { return Boolean(normalizeVideo(videoId)); }

  function videoThumb(source, fallback = "") {
    const video = normalizeVideo(source);
    if (video?.youtubeId) return `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;
    return fallback || config.brand.logo || "";
  }

  function youtubeThumb(videoId, fallback = "") { return videoThumb(videoId, fallback); }

  // ============================================================
  // CATEGORY — Ambil data project dari BAM_CATEGORIES
  // ============================================================

  function getCategory(id) { return window.BAM_CATEGORIES?.[id] || null; }

  // ============================================================
  // NAVBAR — Hanya logo BAM PROJECT (link ke homepage)
  // ============================================================

  function renderNav() {
    const nav = document.getElementById("site-nav");
    if (!nav) return;
    nav.className = "site-nav";
    nav.innerHTML = `
      <div class="nav-inner">
        <a href="/index.html" class="nav-logo" data-close-nav>
          <span class="logo-text">BAM<span>PROJECT</span></span>
        </a>
        <button class="nav-menu-btn" type="button" data-nav-toggle aria-label="Buka menu navigasi">
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>
    `;
  }

  // ============================================================
  // MODAL — Kontak
  // ============================================================

  function renderGlobalModals() {
    const mount = document.getElementById("global-modals");
    if (!mount) return;
    mount.innerHTML = `
      <div id="contact-modal" class="modal-overlay" data-modal-overlay="contact">
        <div class="contact-box">
          <button class="modal-close" type="button" data-close-contact><i class="fa-solid fa-xmark"></i></button>
          <div class="contact-title">Kontak <span class="text-red">Admin</span></div>
          <div class="contact-list" id="contact-list"></div>
        </div>
      </div>
    `;
    renderContactList();
  }

  function renderContactList() {
    const list = document.getElementById("contact-list");
    if (!list) return;
    list.innerHTML = config.socialLinks.map(link => `
      <a class="contact-item" href="${config.social[link.id]}" target="_blank" rel="noopener">
        <i class="fa-brands ${link.icon}" style="color:${link.color};"></i>
        ${escapeHtml(link.label)}
      </a>
    `).join("");
  }

  function openContact() {
    document.getElementById("contact-modal")?.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeContact() {
    document.getElementById("contact-modal")?.classList.remove("open");
    if (!document.querySelector(".modal-overlay.open")) {
      document.body.style.overflow = "";
    }
  }

  // ============================================================
  // SOCIAL PILLS
  // ============================================================

  function renderSocialPills(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    target.innerHTML = config.socialLinks.map(link => `
      <button class="social-pill" type="button" data-social="${link.id}">
        <i class="fa-brands ${link.icon}" style="color:${link.color};"></i>
        <span>${escapeHtml(link.label)}</span>
      </button>
    `).join("");
  }

  function goTo(key) {
    const url = config.social[key];
    if (url) window.open(url, "_blank", "noopener");
  }

  // ============================================================
  // EVENTS
  // ============================================================

  function bindCommonEvents() {
    document.addEventListener("click", event => {
      const toggle = event.target.closest("[data-nav-toggle]");
      if (toggle) {
        document.getElementById("site-nav")?.classList.toggle("nav-open");
        return;
      }
      if (event.target.closest("[data-close-nav]")) {
        document.getElementById("site-nav")?.classList.remove("nav-open");
      }
      if (event.target.closest("[data-open-contact]")) {
        openContact();
        document.getElementById("site-nav")?.classList.remove("nav-open");
        return;
      }
      if (event.target.closest("[data-close-contact]")) {
        closeContact();
        return;
      }
      if (event.target.matches('[data-modal-overlay="contact"]')) {
        closeContact();
        return;
      }
      const social = event.target.closest("[data-social]");
      if (social) {
        goTo(social.dataset.social);
        return;
      }
    });
  }

  // ============================================================
  // INIT
  // ============================================================

  function initCommon() {
    renderNav();
    renderGlobalModals();
    bindCommonEvents();
  }

  // ============================================================
  // PUBLIC API
  // ============================================================

  window.BAM = {
    config,
    escapeHtml,
    isValidVideoId,
    normalizeVideo,
    videoThumb,
    youtubeThumb,
    getCategory,
    renderSocialPills,
    initCommon,
    openContact,
    closeContact,
    goTo
  };
})();
