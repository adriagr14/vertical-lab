/* ============================================================
   gimnasio.js — Gimnasio & cargas (§4.9)
   - Punto de partida (cargas iniciales del atleta, editable)
   - Registro de cargas por sesión (peso × series × reps × RPE) + 1RM estimado
   - Sugerencias de progresión automáticas, EDITABLES, según el bloque
   - Gráficas de evolución (1RM estimado) por levantamiento

   Config de levantamientos e incrementos = EDITABLE (LIFTS abajo).
   ============================================================ */
window.Sections = window.Sections || {};

/* Levantamientos clave + incremento sugerido (kg). Editable. */
window.LIFTS = [
  { id: "sentadilla",   nombre: "Sentadilla (trasera/frontal)", incremento: 5,   grupo: "Tren inferior" },
  { id: "pm-hex",       nombre: "Peso muerto hexagonal",        incremento: 5,   grupo: "Cadena posterior" },
  { id: "hip-thrust",   nombre: "Hip thrust",                   incremento: 5,   grupo: "Cadena posterior" },
  { id: "bulgaras",     nombre: "Búlgaras (por pierna)",        incremento: 2.5, grupo: "Tren inferior" },
  { id: "rdl",          nombre: "RDL / isquios",                incremento: 2.5, grupo: "Cadena posterior" },
  { id: "press-banca",  nombre: "Press banca",                  incremento: 2.5, grupo: "Tren superior" },
  { id: "press-militar",nombre: "Press militar",                incremento: 2.5, grupo: "Tren superior" },
  { id: "dominadas",    nombre: "Dominadas (lastre)",           incremento: 2.5, grupo: "Tren superior", bw: true },
  { id: "gemelo",       nombre: "Gemelo de pie",                incremento: 5,   grupo: "Tobillo" }
];

/* Punto de partida facilitado por el atleta (junio 2026). Editable luego en la web. */
window.LIFTS_SEED = {
  "sentadilla":   { weight: 65,  reps: 12 },
  "pm-hex":       { weight: 100, reps: 11 },
  "rdl":          { weight: 40,  reps: 15 },
  "press-banca":  { weight: 50,  reps: 10 },
  "press-militar":{ weight: 25,  reps: 10 },
  "dominadas":    { weight: 0,   reps: 6 }
  // hip-thrust, bulgaras, gemelo → sin datos iniciales (los añades cuando quieras)
};

