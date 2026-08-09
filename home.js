// ============================================================
// HOME.JS — Logic Khusus Halaman Utama
// Render: hero, project cards, testimoni
// ============================================================

(function () {
  "use strict";

  // ============================================================
  // HERO
  // ============================================================

  function renderHero() {
    const chars = ["0", "1", "0x", "&", "#", "<", ">", "/", "A", "F", "9", "7"];
    const colors = ["var(--yellow)", "var(--coral)", "var(--navy)", "var(--mint)", "var(--black)"];
    const sides = ["hero-deco-left", "hero-deco-right"];
    sides.forEach((id, sideIndex) => {
      const el = document.getElementById(id);
      if (!el) return;
      let html = "";
      for (let i = 0; i < 17; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 18 + Math.floor(Math.random() * 34);
        const top = Math.random() * 95;
        const left = sideIndex === 0 ? Math.random() * 90 : 10 + Math.random() * 90;
        const delay = (Math.random() * 8).toFixed(2);
        const duration = (8 + Math.random() * 6).toFixed(2);
        const opacity = (0.35 + Math.random() * 0.3).toFixed(2);
        html += `<span style="font-size:${size}px;top:${top.toFixed(1)}%;left:${left.toFixed(1)}%;color:${color};opacity:${opacity};animation-delay:${delay}s;animation-duration:${duration}s;">${char}</span>`;
      }
      el.innerHTML = html;
    });
  }

  // ============================================================
  // PROJECT CARDS — Render dari data /projects.json
  // ============================================================

  function renderProjectCard(project, index) {
    const label = project.label || project.name;
    const isLink = Boolean(project.url);
    const badge = project.path === "-" ? "SOON" : "OPEN";
    const href = isLink ? project.url : project.path;
    const target = isLink ? ' target="_blank" rel="noopener"' : "";
    return `
      <a class="project-card" href="${href}"${target}>
        <div class="project-card-top">
          <span class="project-num">${String(index + 1).padStart(2, "0")}</span>
          ${project.image ? `<img class="project-card-img" src="${project.image}" alt="${window.BAM.escapeHtml(label)}" loading="lazy">` : ""}
          <div class="project-icon">
            <i class="fa-solid ${project.icon}"></i>
          </div>
        </div>
        <div class="project-body">
          <div class="project-name">${window.BAM.escapeHtml(label)}</div>
          <div class="project-desc">${window.BAM.escapeHtml(project.description || "")}</div>
        </div>
        <div class="project-foot">
          <span class="project-pill">${badge}</span>
          <span class="project-arrow"><i class="fa-solid fa-arrow-right"></i></span>
        </div>
      </a>
    `;
  }

  function renderProjectList(projects) {
    const target = document.getElementById("project-list");
    if (!target) return;
    target.innerHTML = projects
      .filter(p => p.id)
      .map((p, index) => renderProjectCard(p, index))
      .join("");
  }

  // ============================================================
  // CTA — render tombol & sosial dari config
  // ============================================================

  function renderCTA() {
    const whatsapp = document.getElementById("cta-whatsapp");
    if (whatsapp) {
      const url = window.BAM.config.social?.whatsapp;
      if (url) whatsapp.href = url;
    }
    const container = document.getElementById("cta-socials");
    if (!container) return;
    const links = window.BAM.config.socialLinks || [];
    container.innerHTML = links.map(item => {
      const url = window.BAM.config.social?.[item.id];
      if (!url) return "";
      return `<a class="social-pill" href="${window.BAM.escapeHtml(url)}" target="_blank" rel="noopener" aria-label="${window.BAM.escapeHtml(item.label)}">
        <i class="fa-brands ${item.icon}" style="color:${item.color};"></i> ${window.BAM.escapeHtml(item.label)}
      </a>`;
    }).join("");
  }

  // ============================================================
  // INIT
  // ============================================================

  async function initHome() {
    // Ambil daftar project dari /projects.json (via common.js)
    const projects = await window.BAM.getCategories();

    // Render komponen
    window.BAM.initCommon("");
    renderHero();
    renderProjectList(projects);
    renderCTA();
    await window.BAM.renderTestimonials();
  }

  window.addEventListener("DOMContentLoaded", initHome);
})();
