/* datos.js — Export / Import / Reset (§4.7). Ya funcional en el esqueleto. */
window.Sections = window.Sections || {};
Sections.datos = function (container) {
  const { el } = VL;
  container.innerHTML = "";
  container.appendChild(el("div", { class: "section-head" }, [
    el("div", { class: "eyebrow", text: "Tus datos, tuyos" }),
    el("h1", { text: "Datos" }),
    el("p", { text: "Sincroniza entre dispositivos con la nube, o guarda un respaldo manual en JSON." })
  ]));

  // Sincronización en la nube (Supabase)
  container.appendChild(renderCloudCard());

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

  function renderCloudCard() {
    const urlIn = el("input", { type: "text", placeholder: "https://xxxx.supabase.co", value: VL.get("settings.supabaseUrl") || "" });
    const keyIn = el("input", { type: "password", placeholder: "anon public key", value: VL.get("settings.supabaseKey") || "" });
    const codeIn = el("input", { type: "text", placeholder: "Tu código de sync (secreto, igual en todos los dispositivos)", value: VL.get("settings.syncCode") || "" });
    const autoChk = el("input", { type: "checkbox" });
    if (VL.get("settings.cloudAuto")) autoChk.checked = true;

    const status = el("div", { class: "mt-2", style: "font-size:.85rem" });
    const last = VL.get("settings.cloudLastSync");
    if (VLCloud.configured()) status.appendChild(el("span", { class: "badge ok", text: last ? "Sincronizado: " + new Date(last).toLocaleString("es-ES") : "Configurado" }));
    else status.appendChild(el("span", { class: "badge", text: "Sin configurar" }));

    function saveCfg() {
      VLCloud.setLocalOnly("supabaseUrl", urlIn.value.trim());
      VLCloud.setLocalOnly("supabaseKey", keyIn.value.trim());
      VLCloud.setLocalOnly("syncCode", codeIn.value.trim());
      VLCloud.setLocalOnly("cloudAuto", autoChk.checked);
    }

    const syncBtn = el("button", { class: "btn btn-primary btn-sm", text: "💾 Guardar y sincronizar", onclick: async () => {
      saveCfg();
      if (!VLCloud.configured()) { VL.toast("Rellena URL, clave y código"); return; }
      syncBtn.disabled = true; const prev = syncBtn.textContent; syncBtn.textContent = "Sincronizando…";
      try {
        const res = await VLCloud.sync();
        VL.toast(res.action === "pulled" ? "⬇️ Datos traídos de la nube" : res.action === "pushed" ? "⬆️ Datos subidos" : "✅ Ya estaba al día");
        if (res.action === "pulled") { window.App.render("dashboard"); }
        Sections.datos(container);
      } catch (err) {
        syncBtn.disabled = false; syncBtn.textContent = prev;
        status.innerHTML = ""; status.appendChild(el("div", { class: "badge warn", text: "⚠️ " + err.message }));
      }
    }});

    // Guía de configuración (plegable)
    const guide = el("div", { class: "hidden-body mt-2", style: "font-size:.84rem" }, [
      el("p", { class: "dim", text: "Una sola vez (gratis):" }),
      el("ol", { style: "padding-left:18px;margin:0;color:var(--text-dim)" }, [
        el("li", {}, [el("span", { text: "Crea un proyecto en " }), el("a", { href: "https://supabase.com", target: "_blank", rel: "noopener", style: "color:var(--accent-2)", text: "supabase.com" }), el("span", { text: " (gratis)." })]),
        el("li", { html: "En <b>SQL Editor</b>, ejecuta esto:" }),
        el("li", {}, el("pre", { style: "white-space:pre-wrap;background:var(--bg-3);padding:8px;border-radius:8px;font-size:.78rem", text: "create table vl_state (\n  id text primary key,\n  data jsonb,\n  updated_at int8\n);\nalter table vl_state disable row level security;\ngrant all on table vl_state to anon;" })),
        el("li", { html: "En <b>Project Settings → API</b>: copia <b>Project URL</b> y la <b>anon public key</b> aquí arriba." }),
        el("li", { html: "Inventa un <b>código de sync</b> largo (p. ej. <code>adria-salto-9f3k2</code>) y pon el MISMO en cada dispositivo." }),
        el("li", { text: "Marca 'Sincronizar automáticamente' y pulsa Guardar. ¡Listo!" })
      ]),
      el("p", { class: "muted", style: "margin-top:6px", text: "Privacidad: tus datos de entrenamiento (no sensibles) van a tu proyecto. La clave de Hevy NO se sincroniza, se queda en cada dispositivo." })
    ]);

    return el("div", { class: "card", style: "border:1px solid var(--info)" }, [
      el("div", { class: "card-title mb-0", html: "☁️ Sincronizar entre dispositivos" }),
      el("p", { class: "mt-1 dim", style: "font-size:.86rem", text: "Comparte tus datos (tests, sesiones, peso, notas) entre PC y móvil. La parte de gimnasio ya se sincroniza desde Hevy." }),
      el("label", { class: "field" }, [el("span", { text: "Supabase Project URL" }), urlIn]),
      el("label", { class: "field" }, [el("span", { text: "Supabase anon key" }), keyIn]),
      el("label", { class: "field" }, [el("span", { text: "Código de sync (tu secreto)" }), codeIn]),
      el("label", { class: "flex", style: "gap:8px;align-items:center;cursor:pointer" }, [autoChk, el("span", { text: "Sincronizar automáticamente al abrir y al cambiar" })]),
      el("div", { class: "flex flex-wrap mt-2", style: "gap:8px" }, [
        syncBtn,
        el("button", { class: "btn btn-sm btn-ghost", text: "¿Cómo se configura?", onclick: () => guide.classList.toggle("hidden-body") })
      ]),
      status, guide
    ]);
  }

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
