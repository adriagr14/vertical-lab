/* ============================================================
   tests.js — Batería de tests (§4.3 / §6)
   Registro con fecha + fase (base/control/retest), métricas derivadas
   automáticas (déficit aro, ratio CMJ–SJ, RSI, fuerza/peso) y gráficas.
   Modelo: db.tests[testId] = [ { date, fase, note, vals:{key:num} } ]
   ============================================================ */
window.Sections = window.Sections || {};

Sections.tests = function (container) {
  const { el, get, set, todayISO, fmtDate } = VL;
  container.innerHTML = "";

  const RIM = get("settings.rimHeightCm", 305);

  /* ---------- helpers de lectura ---------- */
  function records(id) { return (get("tests." + id) || []).slice().sort((a, b) => a.date.localeCompare(b.date)); }
  function latest(id, key = "marca") {
    const r = records(id);
    for (let i = r.length - 1; i >= 0; i--) if (r[i].vals && r[i].vals[key] != null) return r[i].vals[key];
    return null;
  }
  function best(id, key = "marca", dir = "alto") {
    const vals = records(id).map(r => r.vals && r.vals[key]).filter(v => v != null);
    if (!vals.length) return null;
    return dir === "bajo" ? Math.min(...vals) : Math.max(...vals);
  }
  function rsiOf(rec) {
    if (!rec || !rec.vals) return null;
    const h = rec.vals.altura, c = rec.vals.contacto;
    if (h == null || !c) return null;
    return Math.round(((h / 100) / (c / 1000)) * 100) / 100; // m / s
  }

  /* ---------- métricas derivadas globales ---------- */
  const reach = latest("alcance");
  const aroTests = TESTS.filter(t => t.aro);
  let bestAro = null;
  aroTests.forEach(t => {
    const v = best(t.id, "marca", "alto");
    if (v != null && (!bestAro || v > bestAro.jump)) bestAro = { jump: v, nombre: t.nombre };
  });
  // Déficit unificado: toque directo en pista o alcance + mejor salto (el mayor)
  const da = VL.deficitAro();
  const deficit = da ? da.deficit : null;

  const cmj = latest("cmj"), sj = latest("sj");
  const eur = (cmj && sj) ? Math.round((cmj / sj) * 100) / 100 : null;
  const diffCmjSj = (cmj && sj) ? Math.round((cmj - sj) * 10) / 10 : null;

  const djRecs = records("dropJump");
  const rsi = djRecs.length ? rsiOf(djRecs[djRecs.length - 1]) : null;

  const sq = latest("sq1rm"), bw = latest("bw");
  const fpeso = (sq && bw) ? Math.round((sq / bw) * 100) / 100 : null;

  /* ---------- cabecera ---------- */
  container.appendChild(el("div", { class: "section-head" }, [
    el("div", { class: "eyebrow", text: "Medir para progresar" }),
    el("h1", { text: "Tests de rendimiento" }),
    el("p", { text: "Línea base (pre sem. 1) · control (sem. 4, opcional) · retest (sem. 8). Registra con fecha y la web calcula tus métricas derivadas." })
  ]));

  /* ---------- panel de métricas derivadas ---------- */
  const metrics = el("div", { class: "grid grid-2" });

  // Déficit aro (destacado)
  metrics.appendChild(el("div", { class: "card", style: "grid-column:1/-1;border-left:3px solid var(--accent)" }, [
    el("div", { class: "flex-between flex-wrap" }, [
      el("div", {}, [
        el("div", { class: "label", style: "font-size:.76rem;color:var(--text-mute);text-transform:uppercase;letter-spacing:.05em", text: "Déficit hasta el aro" }),
        deficit != null
          ? el("div", { class: "value", style: "font-size:2rem;font-weight:800;color:" + (deficit <= 0 ? "var(--ok)" : "var(--accent-2)") , html: (deficit <= 0 ? "¡Llegas! +" + Math.abs(deficit) : deficit) + ' <span class="unit" style="font-size:1rem;color:var(--text-dim)">cm</span>' })
          : el("div", { class: "value muted", style: "font-size:1.1rem", text: "Registra alcance + un salto al aro" })
      ]),
      el("div", { class: "text-c" }, [
        el("small", { class: "muted", text: "Aro" }),
        el("div", { style: "font-weight:700", text: RIM + " cm" }),
        el("button", { class: "btn btn-sm btn-ghost mt-1", text: "Editar", onclick: editRim })
      ])
    ]),
    deficit != null
      ? el("small", { class: "muted", text: `Mejor registro: ${da.mejorTotal} cm (${da.base}) · aro ${RIM} cm` })
      : el("small", { class: "muted", text: "Se calcula con tu toque directo en pista o con alcance de pie + salto (el mejor de los dos)." })
  ]));

  metrics.appendChild(deriv("Ratio CMJ–SJ (uso del SSC)", eur != null ? eur : "—",
    diffCmjSj != null ? `Δ ${diffCmjSj} cm · ${ssCmjSjHint(diffCmjSj)}` : "Necesita CMJ y SJ"));
  metrics.appendChild(deriv("RSI (último drop jump)", rsi != null ? rsi : "—",
    rsi != null ? rsiHint(rsi) : "Necesita altura + tiempo de contacto"));
  metrics.appendChild(deriv("Fuerza/peso (sentadilla)", fpeso != null ? fpeso + "×" : "—",
    fpeso != null ? `1RM ${sq} kg / ${bw} kg` : "Necesita 1RM sentadilla y peso"));
  metrics.appendChild(deriv("Mejor salto al aro", bestAro ? bestAro.jump + " cm" : "—",
    bestAro ? bestAro.nombre : "Registra un salto"));

  container.appendChild(metrics);

  /* ---------- tests por categoría ---------- */
  TEST_CATEGORIAS.forEach(cat => {
    const ts = TESTS.filter(t => t.cat === cat);
    if (!ts.length) return;
    container.appendChild(el("h2", { class: "mt-2", style: "margin-top:22px", text: cat }));
    ts.forEach(t => container.appendChild(renderTest(t)));
  });

  // Render de gráficas (los canvas ya están en el DOM)
  TESTS.forEach(t => {
    const recs = records(t.id);
    if (recs.length < 2) return;
    const key = t.rsi ? "rsi" : t.campos[0].key;
    const labels = recs.map(r => fmtDate(r.date));
    const data = recs.map(r => t.rsi ? rsiOf(r) : (r.vals ? r.vals[key] : null));
    const color = t.mejor === "bajo" ? VLCharts.C.info : VLCharts.C.accent;
    VLCharts.line("chart-test-" + t.id, labels, [VLCharts.ds(t.nombre, data, color)], {
      plugins: { legend: { display: false } }
    });
  });

  /* ====================================================== */
  function deriv(label, value, sub) {
    return el("div", { class: "stat" }, [
      el("div", { class: "label", text: label }),
      el("div", { class: "value", style: "font-size:1.5rem", text: value }),
      el("div", { class: "sub", text: sub })
    ]);
  }

  function renderTest(t) {
    const recs = records(t.id);
    const dir = t.mejor;
    const bestVal = best(t.id, t.campos[0].key, dir);

    // Inputs de alta
    const dateInput = el("input", { type: "date", value: todayISO() });
    const fieldInputs = t.campos.map(c => el("input", { type: "number", step: c.paso, placeholder: c.label + " (" + c.unidad + ")" }));
    const faseSel = el("select", {}, ["—", "Base", "Control", "Retest"].map(o => el("option", { value: o === "—" ? "" : o, text: o })));
    const noteInput = el("input", { type: "text", placeholder: "Nota (opcional)" });

    const addBtn = el("button", {
      class: "btn btn-primary btn-sm", text: "+ Añadir marca",
      onclick: () => {
        const vals = {};
        let ok = false;
        t.campos.forEach((c, i) => { const v = fieldInputs[i].value; if (v !== "") { vals[c.key] = parseFloat(v); ok = true; } });
        if (!ok) { VL.toast("Introduce un valor"); return; }
        const arr = get("tests." + t.id) || [];
        arr.push({ date: dateInput.value || todayISO(), fase: faseSel.value, note: noteInput.value, vals });
        set("tests." + t.id, arr);
        VL.toast("Marca registrada ✅");
        Sections.tests(container);
      }
    });

    // Historial
    let history = null;
    if (recs.length) {
      const wrap = el("div", { class: "table-wrap mt-2" });
      const table = el("table");
      const heads = ["Fecha"].concat(t.campos.map(c => c.label)).concat(t.rsi ? ["RSI"] : []).concat(["Fase", ""]);
      table.appendChild(el("thead", {}, el("tr", {}, heads.map(h => el("th", { text: h })))));
      const tb = el("tbody");
      recs.slice().reverse().forEach((r) => {
        const realIndex = (get("tests." + t.id) || []).indexOf(r);
        const tds = [el("td", { text: fmtDate(r.date) })];
        t.campos.forEach(c => {
          const v = r.vals ? r.vals[c.key] : null;
          const isBest = v != null && v === bestVal && c.key === t.campos[0].key;
          tds.push(el("td", { html: v != null ? (v + (isBest ? ' <span class="badge ok" style="padding:1px 6px">PR</span>' : "")) : "—" }));
        });
        if (t.rsi) tds.push(el("td", { text: rsiOf(r) != null ? rsiOf(r) : "—" }));
        tds.push(el("td", {}, r.fase ? el("span", { class: "badge " + faseBadge(r.fase), text: r.fase }) : el("span", { class: "muted", text: "—" })));
        tds.push(el("td", {}, el("button", {
          class: "btn btn-sm btn-ghost", style: "padding:3px 8px", text: "✕",
          title: r.note || "Eliminar",
          onclick: () => { if (confirm("¿Eliminar esta marca?")) { const a = get("tests." + t.id) || []; a.splice(realIndex, 1); set("tests." + t.id, a); Sections.tests(container); } }
        })));
        tb.appendChild(el("tr", {}, tds));
      });
      table.appendChild(tb);
      wrap.appendChild(table);
      history = wrap;
    }

    // Gráfica (con 1 registro, avisar de que aparecerá con el 2º)
    const chart = recs.length >= 2
      ? el("div", { class: "chart-box mt-2", style: "height:180px" }, el("canvas", { id: "chart-test-" + t.id }))
      : recs.length === 1
        ? el("small", { class: "muted", style: "display:block;margin-top:8px", text: "✓ Registro guardado (línea base). La gráfica de evolución aparecerá con el 2º registro." })
        : null;

    // Protocolo plegable
    const proto = el("ul", { class: "hidden-body", style: "margin:8px 0 0;padding-left:18px" },
      t.protocolo.map(p => el("li", { class: "dim", style: "font-size:.86rem;margin-bottom:3px", text: p })));
    const protoToggle = el("button", { class: "btn btn-sm btn-ghost", style: "padding:4px 8px", text: "📋 Ver protocolo",
      onclick: () => proto.classList.toggle("hidden-body") });

    return el("div", { class: "card" }, [
      el("div", { class: "flex-between flex-wrap" }, [
        el("div", { class: "flex", style: "gap:10px;min-width:0" }, [
          el("span", { style: "font-size:1.4rem", text: t.icono }),
          el("div", {}, [
            el("div", { style: "font-weight:700", text: t.nombre }),
            el("small", { class: "muted", text: t.cat })
          ])
        ]),
        bestVal != null ? el("div", { class: "text-c" }, [
          el("small", { class: "muted", text: dir === "bajo" ? "Mejor (mín)" : "Mejor" }),
          el("div", { style: "font-weight:800;color:var(--accent-2)", text: bestVal + " " + t.campos[0].unidad })
        ]) : null
      ]),
      el("p", { class: "dim mt-1", style: "font-size:.88rem", text: t.desc }),
      protoToggle, proto,
      el("div", { class: "row mt-2" }, [dateInput].concat(fieldInputs).concat([faseSel])),
      el("div", { class: "row mt-1" }, [noteInput, el("div", { style: "flex:0 0 auto" }, addBtn)]),
      history, chart
    ]);
  }

  function faseBadge(f) { return f === "Base" ? "b1" : f === "Control" ? "b2" : f === "Retest" ? "b3" : ""; }

  function ssCmjSjHint(diff) {
    if (diff == null) return "";
    if (diff < 2) return "poco rebote elástico → trabaja pliometría reactiva";
    if (diff > 6) return "buen uso del SSC → tu margen está en fuerza/SJ";
    return "equilibrado";
  }
  function rsiHint(v) {
    if (v < 1.5) return "reactividad a desarrollar";
    if (v < 2.5) return "nivel intermedio";
    return "buena reactividad";
  }

  function editRim() {
    const v = prompt("Altura del aro en cm:", RIM);
    if (v && !isNaN(parseFloat(v))) { set("settings.rimHeightCm", parseFloat(v)); Sections.tests(container); }
  }
};
