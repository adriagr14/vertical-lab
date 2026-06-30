/* datos.js — Export / Import / Reset (§4.7). Ya funcional en el esqueleto. */
window.Sections = window.Sections || {};
Sections.datos = function (container) {
  const { el } = VL;
  container.innerHTML = "";
  container.appendChild(el("div", { class: "section-head" }, [
    el("div", { class: "eyebrow", text: "Tus datos, tuyos" }),
    el("h1", { text: "Datos" }),
    el("p", { text: "Todo se guarda en este dispositivo (localStorage). Exporta un respaldo en JSON para no perderlo." })
  ]));

  // Export
  container.appendChild(el("div", { class: "card" }, [
    el("div", { class: "card-title", html: "⬇️ Exportar respaldo" }),
    el("p", { text: "Descarga un archivo JSON con todos tus registros (sesiones, tests, cargas, peso)." }),
    el("button", { class: "btn btn-primary", text: "Exportar JSON", onclick: () => { VL.exportJSON(); VL.toast("Respaldo descargado"); } })
  ]));

  // Import
  const fileInput = el("input", { type: "file", accept: "application/json", style: "display:none", onchange: handleFile });
  container.appendChild(el("div", { class: "card" }, [
    el("div", { class: "card-title", html: "⬆️ Importar respaldo" }),
    el("p", { text: "Restaura tus datos desde un archivo exportado. Sustituye los datos actuales." }),
    el("button", { class: "btn", text: "Seleccionar archivo…", onclick: () => fileInput.click() }),
    fileInput
  ]));

  // Reset
  container.appendChild(el("div", { class: "card" }, [
    el("div", { class: "card-title", html: "🗑️ Borrar todo" }),
    el("p", { text: "Elimina todos los registros de este dispositivo. No se puede deshacer." }),
    el("button", {
      class: "btn btn-ghost", text: "Borrar todos mis datos",
      onclick: () => { if (confirm("¿Seguro? Se borrarán todos tus registros.")) { VL.reset(); VL.toast("Datos borrados"); window.App.render("dashboard"); window.App.go("dashboard"); } }
    })
  ]));

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { VL.importJSON(reader.result); VL.toast("✅ Datos importados"); window.App.render("dashboard"); window.App.go("dashboard"); }
      catch (err) { VL.toast("❌ Archivo no válido"); console.error(err); }
    };
    reader.readAsText(file);
  }
};
