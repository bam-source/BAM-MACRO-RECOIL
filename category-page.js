// ============================================================
// CATEGORY-PAGE.JS — Logic Halaman Project (Shared)
// Data dibaca dari ./data.json di folder project masing-masing.
// Render: hero, info panel, produk, modal produk
// ============================================================

(function () {
  "use strict";

  let currentCategory = null;
  let activeProduct = null;
  let previews = [];
  let previewIndex = 0;

  function productPrice(product) {
    if (!product.price || product.price === "-") return "Info";
    return product.price;
  }

  function openVideoUrl(url) {
    const video = window.BAM.normalizeVideo(url);
    if (video) window.open(video.url, "_blank", "noopener");
  }

  function getProductPreviews(product) {
    const raw = Array.isArray(product.previews)
      ? product.previews
      : (Array.isArray(product.videos) ? product.videos.map(item => ({ type: "video", ...item })) : []);
    return raw.map((item, index) => {
      if (item.type === "image") {
        if (!item.src) return null;
        return { index, type: "image", src: item.src, label: item.label || "Preview" };
      }
      const video = window.BAM.normalizeVideo(item.src);
      if (!video) return null;
      return {
        index,
        type: "video",
        src: item.src,
        label: item.label || "Cek Video",
        video,
        thumbnail: window.BAM.videoThumb(item.src, item.thumbnail || product.image || window.BAM.config.brand.logo)
      };
    }).filter(Boolean);
  }

  // ── HERO ──

  function renderHero(category) {
    const eyebrow = document.getElementById("hero-eyebrow");
    const title = document.getElementById("hero-title");
    const desc = document.getElementById("hero-description");
    const stats = document.getElementById("hero-stats");

    if (eyebrow) eyebrow.textContent = category.hero?.eyebrow || "Kategori";
    if (title) {
      const lines = category.hero?.title || [category.name];
      title.innerHTML = lines.map((line, index) =>
        `<span${index === 1 ? ' class="text-red"' : ""}>${window.BAM.escapeHtml(line)}</span>`
      ).join("");
    }
    if (desc) desc.textContent = category.hero?.description || "";
    if (stats) {
      stats.innerHTML = (category.hero?.stats || []).map(item => {
        const value = item.value === "auto" ? (category.products || []).length : item.value;
        return `
          <div class="hero-stat-card">
            <div class="hero-stat-num">${window.BAM.escapeHtml(value)}</div>
            <div class="hero-stat-label">${window.BAM.escapeHtml(item.label)}</div>
          </div>`;
      }).join("");
    }
  }

  // ── NEWS ──

  function renderNews(news = [], badge = "") {
    const visible = [...news].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
    if (!visible.length) return "";
    return `
      <div class="info-panel">
        <div class="info-panel-header">
          <div class="info-panel-title"><i class="fa-solid fa-newspaper" style="color:var(--red-bright);"></i> Info & Update</div>
          <span class="info-panel-badge">${window.BAM.escapeHtml(badge || `${visible.length} baru`)}</span>
        </div>
        <div class="news-list">
          ${visible.map(item => `
            <div class="news-item">
              <div class="news-dot"></div>
              <div>
                <div class="news-meta">
                  <span>${window.BAM.escapeHtml(item.tag || "Info")}</span>
                  <span>${window.BAM.escapeHtml(item.date || "")}</span>
                  ${item.pinned ? '<i class="fa-solid fa-thumbtack" style="font-size:8px;color:var(--red-bright);"></i>' : ""}
                </div>
                <div class="news-title">${window.BAM.escapeHtml(item.title)}</div>
                <div class="news-desc">${window.BAM.escapeHtml(item.description || "")}</div>
              </div>
            </div>`).join("")}
        </div>
      </div>`;
  }

  // ── VIDEO / MEDIA UPDATE ──
  // Tiap item bisa video ({ src: URL video }) atau gambar
  // ({ type:"image", src: URL atau file lokal }).
  // Video -> buka link; gambar -> lightbox fullscreen.

  function isImageMedia(item) {
    return Boolean(item && item.type === "image");
  }

  function renderVideoPanel(title, videos = []) {
    const visible = videos.map(video => {
      if (isImageMedia(video)) {
        if (!video.src) return null;
        return { type: "image", src: video.src, title: video.title || "Lihat Gambar", description: video.description || "" };
      }
      const source = video.url || video.id || video.normalized?.url;
      const normalized = video.normalized || window.BAM.normalizeVideo(source);
      if (!normalized) return null;
      return {
        ...video, source, normalized,
        thumbnail: video.thumbnail || window.BAM.videoThumb(source, video.image || window.BAM.config.brand.logo)
      };
    }).filter(Boolean);
    if (!visible.length) return "";
    return `
      <div class="info-panel">
        <div class="info-panel-header">
          <div class="info-panel-title"><i class="fa-solid fa-video" style="color:var(--red-bright);"></i> ${window.BAM.escapeHtml(title)}</div>
        </div>
        <div class="video-hscroll">
          ${visible.map(video => {
            if (video.type === "image") {
              return `
                <div class="video-card" data-media-image="${window.BAM.escapeHtml(video.src)}">
                  <div class="video-thumb">
                    <img src="${window.BAM.escapeHtml(video.src)}" alt="${window.BAM.escapeHtml(video.title)}" loading="lazy">
                    <div class="video-play"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
                  </div>
                  <div class="video-body">
                    <strong>${window.BAM.escapeHtml(video.title)}</strong>
                    <span>${window.BAM.escapeHtml(video.description || "Lihat Gambar Sekarang")}</span>
                  </div>
                </div>`;
            }
            return `
              <div class="video-card" data-video-url="${window.BAM.escapeHtml(video.normalized.url)}">
                <div class="video-thumb">
                  <img src="${window.BAM.escapeHtml(video.thumbnail)}" alt="${window.BAM.escapeHtml(video.title)}" loading="lazy">
                  <div class="video-play"><i class="${window.BAM.escapeHtml(video.normalized.icon)}"></i></div>
                </div>
                <div class="video-body">
                  <strong>${window.BAM.escapeHtml(video.title)}</strong>
                  <span>${window.BAM.escapeHtml(video.description || "Cek Video Sekarang")}</span>
                </div>
              </div>`;
          }).join("")}
        </div>
      </div>`;
  }

  // ── JSON LOADER (dukung komentar `//` & `/* */` sebagai pembatas section) ──

  function stripJsonComments(text) {
    let out = "";
    let inString = false;
    let i = 0;
    while (i < text.length) {
      const ch = text[i];
      if (inString) {
        out += ch;
        if (ch === "\\") { out += text[i + 1] || ""; i += 2; continue; }
        if (ch === '"') inString = false;
        i++;
        continue;
      }
      if (ch === '"') { inString = true; out += ch; i++; continue; }
      if (ch === "/" && text[i + 1] === "/") {
        while (i < text.length && text[i] !== "\n") i++;
        continue;
      }
      if (ch === "/" && text[i + 1] === "*") {
        i += 2;
        while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++;
        i += 2;
        continue;
      }
      out += ch;
      i++;
    }
    return out;
  }

  async function loadJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} (${url})`);
    return JSON.parse(stripJsonComments(await res.text()));
  }

  function getConfiguredVideos(list) {
    return (list || []).map(v => {
      if (isImageMedia(v)) {
        if (!v.src) return null;
        return { type: "image", src: v.src, title: v.label || "Lihat Gambar", description: v.description || "" };
      }
      const normalized = window.BAM.normalizeVideo(v.src);
      if (!normalized) return null;
      return {
        normalized,
        thumbnail: window.BAM.videoThumb(v.src, v.thumbnail || window.BAM.config.brand.logo),
        title: v.label || "Cek Video",
        description: v.description || ""
      };
    }).filter(Boolean);
  }

  // ── INFO UPDATE ──

  function renderInfoUpdate(category, videos) {
    const target = document.getElementById("category-info");
    if (!target) return;
    const info = category.infoUpdate || {};
    const list = getConfiguredVideos(videos);
    target.innerHTML = [
      renderNews(info.news, info.badge),
      list.length ? renderVideoPanel("Video Update", list) : ""
    ].join("");
  }

  // ── PRODUK ──

  function renderProducts(category) {
    const target = document.getElementById("product-list");
    if (!target) return;
    const getProductThumb = product => {
      if (category.productThumbnail === "image") return product.image;
      const firstVideo = (product.previews || []).find(item => item.type !== "image") || (product.videos || [])[0];
      return window.BAM.videoThumb(firstVideo?.src, product.image);
    };
    target.innerHTML = (category.products || []).map(product => `
      <button class="product-card" type="button" data-product-id="${window.BAM.escapeHtml(product.id)}">
        <div class="product-media">
          <img src="${getProductThumb(product)}" alt="${window.BAM.escapeHtml(product.name)}" loading="lazy">
          ${product.labelTopLeft ? `<span class="product-label tl">${window.BAM.escapeHtml(product.labelTopLeft)}</span>` : ""}
          ${product.labelBottomRight ? `<span class="product-label br">${window.BAM.escapeHtml(product.labelBottomRight)}</span>` : ""}
        </div>
        <div class="product-body">
          <div class="product-title">${window.BAM.escapeHtml(product.name)}</div>
          <div class="product-subtitle">${window.BAM.escapeHtml(product.subtitle || product.tag || "")}</div>
          <div class="product-tags">
            ${(product.versions || []).slice(0, 2).map(v => {
              const lower = v.toLowerCase();
              let cls = "product-tag";
              if (lower.includes("original") && lower.includes("crack")) cls += " tag-both";
              else if (lower.includes("crack")) cls += " tag-crack";
              else if (lower.includes("original")) cls += " tag-original";
              else cls += " tag-both";
              return `<span class="${cls}">${window.BAM.escapeHtml(v)}</span>`;
            }).join("")}
          </div>
          <div class="product-foot">
            <span class="product-price">${window.BAM.escapeHtml(productPrice(product))}</span>
            <span class="product-link">Detail <i class="fa-solid fa-chevron-right"></i></span>
          </div>
        </div>
      </button>`).join("");
  }

  // ── CTA ──

  function renderCta() {
    window.BAM.renderSocialPills("footer-social-container");
  }

  // ── MODAL ──

  function ensurePreviewLightbox() {
    if (document.getElementById("preview-lightbox")) return;
    const lightbox = document.createElement("div");
    lightbox.id = "preview-lightbox";
    lightbox.className = "preview-lightbox";
    lightbox.innerHTML = `
      <button class="modal-close preview-lightbox-close" type="button" data-preview-lightbox-close aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
      <div id="preview-lightbox-media" class="preview-lightbox-media"></div>`;
    document.body.appendChild(lightbox);
  }

  function renderPreviewStage() {
    const wrap = document.getElementById("preview-stage-wrap");
    if (!wrap) return;
    const item = previews[previewIndex];
    if (!item) {
      wrap.innerHTML = `
        <div class="preview-stage is-empty">
          <i class="fa-solid fa-clapperboard"></i>
          <strong>Preview Tambahan</strong>
          <span>Tersedia melalui admin</span>
        </div>`;
      return;
    }
    let typeBadge = "GAMBAR";
    if (item.type === "video") {
      typeBadge = item.video?.platform ? item.video.platform.toUpperCase() : "VIDEO";
    }

    const media = item.type === "image"
      ? `<img src="${window.BAM.escapeHtml(item.src)}" alt="${window.BAM.escapeHtml(item.label)}" loading="lazy">
         <span class="preview-badge img-center">${window.BAM.escapeHtml(typeBadge)}</span>`
      : item.video?.platform === "youtube"
        ? `<img src="${window.BAM.escapeHtml(item.thumbnail)}" alt="${window.BAM.escapeHtml(item.label)}" loading="lazy">
           <span class="preview-play" data-preview-play>
             <span class="preview-badge">${window.BAM.escapeHtml(typeBadge)}</span>
             <i class="fa-solid fa-circle-play"></i>
           </span>`
        : `<img src="${window.BAM.escapeHtml(item.thumbnail)}" alt="${window.BAM.escapeHtml(item.label)}" loading="lazy">
           <span class="preview-play">
             <span class="preview-badge">${window.BAM.escapeHtml(typeBadge)}</span>
             <i class="fa-solid fa-circle-play"></i>
           </span>`;

    const nav = previews.length > 1
      ? `
        <button class="preview-nav prev" type="button" data-preview-prev aria-label="Sebelumnya"><i class="fa-solid fa-chevron-left"></i></button>
        <button class="preview-nav next" type="button" data-preview-next aria-label="Berikutnya"><i class="fa-solid fa-chevron-right"></i></button>
        <span class="preview-dots">${previews.map((_, index) => `<i${index === previewIndex ? ' class="on"' : ""}></i>`).join("")}</span>
        <span class="preview-kbd"><b>&larr;</b><b>&rarr;</b></span>`
      : "";
    wrap.innerHTML = `
      <div class="preview-stage" data-preview-zoom title="${window.BAM.escapeHtml(item.label)}">
        ${media}
        ${nav}
        <span class="preview-zoom-icon"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
      </div>`;
  }

  function playPreviewVideo() {
    const item = previews[previewIndex];
    if (!item || item.type !== "video" || !item.video?.youtubeId) return;
    const wrap = document.getElementById("preview-stage-wrap");
    if (!wrap) return;
    const stage = wrap.querySelector(".preview-stage");
    if (!stage) return;
    if (stage.querySelector("iframe")) return;
    stage.querySelectorAll("img, .preview-play, .preview-badge.img-center").forEach(node => node.remove());
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${item.video.youtubeId}?autoplay=1&rel=0`;
    iframe.title = window.BAM.escapeHtml(item.label);
    iframe.frameBorder = "0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    stage.appendChild(iframe);
  }

  function openMediaImage(src, alt = "") {
    const lightbox = document.getElementById("preview-lightbox");
    const media = document.getElementById("preview-lightbox-media");
    if (!lightbox || !media) return;
    media.innerHTML = `<img src="${window.BAM.escapeHtml(src)}" alt="${window.BAM.escapeHtml(alt)}">`;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function showPreviewInLightbox(item) {
    if (item.type === "video" && item.video?.platform !== "youtube") {
      closePreviewLightbox();
      window.open(item.video.url, "_blank", "noopener");
      return;
    }
    if (item.type === "image") {
      openMediaImage(item.src, item.label);
      return;
    }
    const lightbox = document.getElementById("preview-lightbox");
    const media = document.getElementById("preview-lightbox-media");
    if (!lightbox || !media) return;
    media.innerHTML = `<iframe src="https://www.youtube.com/embed/${item.video.youtubeId}?autoplay=1&rel=0" title="${window.BAM.escapeHtml(item.label)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function openPreviewFull() {
    const item = previews[previewIndex];
    if (!item) return;
    showPreviewInLightbox(item);
  }

  function closePreviewLightbox() {
    const lightbox = document.getElementById("preview-lightbox");
    if (!lightbox) return;
    lightbox.classList.remove("open");
    const media = document.getElementById("preview-lightbox-media");
    if (media) media.innerHTML = "";
    if (!document.querySelector(".modal-overlay.open")) {
      document.body.style.overflow = "";
    }
  }

  function stepPreview(dir) {
    if (!previews.length) return;
    previewIndex = (previewIndex + dir + previews.length) % previews.length;
    if (document.getElementById("preview-lightbox")?.classList.contains("open")) {
      showPreviewInLightbox(previews[previewIndex]);
    } else {
      renderPreviewStage();
    }
  }

  function openProduct(productId) {
    const product = (currentCategory.products || []).find(item => item.id === productId);
    if (!product) return;
    activeProduct = product;
    const modal = document.getElementById("product-modal");
    const details = product.details?.length ? product.details : [product.description].filter(Boolean);
    const specs = product.specs || [];
    previews = getProductPreviews(product);
    previewIndex = 0;
    modal.innerHTML = `
      <button class="modal-close" type="button" data-close-product><i class="fa-solid fa-xmark"></i></button>
      <div class="product-modal-media">
        <div id="preview-stage-wrap"></div>
      </div>
      <div class="product-modal-content">
        <h2 class="modal-title">${window.BAM.escapeHtml(product.name)}</h2>
        <div class="modal-meta">
          <div class="modal-meta-item">
            <div class="modal-meta-label">Kategori</div>
            <div class="modal-meta-value">${window.BAM.escapeHtml(currentCategory.name)}</div>
          </div>
          <div class="modal-meta-item">
            <div class="modal-meta-label">Harga</div>
            <div class="modal-meta-value modal-price">${window.BAM.escapeHtml(productPrice(product))}</div>
          </div>
          <div class="modal-meta-item">
            <div class="modal-meta-label">Status</div>
            <div class="modal-meta-value">${product.status === "soon" ? "Dalam Proses" : "Aktif"}</div>
          </div>
        </div>
        <ul class="modal-list">
          ${details.map(item => `<li><i class="fa-solid fa-check"></i><span>${window.BAM.escapeHtml(item)}</span></li>`).join("")}
          ${specs.map(item => `<li><i class="fa-solid fa-circle-check"></i><span>${window.BAM.escapeHtml(item)}</span></li>`).join("")}
        </ul>
        <div class="modal-actions">
          <button class="btn-primary" type="button" data-open-contact><i class="fa-solid fa-headset"></i> Kontak Admin</button>
        </div>
      </div>`;
    renderPreviewStage();
    document.getElementById("product-modal-overlay")?.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeProduct() {
    closePreviewLightbox();
    document.getElementById("product-modal-overlay")?.classList.remove("open");
    activeProduct = null;
    if (!document.querySelector(".modal-overlay.open")) {
      document.body.style.overflow = "";
    }
  }

  // ── EVENTS ──

  function bindCategoryEvents() {
    document.addEventListener("click", event => {
      const productCard = event.target.closest("[data-product-id]");
      if (productCard) { openProduct(productCard.dataset.productId); return; }
      if (event.target.closest("[data-close-product]")) { closeProduct(); return; }
      if (event.target.id === "product-modal-overlay") { closeProduct(); return; }
      const video = event.target.closest("[data-video-url]");
      if (video) { openVideoUrl(video.dataset.videoUrl); return; }
      const mediaImage = event.target.closest("[data-media-image]");
      if (mediaImage) { openMediaImage(mediaImage.dataset.mediaImage); return; }
      const previewNext = event.target.closest("[data-preview-next]");
      if (previewNext) { stepPreview(1); return; }
      const previewPrev = event.target.closest("[data-preview-prev]");
      if (previewPrev) { stepPreview(-1); return; }
      if (event.target.closest("[data-preview-play]")) { playPreviewVideo(); return; }
      if (event.target.closest("[data-preview-zoom]")) { openPreviewFull(); return; }
      if (event.target.closest("[data-preview-lightbox-close]")) { closePreviewLightbox(); return; }
      if (event.target.id === "preview-lightbox") { closePreviewLightbox(); return; }
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closePreviewLightbox();
    });
  }

  // ── INIT ──

  async function loadProducts() {
    const manifest = await loadJson("./product.json");
    const entries = Array.isArray(manifest) ? manifest.map(item => item.file || item.id) : (manifest.files || []);
    const items = await Promise.all(entries.map(async entry => {
      const file = typeof entry === "string" ? entry : entry.file;
      if (!file) return null;
      try {
        const product = await loadJson(file);
        // Pre-resolve local image paths relative to the product file
        const productFileDir = file.substring(0, file.lastIndexOf('/'));
        if (product.image && product.image.startsWith('./')) {
          product.image = `${productFileDir}/${product.image.substring(2)}`;
        }
        if (product.previews) {
          product.previews.forEach(preview => {
            if (preview.type === 'image' && preview.src && preview.src.startsWith('./')) {
              preview.src = `${productFileDir}/${preview.src.substring(2)}`;
            }
          });
        }
        return product;
      } catch (err) {
        console.warn(`Gagal memuat produk ${file}:`, err);
        return null;
      }
    }));
    return items.filter(Boolean);
  }

  async function initCategoryPage() {
    const categoryId = document.body.dataset.categoryId;
    window.BAM.initCommon();
    ensurePreviewLightbox();
    try {
      const [data, infoUpdate, products] = await Promise.all([
        loadJson("./data.json"),
        loadJson("./info-update.json"),
        loadProducts()
      ]);
      currentCategory = { id: categoryId, ...data, infoUpdate, products };
      renderHero(currentCategory);
      renderInfoUpdate(currentCategory, infoUpdate.videos || []);
      renderProducts(currentCategory);
      renderCta(currentCategory);
      bindCategoryEvents();
    } catch (err) {
      console.error("Gagal memuat data kategori:", err);
    }
  }

  window.addEventListener("DOMContentLoaded", initCategoryPage);
})();
