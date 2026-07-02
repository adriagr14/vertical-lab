/* ============================================================
   progreso.js — Registro y progreso (§4.7)
   Resumen de adherencia, gráficas (salto, 1RM, peso) e historial de sesiones.
   ============================================================ */
window.Sections = window.Sections || {};

Sections.progreso = function (container) {
  const { el, get, epley1RM, fmtDate } = VL;
  container.innerHTML = "";

  container.appendChild(el("div", { class: "section-head" }, [
    el("div", { class: "eyebrow", text: "Tu evolución" }),
    el("h1", { text: "Registro y progreso" }),
    el("p", { text: "Adherencia, gráficas de salto, 1RM estimado y peso corporal, e historial de sesiones." })
  ]));

  /* ---------- Resumen / adherencia ---------- */
  const sessions = get("sessions") || {};
  const doneList = Object.keys(sessions).filter(k => sessions[k] && sessions[k].done);
  const totalSesiones = 40; // 8 sem × 5
  const adher = Math.round((doneList.length / totalSesiones) * 100);

  const cmjRecs = recs("cmj");
  const bestCmj = cmjRecs.length ? Math.max(...cmjRecs.map(r => r.vals.marca)) : null;
  const reach = lastVal("alcance");
  const aroBest = bestAro();
  const RIM = get("settings.rimHeightCm", 305);
  const deficit = (reach != null && aroBest != null) ? Math.round((RIM - (reach + aroBest)) * 10) / 10 : null;

  // Extras (entrenamientos opcionales)
  const extras = get("extras") || {};
  const extrasAll = Object.keys(extras).reduce((acc, k) => acc.concat((extras[k] || []).map(e => Object.assign({ semana: k.replace("w", "") }, e))), []);
  const extrasDone = extrasAll.filter(e => e.done);

  const grid = el("div", { class: "grid grid-3" });
  grid.appendChild(stat("Sesiones hechas", doneList.length + " / " + totalSesiones, adher + "% adherencia", "accent"));
  grid.appendChild(stat("Mejor CMJ", bestCmj != null ? bestCmj + " cm" : "—", "salto con contramovimiento", ""));
  grid.appendChild(stat("Déficit a aro", deficit != null ? (deficit <= 0 ? "¡Llegas!" : deficit + " cm") : "—", "objetivo: 0", deficit != null && deficit <= 0 ? "ok" : ""));
  grid.appendChild(stat("Extras completados", extrasDone.length + (extrasAll.length ? " / " + extrasAll.length : ""), "partidos, carrera, gym extra…", ""));
  container.appendChild(grid);

  /* ---------- Gráficas ---------- */
  container.appendChild(el("div", { class: "card" }, [
    el("div", { class: "card-title", html: "📈 Salto vertical" }),
    chartBoxOrEmpty("chart-prog-salto", cmjRecs.length || recs("saltoCarrera2").length)
  ]));

  container.appendChild(el("div", { class: "card" }, [
    el("div", { class: "card-title", html: "🏋️ 1RM estimado (levantamientos clave)" }),
    chartBoxOrEmpty("chart-prog-1rm", hasLiftData())
  ]));

  container.appendChild(el("div", { class: "card" }, [
    el("div", { class: "card-title", html: "⚖️ Peso corporal" }),
    chartBoxOrEmpty("chart-prog-bw", recs("bw").length)
  ]));

  /* ---------- Historial de sesiones ---------- */
  const histCard = el("div", { class: "card" });
  histCard.appendChild(el("div", { class: "card-title", html: "🗓️ Historial de sesiones completadas" }));
  if (!doneList.length) {
    histCard.appendChild(el("p", { class: "muted mb-0", text: "Aún no has marcado ninguna sesión como hecha. Hazlo desde el Plan." }));
  } else {
    const rows = doneList.map(k => {
      const m = k.match(/^w(\d+)d(\d+)$/); if (!m) return null;
      const wn = +m[1], di = +m[2];
      const wk = PLAN.semanas.find(w => w.n === wn);
      const dia = wk ? wk.dias[di] : null;
      const rec = sessions[k];
      return { wn, di, nombre: dia ? dia.nombre : k, diaNombre: dia ? dia.dia : "", date: rec.date || "", rpe: rec.rpe, note: rec.note };
    }).filter(Boolean).sort((a, b) => (b.date || "").localeCompare(a.date || "") || b.wn - a.wn);

    const wrap = el("div", { class: "table-wrap" });
    const table = el("table");
    table.appendChild(el("thead", {}, el("tr", {}, ["Fecha", "Sem", "Sesión", "RPE", "Nota"].map(h => el("th", { text: h })))));
    const tb = el("tbody");
    rows.forEach(r => tb.appendChild(el("tr", {}, [
      el("td", { text: r.date ? fmtDate(r.date) : "—" }),
      el("td", {}, el("span", { class: "badge", text: "S" + r.wn })),
      el("td", {}, [el("div", { style: "font-weight:600;font-size:.88rem", text: r.nombre }), el("small", { class: "muted", text: r.diaNombre })]),
      el("td", { text: r.rpe != null ? r.rpe : "—" }),
      el("td", { class: "dim", style: "font-size:.85rem", text: r.note || "—" })
    ])));
    table.appendChild(tb);
    wrap.appendChild(table);
    histCard.appendChild(wrap);
  }
  container.appendChild(histCard);

  // Extras completados (entrenamientos opcionales)
  if (extrasDone.length) {
    const ICONOS = { partido: "🏀", carrera: "🏃", gym: "🏋️", movilidad: "🧘", otro: "➕" };
    const exCard = el("div", { class: "card" });
    exCard.appendChild(el("div", { class: "card-title", html: "➕ Extras completados" }));
    const wrap = el("div", { class: "table-wrap" });
    const table = el("table");
    table.appendChild(el("thead", {}, el("tr", {}, ["Fecha", "Sem", "Entrenamiento"].map(h => el("th", { text: h })))));
    const tb = el("tbody");
    extrasDone.slice().sort((a, b) => (b.date || "").localeCompare(a.date || "")).forEach(e => {
      tb.appendChild(el("tr", {}, [
        el("td", { text: e.date ? fmtDate(e.date) : "—" }),
        el("td", {}, el("span", { class: "badge", text: "S" + e.semana })),
        el("td", { style: "font-weight:600;font-size:.88rem", text: (ICONOS[e.tipo] || "➕") + " " + (e.nombre || e.tipo) })
      ]));
    });
    table.appendChild(tb);
    wrap.appendChild(table);
    exCard.appendChild(wrap);
    container.appendChild(exCard);
  }

  // Export rápido
  container.appendChild(el("div", { class: "card text-c" }, [
    el("p", { class: "dim mb-0", style: "font-size:.86rem", text: "Exporta o restaura todos tus datos desde la sección Datos. Las sesiones de fuerza se copian a Heavy desde el Plan." }),
    el("div", { class: "flex", style: "gap:8px;justify-content:center;margin-top:8px" }, [
      el("button", { class: "btn btn-sm", text: "💾 Ir a Datos", onclick: () => window.App.go("datos") }),
      el("button", { class: "btn btn-sm", text: "📋 Ir al Plan", onclick: () => window.App.go("plan") })
    ])
  ]));

  /* ---------- pintar gráficas ---------- */
  // Salto
  (function () {
    const cmj = recs("cmj"), sc2 = recs("saltoCarrera2");
    if (!cmj.length && !sc2.length) return;
    const labels = mergeDates([cmj, sc2]);
    const ds = [];
    if (cmj.length) ds.push(VLCharts.ds("CMJ", alignToDates(cmj, labels), VLCharts.C.accent));
    if (sc2.length) ds.push(VLCharts.ds("Salto carrera 2 pies", alignToDates(sc2, labels), VLCharts.C.info));
    VLCharts.line("chart-prog-salto", labels.map(fmtDate), ds);
  })();
  // 1RM
  (function () {
    const lifts = [["sentadilla", VLCharts.C.accent], ["pm-hex", VLCharts.C.info], ["hip-thrust", VLCharts.C.purple]];
    const series = lifts.map(([id, color]) => ({ id, color, data: liftSeries(id) })).filter(s => s.data.length);
    if (!series.length) return;
    const labels = mergeDatesRaw(series.map(s => s.data));
    const ds = series.map(s => VLCharts.ds(liftName(s.id), alignRawToDates(s.data, labels), s.color));
    VLCharts.line("chart-prog-1rm", labels.map(fmtDate), ds);
  })();
  // Peso
  (function () {
    const bw = recs("bw");
    if (bw.length < 1) return;
    VLCharts.line("chart-prog-bw", bw.map(r => fmtDate(r.date)), [VLCharts.ds("Peso (kg)", bw.map(r => r.vals.marca), VLCharts.C.ok)], { plugins: { legend: { display: false } } });
  })();

  /* ---------- helpers ---------- */
  function recs(id) { return (get("tests." + id) || []).slice().sort((a, b) => a.date.localeCompare(b.date)); }
  function lastVal(id) { const r = recs(id); return r.length ? r[r.length - 1].vals.marca : null; }
  function bestAro() {
    let b = null;
    ["cmj", "saltoCarrera2", "saltoCarrera1"].forEach(id => { const r = recs(id); r.forEach(x => { if (x.vals.marca != null && (b == null || x.vals.marca > b)) b = x.vals.marca; }); });
    return b;
  }
  function liftHist(id) { return (get("lifts." + id) || []).slice().sort((a, b) => a.date.localeCompare(b.date)); }
  function liftSeries(id) {
    const base = (get("liftBaseline") || {})[id];
    const arr = [];
    if (base) { const v = epley1RM(base.weight, base.reps); if (v) arr.push({ date: base.date || "2026-01-01", y: v }); }
    liftHist(id).forEach(h => { const v = epley1RM(h.weight, h.reps); if (v) arr.push({ date: h.date, y: v }); });
    return arr;
  }
  function hasLiftData() { return ["sentadilla", "pm-hex", "hip-thrust"].some(id => liftSeries(id).length); }
  function liftName(id) { const l = (window.LIFTS || []).find(x => x.id === id); return l ? l.nombre : id; }

  function mergeDates(arrs) { const s = new Set(); arrs.forEach(a => a.forEach(r => s.add(r.date))); return [...s].sort(); }
  function alignToDates(arr, dates) { const m = {}; arr.forEach(r => m[r.date] = r.vals.marca); return dates.map(d => m[d] != null ? m[d] : null); }
  function mergeDatesRaw(arrs) { const s = new Set(); arrs.forEach(a => a.forEach(p => s.add(p.date))); return [...s].sort(); }
  function alignRawToDates(arr, dates) { const m = {}; arr.forEach(p => m[p.date] = p.y); return dates.map(d => m[d] != null ? m[d] : null); }

  function stat(label, value, sub, cls) {
    return el("div", { class: "stat " + cls }, [
      el("div", { class: "label", text: label }),
      el("div", { class: "value", style: "font-size:1.6rem", text: value }),
      el("div", { class: "sub", text: sub })
    ]);
  }
  function chartBoxOrEmpty(id, has) {
    return has ? el("div", { class: "chart-box" }, el("canvas", { id })) : el("p", { class: "muted mb-0", text: "Registra datos en Tests / Gimnasio para ver esta gráfica." });
  }
};
