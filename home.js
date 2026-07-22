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

  function renderProjectCard(project) {
    const label = project.label || project.name;
    return `
      <a class="project-card" href="${project.path}">
        <div class="project-icon">
          <i class="fa-solid ${project.icon}"></i>
        </div>
        <div class="project-body">
          <div class="project-name">${window.BAM.escapeHtml(label)}</div>
          <div class="project-desc">${window.BAM.escapeHtml(project.description || "")}</div>
        </div>
        <span class="project-arrow"><i class="fa-solid fa-chevron-right"></i></span>
      </a>
    `;
  }

  function renderProjectList(projects) {
    const target = document.getElementById("project-list");
    if (!target) return;
    target.innerHTML = projects
      .filter(p => p.id)
      .map(p => renderProjectCard(p))
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