Sections.gimnasio = function (container) {
  const { el, get, set, currentWeek, blockForWeek, epley1RM, fmtDate, todayISO } = VL;
  container.innerHTML = "";

  ensureSeed();

  const week = currentWeek();
  const block = blockForWeek(week) || 1;
  const blockInfo = {
    1: { nombre: "Fuerza máxima", repTop: 6, rpe: 8, modo: "subir" },
    2: { nombre: "Conversión / potencia", repTop: 3, rpe: 8, modo: "mantener" },
    3: { nombre: "Pico / mantenimiento", repTop: 2, rpe: 9, modo: "mantener" }
  }[block];

  // Cabecera
  container.appendChild(el("div", { class: "section-head" }, [
    el("div", { class: "eyebrow", text: "Fuerza & progresión" }),
    el("h1", { text: "Gimnasio & cargas" }),
    el("p", { text: "Registra peso × series × reps × RPE. La web calcula tu 1RM estimado y te propone la progresión (editable) según el bloque." })
  ]));

  // Banner de bloque actual
  container.appendChild(el("div", { class: "card", style: "border-left:3px solid var(--accent)" }, [
    el("div", { class: "flex flex-wrap", style: "gap:8px" }, [
      el("span", { class: "badge b" + block, text: "Bloque " + block }),
      el("span", { class: "badge", text: blockInfo.nombre }),
      el("span", { class: "badge", text: "Reps objetivo ~" + (block === 1 ? "4–6" : block === 2 ? "3" : "1–2") }),
      el("span", { class: "badge", text: "RPE objetivo " + blockInfo.rpe })
    ]),
    el("p", { class: "mt-1 mb-0 dim", style: "font-size:.86rem", text: blockInfo.modo === "subir"
      ? "En fuerza máxima buscamos subir carga progresivamente cuando completas el rango al RPE objetivo."
      : "En conversión/pico la fuerza se MANTIENE (volumen bajo); las sugerencias son conservadoras para priorizar la potencia y la frescura." })
  ]));

  // Sincronizar con Hevy (API) + Importar CSV
  container.appendChild(renderSyncCard());
  container.appendChild(renderImportCard());

  // Levantamientos
  LIFTS.forEach(lift => container.appendChild(renderLift(lift)));

  // Gráficas (canvas ya en DOM)
  LIFTS.forEach(lift => {
    const hist = histOf(lift.id);
    const pts = hist.map(h => ({ x: h.date, y: lift.bw ? h.reps : epley1RM(h.weight, h.reps) })).filter(p => p.y != null);
    if (pts.length < 2) return;
    VLCharts.line("chart-lift-" + lift.id, pts.map(p => fmtDate(p.x)),
      [VLCharts.ds(lift.bw ? "Reps" : "1RM est.", pts.map(p => p.y), VLCharts.C.accent)],
      { plugins: { legend: { display: false } } });
  });

  /* ---------------- helpers ---------------- */
  function ensureSeed() {
    if (get("meta.liftsSeeded")) return;
    VL.suppressTouch(() => {
      const base = get("liftBaseline") || {};
      Object.keys(LIFTS_SEED).forEach(id => {
        if (!base[id]) base[id] = Object.assign({ date: todayISO() }, LIFTS_SEED[id]);
      });
      set("liftBaseline", base);
      set("meta.liftsSeeded", true);
    });
  }
  function histOf(id) { return (get("lifts." + id) || []).slice().sort((a, b) => a.date.localeCompare(b.date)); }
  function baselineOf(id) { return (get("liftBaseline") || {})[id] || null; }

  function liftNombre(id) { const l = LIFTS.find(x => x.id === id); return l ? l.nombre : id; }

  function renderSyncCard() {
    const keyInput = el("input", { type: "password", placeholder: "Pega aquí tu clave API de Hevy", value: get("settings.hevyApiKey") || "",
      onchange: (e) => { set("settings.hevyApiKey", e.target.value.trim()); } });
    const status = el("div", { class: "mt-2", style: "font-size:.85rem" });

    const syncBtn = el("button", { class: "btn btn-primary btn-sm", text: "🔄 Sincronizar ahora", onclick: async () => {
      const key = keyInput.value.trim();
      if (!key) { VL.toast("Pega tu clave API primero"); return; }
      set("settings.hevyApiKey", key);
      syncBtn.disabled = true; syncBtn.textContent = "Sincronizando…";
      status.innerHTML = "";
      status.appendChild(el("div", { class: "dim", id: "syncProg", text: "Conectando con Hevy…" }));
      try {
        const res = await VLHevySync.sync(key, (p, total) => {
          const n = document.getElementById("syncProg"); if (n) n.textContent = `Descargando entrenos… página ${p}/${total}`;
        });
        let msg = `✅ ${res.added} series nuevas` + (res.skipped ? ` · ${res.skipped} ya estaban` : "") + ` · ${res.workouts} entrenos leídos`;
        VL.toast(msg);
        set("settings.hevyLastSync", VL.todayISO());
        Sections.gimnasio(container);
      } catch (err) {
        syncBtn.disabled = false; syncBtn.textContent = "🔄 Sincronizar ahora";
        status.innerHTML = "";
        status.appendChild(el("div", { class: "badge warn", text: "⚠️ " + err.message }));
        console.error(err);
      }
    }});

    const last = get("settings.hevyLastSync");

    return el("div", { class: "card", style: "border:1px solid var(--ok)" }, [
      el("div", { class: "flex-between flex-wrap" }, [
        el("div", { class: "card-title mb-0", html: "🔗 Sincronizar con Hevy (API)" }),
        last ? el("span", { class: "badge ok", text: "Última: " + VL.fmtDate(last) }) : null
      ]),
      el("p", { class: "mt-1 dim", style: "font-size:.86rem", text: "Conexión directa: trae tus entrenos sin exportar nada. Pulsa sincronizar al final de cada semana (solo añade lo nuevo)." }),
      el("label", { class: "field" }, [el("span", { text: "Clave API de Hevy (Ajustes → Desarrollador)" }), keyInput]),
      el("div", { class: "flex flex-wrap", style: "gap:8px" }, [syncBtn]),
      el("small", { class: "muted", style: "display:block;margin-top:8px", text: "🔒 Tu clave se guarda solo en este dispositivo (localStorage), nunca se sube a ningún sitio. Si la web es pública (GitHub Pages), no la compartas con nadie." }),
      status
    ]);
  }

  function renderImportCard() {
    const fileInput = el("input", { type: "file", accept: ".csv,text/csv", style: "display:none" });
    const preview = el("div", { class: "mt-2" });
    let parsedText = null;

    const applyBtn = el("button", { class: "btn btn-primary btn-sm", text: "Aplicar import", disabled: "true", onclick: () => {
      if (!parsedText) return;
      const res = VLHeavyImport.apply(parsedText);
      VL.toast(`✅ ${res.added} series importadas` + (res.skipped ? ` · ${res.skipped} ya estaban` : ""));
      Sections.gimnasio(container);
    }});

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        parsedText = reader.result;
        try {
          const { groups, unmapped, rowsLeidas } = VLHeavyImport.buildEntries(parsedText);
          renderPreview(groups, unmapped, rowsLeidas);
          applyBtn.disabled = false;
        } catch (err) {
          preview.innerHTML = "";
          preview.appendChild(el("div", { class: "badge warn", text: "No se pudo leer el CSV" }));
          console.error(err);
        }
      };
      reader.readAsText(file, "utf-8");
    });

    function renderPreview(groups, unmapped, rowsLeidas) {
      preview.innerHTML = "";
      const liftIds = Object.keys(groups);
      // ¿cuántas son nuevas (no duplicadas)?
      let nuevas = 0, total = 0;
      const detalle = [];
      liftIds.forEach(id => {
        const existingSrc = new Set((get("lifts." + id) || []).map(x => x.src).filter(Boolean));
        const entries = Object.values(groups[id]);
        const news = entries.filter(en => !existingSrc.has(en.src)).length;
        total += entries.length; nuevas += news;
        detalle.push({ id, news, total: entries.length });
      });

      preview.appendChild(el("div", { class: "dim", style: "font-size:.85rem;margin-bottom:6px", text: `Leídas ${rowsLeidas} filas · ${total} sesiones-ejercicio detectadas · ${nuevas} nuevas por añadir` }));
      detalle.filter(d => d.total).forEach(d => {
        preview.appendChild(el("div", { class: "flex-between", style: "font-size:.85rem;padding:3px 0;border-bottom:1px solid var(--border)" }, [
          el("span", { style: "font-weight:600", text: liftNombre(d.id) }),
          el("span", { class: d.news ? "badge ok" : "badge", text: d.news ? "+" + d.news + " nuevas" : "sin novedades" })
        ]));
      });
      if (unmapped.length) {
        preview.appendChild(el("div", { class: "mt-2 muted", style: "font-size:.8rem", text: "Sin mapear (no se importan): " + unmapped.slice(0, 12).join(", ") + (unmapped.length > 12 ? "…" : "") }));
      }
    }

    return el("div", { class: "card", style: "border:1px solid var(--info)" }, [
      el("div", { class: "card-title mb-0", html: "📥 Importar entrenos desde Heavy" }),
      el("p", { class: "mt-1 dim", style: "font-size:.86rem", text: "Exporta tu CSV desde Heavy y súbelo aquí al final de cada semana. Coge la mejor serie de trabajo de cada ejercicio (ignora calentamientos) y solo añade lo nuevo (puedes subir todo el historial sin duplicar)." }),
      el("div", { class: "flex flex-wrap", style: "gap:8px" }, [
        el("button", { class: "btn btn-sm", text: "📂 Elegir CSV…", onclick: () => fileInput.click() }),
        applyBtn, fileInput
      ]),
      preview
    ]);
  }

  function renderLift(lift) {
    const hist = histOf(lift.id);
    const base = baselineOf(lift.id);
    const last = hist.length ? hist[hist.length - 1] : null;

    // Mejor 1RM estimado
    let best1rm = null;
    [base].concat(hist).forEach(e => { if (e && !lift.bw) { const v = epley1RM(e.weight, e.reps); if (v && (!best1rm || v > best1rm)) best1rm = v; } });

    // Inputs de registro
    const wIn = el("input", { type: "number", step: "0.5", placeholder: lift.bw ? "Lastre kg (0=BW)" : "Peso kg" });
    const sIn = el("input", { type: "number", step: "1", placeholder: "Series", value: "3" });
    const rIn = el("input", { type: "number", step: "1", placeholder: "Reps" });
    const rpeIn = el("input", { type: "number", step: "0.5", min: "1", max: "10", placeholder: "RPE" });

    const addBtn = el("button", { class: "btn btn-primary btn-sm", text: "+ Registrar", onclick: () => {
      const weight = wIn.value === "" ? (lift.bw ? 0 : null) : parseFloat(wIn.value);
      const reps = parseInt(rIn.value, 10);
      if ((!lift.bw && weight == null) || !reps) { VL.toast("Pon al menos peso y reps"); return; }
      const arr = get("lifts." + lift.id) || [];
      arr.push({ date: todayISO(), weight: weight || 0, sets: parseInt(sIn.value, 10) || 1, reps, rpe: rpeIn.value ? parseFloat(rpeIn.value) : null });
      set("lifts." + lift.id, arr);
      VL.toast("Serie registrada 💪");
      Sections.gimnasio(container);
    }});

    // Sugerencia de progresión
    const sug = suggest(lift, last, base, block, blockInfo);
    const sugBox = el("div", { class: "card", style: "background:var(--bg-3);border:1px dashed var(--border-2);padding:11px;margin:0 0 10px" }, [
      el("div", { class: "flex-between flex-wrap", style: "gap:8px" }, [
        el("div", {}, [
          el("div", { style: "font-weight:700;font-size:.85rem;color:var(--accent-2)", text: "💡 Sugerencia de progresión" }),
          el("small", { class: "dim", text: sug.msg })
        ]),
        sug.weight != null ? el("div", { class: "flex", style: "gap:6px;flex:0 0 auto" }, [
          el("span", { class: "badge b" + block, text: (lift.bw && sug.weight === 0 ? "BW" : sug.weight + " kg") + (sug.reps ? " × " + sug.reps : "") }),
          el("button", { class: "btn btn-sm", text: "Usar", onclick: () => { wIn.value = sug.weight; if (sug.reps) rIn.value = sug.reps; if (sug.rpeTarget) rpeIn.value = sug.rpeTarget; wIn.focus(); } })
        ]) : null
      ])
    ]);

    // Punto de partida + mejor
    const statRow = el("div", { class: "flex flex-wrap", style: "gap:8px;margin-bottom:8px" }, [
      base ? el("span", { class: "badge", text: "Inicio: " + (lift.bw ? base.reps + " reps" : base.weight + "×" + base.reps + (lift.bw ? "" : "  →  1RM " + epley1RM(base.weight, base.reps) + " kg")) }) : el("span", { class: "badge warn", text: "Sin punto de partida" }),
      (!lift.bw && best1rm) ? el("span", { class: "badge ok", text: "Mejor 1RM est.: " + best1rm + " kg" }) : null
    ]);

    // Historial
    let history = null;
    if (hist.length) {
      const wrap = el("div", { class: "table-wrap mt-2" });
      const table = el("table");
      table.appendChild(el("thead", {}, el("tr", {}, ["Fecha", "Serie", "RPE", lift.bw ? "Reps" : "1RM est."].map(h => el("th", { text: h })))));
      const tb = el("tbody");
      hist.slice().reverse().forEach(h => {
        const realIndex = (get("lifts." + lift.id) || []).indexOf(h);
        tb.appendChild(el("tr", {}, [
          el("td", { text: fmtDate(h.date) }),
          el("td", { text: (lift.bw && !h.weight ? "BW" : h.weight + " kg") + " × " + h.sets + "×" + h.reps }),
          el("td", { text: h.rpe != null ? h.rpe : "—" }),
          el("td", { text: lift.bw ? h.reps : (epley1RM(h.weight, h.reps) + " kg") }),
        ].concat([el("td", {}, el("button", { class: "btn btn-sm btn-ghost", style: "padding:3px 8px", text: "✕",
          onclick: () => { if (confirm("¿Eliminar esta serie?")) { const a = get("lifts." + lift.id) || []; a.splice(realIndex, 1); set("lifts." + lift.id, a); Sections.gimnasio(container); } } }))])));
      });
      table.appendChild(tb);
      wrap.appendChild(table);
      history = wrap;
    }

    const chart = hist.length >= 2 ? el("div", { class: "chart-box mt-2", style: "height:160px" }, el("canvas", { id: "chart-lift-" + lift.id })) : null;

    // Cabecera plegable
    const body = el("div", { class: "mt-2 hidden-body" }, [
      statRow, sugBox,
      el("div", { class: "row" }, [wIn, sIn, rIn, rpeIn]),
      el("div", { class: "mt-1" }, addBtn),
      history, chart
    ]);

    const head = el("div", { class: "flex-between", style: "cursor:pointer;gap:10px", onclick: () => body.classList.toggle("hidden-body") }, [
      el("div", { style: "min-width:0" }, [
        el("div", { style: "font-weight:700", text: lift.nombre }),
        el("small", { class: "muted", text: lift.grupo + (last ? " · última: " + (lift.bw && !last.weight ? "BW" : last.weight + "kg") + "×" + last.reps + (last.rpe ? " @" + last.rpe : "") : "") })
      ]),
      el("span", { class: "muted", text: "▾" })
    ]);

    return el("div", { class: "card" }, [head, body]);
  }

  /* Lógica de sugerencia de progresión (recomendación editable) */
  function suggest(lift, last, base, block, info) {
    const ref = last || (base ? { weight: base.weight, reps: base.reps, rpe: null } : null);
    if (!ref) return { weight: null, msg: "Registra tu primera serie para empezar a progresar." };

    const step = lift.incremento;
    const w = ref.weight || 0;

    // Dominadas (lastre): progresar por reps hasta 10, luego añadir lastre
    if (lift.bw) {
      if (last && last.rpe != null && last.rpe <= info.rpe - 1) {
        if (last.reps >= 10) return { weight: w + step, reps: 5, rpeTarget: info.rpe, msg: `Llegas holgado a ${last.reps} reps: añade ${step} kg de lastre y baja reps.` };
        return { weight: w, reps: last.reps + 1, rpeTarget: info.rpe, msg: `Te sobró margen: intenta 1 rep más (${last.reps + 1}).` };
      }
      return { weight: w, reps: Math.max(ref.reps, 1), rpeTarget: info.rpe, msg: "Consolida estas reps al RPE objetivo antes de subir." };
    }

    // Si no hay RPE registrado aún
    if (!last || last.rpe == null) {
      return { weight: w, reps: info.repTop, rpeTarget: info.rpe, msg: "Registra el RPE de tu serie para afinar la sugerencia. De momento, mantén el peso y apunta al rango de reps del bloque." };
    }

    // Bloque de mantenimiento (2/3): conservador
    if (info.modo === "mantener") {
      if (last.rpe <= info.rpe - 1.5) return { weight: w + step, reps: info.repTop, rpeTarget: info.rpe, msg: `Fácil (RPE ${last.rpe}). Puedes subir ${step} kg, pero sin buscar el fallo: aquí prima la potencia.` };
      return { weight: w, reps: info.repTop, rpeTarget: info.rpe, msg: `Bloque de ${info.nombre.toLowerCase()}: mantén la carga (${w} kg) y mueve rápido. No fuerces 1RM.` };
    }

    // Bloque 1 (fuerza máxima): progresión activa
    if (last.rpe <= info.rpe - 1) {
      return { weight: w + step, reps: info.repTop, rpeTarget: info.rpe, msg: `Te sobró margen (RPE ${last.rpe} < ${info.rpe}). Sube ${step} kg.` };
    }
    if (last.rpe <= info.rpe + 0.5) {
      if (last.reps >= info.repTop) return { weight: w + step, reps: info.repTop, rpeTarget: info.rpe, msg: `Completaste el rango (${last.reps} reps) al RPE objetivo. Sube ${step} kg y vuelve a la parte baja del rango.` };
      return { weight: w, reps: Math.min(last.reps + 1, info.repTop), rpeTarget: info.rpe, msg: `Vas bien: consolida una rep más antes de subir peso.` };
    }
    // RPE demasiado alto
    return { weight: Math.max(w - step, 0), reps: info.repTop, rpeTarget: info.rpe, msg: `Fue muy pesado (RPE ${last.rpe}). Baja ${step} kg o repite el peso hasta que baje el esfuerzo.` };
  }
};
