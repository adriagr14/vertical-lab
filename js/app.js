/* ============================================================
   app.js — router de secciones + navegación móvil
   Debe cargarse el ÚLTIMO (depende de window.Sections).
   ============================================================ */
(function () {
  "use strict";

  const SECTIONS = ["dashboard", "plan", "tests", "gimnasio", "ejercicios", "baloncesto", "guias", "progreso", "datos"];
  const TITLES = {
    dashboard: "Inicio", plan: "Plan", tests: "Tests", gimnasio: "Gimnasio",
    ejercicios: "Ejercicios", baloncesto: "Baloncesto", guias: "Guías", progreso: "Progreso", datos: "Datos"
  };

  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("backdrop");
  const menuToggle = document.getElementById("menuToggle");
  const topbarContext = document.getElementById("topbarContext");
  const weekBadge = document.getElementById("weekBadge");

  let current = null;

  function openMenu() { sidebar.classList.add("open"); backdrop.classList.add("show"); }
  function closeMenu() { sidebar.classList.remove("open"); backdrop.classList.remove("show"); }

  // Renderiza (o re-renderiza) el contenido de una sección
  function render(name) {
    const container = document.getElementById("section-" + name);
    if (container && typeof Sections[name] === "function") {
      try { Sections[name](container); }
      catch (e) { container.innerHTML = '<div class="card">⚠️ Error al renderizar esta sección.</div>'; console.error(e); }
    }
  }

  // Navega a una sección (la muestra)
  function go(name) {
    if (!SECTIONS.includes(name)) name = "dashboard";
    current = name;

    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    const target = document.getElementById("section-" + name);
    if (target) target.classList.add("active");

    document.querySelectorAll(".nav-link").forEach(a => {
      a.classList.toggle("active", a.dataset.section === name);
    });

    render(name);
    updateContext();
    if (location.hash !== "#" + name) history.replaceState(null, "", "#" + name);
    closeMenu();
    document.getElementById("main").scrollTo?.(0, 0);
    window.scrollTo(0, 0);
  }

  function updateContext() {
    const week = VL.currentWeek();
    const block = VL.blockForWeek(week);
    if (week) {
      weekBadge.textContent = `Semana ${week} · B${block}`;
      topbarContext.textContent = `Sem ${week} · ${TITLES[current] || ""}`;
    } else {
      weekBadge.textContent = "Plan sin iniciar";
      topbarContext.textContent = TITLES[current] || "";
    }
  }

  function init() {
    VL.load();

    // Navegación
    document.querySelectorAll(".nav-link").forEach(a => {
      a.addEventListener("click", (e) => { e.preventDefault(); go(a.dataset.section); });
    });
    menuToggle.addEventListener("click", () => sidebar.classList.contains("open") ? closeMenu() : openMenu());
    backdrop.addEventListener("click", closeMenu);
    window.addEventListener("hashchange", () => {
      const name = location.hash.replace("#", "");
      if (name && name !== current) go(name);
    });

    // Sección inicial desde el hash o dashboard
    const initial = location.hash.replace("#", "");
    go(SECTIONS.includes(initial) ? initial : "dashboard");

    // Sincronización al abrir: primero la nube (datos entre dispositivos),
    // después Hevy (entrenos nuevos, máx. 1 vez/día) — en cadena para evitar carreras.
    try {
      Promise.resolve(window.VLCloud && VLCloud.init && VLCloud.init())
        .then(() => { if (window.VLHevySync && VLHevySync.autoSync) return VLHevySync.autoSync(); })
        .catch(e => console.warn(e));
    } catch (e) { console.warn(e); }
  }

  window.App = { go, render, updateContext, current: () => current };
  document.addEventListener("DOMContentLoaded", init);
})();
