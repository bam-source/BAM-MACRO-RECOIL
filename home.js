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
    // Hero statis — cukup title + tombol
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
  // INIT
  // ============================================================

  async function initHome() {
    // Ambil daftar project dari /projects.json (via common.js)
    const projects = await window.BAM.getCategories();

    // Render komponen
    window.BAM.initCommon("");
    renderHero();
    renderProjectList(projects);
    await window.BAM.renderTestimonials();
  }

  window.addEventListener("DOMContentLoaded", initHome);
})();
