/* ============================================================
   dashboard.js — Inicio (§4.1)
   En esta fase: resumen semana/bloque, alta de fecha de inicio,
   accesos rápidos y huecos de mini-gráficas (se conectan en fases siguientes).
   ============================================================ */
window.Sections = window.Sections || {};
Sections.dashboard = function (container) {
  const { el, get, set, currentWeek, blockForWeek, todayISO } = VL;
  const week = currentWeek();
  const block = blockForWeek(week);
  const start = get("meta.startDate");
  const blockNames = { 1: "Fuerza máxima + GPP", 2: "Fuerza-velocidad + Potencia", 3: "Reactividad + Pico" };

  container.innerHTML = "";

  // Cabecera
  container.appendChild(el("div", { class: "section-head" }, [
    el("div", { class: "eyebrow", text: "Centro de mando" }),
    el("h1", { text: "Hola 👋 Vamos a por el mate" }),
    el("p", { text: "Pretemporada de 8 semanas · salto vertical, fuerza y capacidad de trabajo." })
  ]));

  if (!start) {
    // Onboarding: pedir fecha de inicio
    const input = el("input", { type: "date", value: todayISO(), id: "startDateInput" });
    const card = el("div", { class: "card pad-lg" }, [
      el("div", { class: "card-title", html: "🚀 Empecemos" }),
      el("p", { text: "Marca la fecha de inicio del plan para activar el seguimiento de semanas y bloques." }),
      el("label", { class: "field" }, [el("span", { text: "Fecha de inicio (lunes de la semana 1)" }), input]),
      el("button", {
        class: "btn btn-primary", text: "Activar plan",
        onclick: () => { set("meta.startDate", input.value); set("meta.createdAt", todayISO()); VL.toast("¡Plan activado!"); window.App.render("dashboard"); window.App.updateContext(); }
      })
    ]);
    container.appendChild(card);
    return;
  }

  // Resumen semana/bloque
  const grid = el("div", { class: "grid grid-3" });
  grid.appendChild(stat("Semana actual", `${week}`, "/ 8", "accent"));
  grid.appendChild(stat("Bloque", `${block}`, blockNames[block], ""));
  const nextTest = week <= 4 ? "Control · S4" : week < 8 ? "Retest · S8" : "¡Retest!";
  grid.appendChild(stat("Próximo test", nextTest, "", ""));
  container.appendChild(grid);

  // Sesión de hoy (conectada al plan)
  const jsDay = new Date().getDay();            // 0=Dom … 6=Sáb
  const dayIndex = jsDay - 1;                    // Lun=0 … Vie=4
  const wkData = (window.PLAN && PLAN.semanas) ? PLAN.semanas.find(w => w.n === week) : null;
  const todaySession = (wkData && dayIndex >= 0 && dayIndex <= 4) ? wkData.dias[dayIndex] : null;

  const todayCard = el("div", { class: "card" });
  todayCard.appendChild(el("div", { class: "flex-between" }, [
    el("div", { class: "card-title mb-0", html: "🎯 Sesión de hoy" }),
    el("button", { class: "btn btn-sm", text: "Ir al plan →", onclick: () => { Sections.plan._week = week; Sections.plan._openDay = todaySession ? dayIndex : null; window.App.go("plan"); } })
  ]));
  if (todaySession) {
    const key = "w" + week + "d" + dayIndex;
    const done = !!(get("sessions." + key) || {}).done;
    todayCard.appendChild(el("div", { class: "flex mt-1", style: "gap:10px" }, [
      el("span", { style: "font-size:1.6rem", text: todaySession.icono }),
      el("div", {}, [
        el("div", { style: "font-weight:700", text: todaySession.nombre }),
        el("small", { class: "dim", text: todaySession.foco })
      ]),
      done ? el("span", { class: "badge ok", text: "✓ Hecha", style: "margin-left:auto" }) : null
    ]));
  } else {
    todayCard.appendChild(el("p", { class: "mt-1 mb-0 dim", text: "Hoy toca descanso / recuperación. ¡Aprovecha para dormir bien! 😴" }));
  }
  container.appendChild(todayCard);

  // Mini-gráficas (datos reales si existen)
  const cmj = (get("tests.cmj") || []).slice().sort((a, b) => a.date.localeCompare(b.date));
  const sqHist = (get("lifts.sentadilla") || []).slice().sort((a, b) => a.date.localeCompare(b.date));
  const sqBase = (get("liftBaseline") || {}).sentadilla;

  const charts = el("div", { class: "grid grid-2" });
  charts.appendChild(el("div", { class: "card" }, [
    el("div", { class: "card-title", html: "📈 Salto vertical (CMJ)" }),
    cmj.length ? el("div", { class: "chart-box", style: "height:180px" }, el("canvas", { id: "chart-dash-salto" }))
      : el("p", { class: "muted mb-0", style: "font-size:.85rem", text: "Registra tu CMJ en Tests para ver el progreso." })
  ]));
  charts.appendChild(el("div", { class: "card" }, [
    el("div", { class: "card-title", html: "🏋️ 1RM est. sentadilla" }),
    (sqHist.length || sqBase) ? el("div", { class: "chart-box", style: "height:180px" }, el("canvas", { id: "chart-dash-1rm" }))
      : el("p", { class: "muted mb-0", style: "font-size:.85rem", text: "Registra cargas en Gimnasio para ver el progreso." })
  ]));
  container.appendChild(charts);

  // Pintar mini-gráficas
  if (cmj.length) {
    VLCharts.line("chart-dash-salto", cmj.map(r => VL.fmtDate(r.date)),
      [VLCharts.ds("CMJ (cm)", cmj.map(r => r.vals.marca), VLCharts.C.accent)], { plugins: { legend: { display: false } } });
  }
  if (sqHist.length || sqBase) {
    const series = [];
    if (sqBase) series.push({ date: sqBase.date || "inicio", y: VL.epley1RM(sqBase.weight, sqBase.reps) });
    sqHist.forEach(h => series.push({ date: h.date, y: VL.epley1RM(h.weight, h.reps) }));
    const valid = series.filter(s => s.y != null);
    VLCharts.line("chart-dash-1rm", valid.map(s => VL.fmtDate(s.date)),
      [VLCharts.ds("1RM est. (kg)", valid.map(s => s.y), VLCharts.C.info)], { plugins: { legend: { display: false } } });
  }

  function stat(label, value, unit, cls) {
    return el("div", { class: "stat " + cls }, [
      el("div", { class: "label", text: label }),
      el("div", { class: "value", html: value + (unit ? ` <span class="unit">${unit}</span>` : "") })
    ]);
  }
};

/* Helper compartido de placeholder de fase, usado por varias secciones */
window.phase = function (msg, n) {
  return VL.el("div", { class: "placeholder" }, [
    VL.el("span", { class: "ph-ico", text: "🧱" }),
    VL.el("div", { text: msg }),
    VL.el("span", { class: "ph-tag", text: "Se construye en la fase " + n })
  ]);
};
