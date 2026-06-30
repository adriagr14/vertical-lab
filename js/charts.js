/* ============================================================
   charts.js — wrappers ligeros sobre Chart.js
   Si Chart.js no cargó (offline sin CDN), degrada con un aviso.
   ============================================================ */
(function () {
  "use strict";

  const registry = {}; // canvasId -> instancia, para destruir antes de re-render

  function available() { return typeof window.Chart !== "undefined"; }

  function baseOptions(extra = {}) {
    return Object.assign({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#9aa6b9", font: { size: 11 } } },
        tooltip: { backgroundColor: "#1e2533", borderColor: "#323c4f", borderWidth: 1 }
      },
      scales: {
        x: { ticks: { color: "#6b768a", font: { size: 10 } }, grid: { color: "#1b2130" } },
        y: { ticks: { color: "#6b768a", font: { size: 10 } }, grid: { color: "#1b2130" } }
      }
    }, extra);
  }

  // wrap: crea un .chart-box con canvas; si no hay datos o Chart.js, muestra aviso
  function render(canvasId, config, opts = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    if (!available()) {
      const box = canvas.closest(".chart-box") || canvas.parentElement;
      box.innerHTML = '<div class="muted text-c" style="padding:30px 0">📊 Gráfica no disponible sin conexión (Chart.js vía CDN).</div>';
      return;
    }
    if (registry[canvasId]) { registry[canvasId].destroy(); }
    config.options = baseOptions(config.options || {});
    registry[canvasId] = new Chart(canvas.getContext("2d"), config);
    return registry[canvasId];
  }

  function line(canvasId, labels, datasets, options) {
    return render(canvasId, { type: "line", data: { labels, datasets }, options });
  }

  function ds(label, data, color) {
    return {
      label, data,
      borderColor: color, backgroundColor: color + "22",
      tension: .3, pointRadius: 3, pointBackgroundColor: color, borderWidth: 2, fill: true, spanGaps: true
    };
  }

  window.VLCharts = { render, line, ds, baseOptions, available, C: {
    accent: "#ff4d3d", accent2: "#ff7a52", ok: "#34d399", info: "#38bdf8", purple: "#a78bfa", warn: "#fbbf24"
  }};
})();
