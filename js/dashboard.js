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

  // Cabecera (con calendario interno visible)
  const hoyStr = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
  const hoyCap = hoyStr.charAt(0).toUpperCase() + hoyStr.slice(1);
  container.appendChild(el("div", { class: "section-head" }, [
    el("div", { class: "eyebrow", text: "Centro de mando" }),
    el("h1", { text: "Hola 👋 Vamos a por el mate" }),
    el("p", { text: "Pretemporada de 8 semanas · salto vertical, fuerza y capacidad de trabajo." }),
    el("div", { class: "flex flex-wrap", style: "gap:6px;margin-top:2px" }, [
      el("span", { class: "badge", text: "📅 Hoy: " + hoyCap })
    ])
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

  // Resumen semana/bloque (con rango de fechas de la semana actual)
  let rango = "";
  const lunes = VL.weekStartDate(week);
  if (lunes) {
    const domingo = new Date(lunes); domingo.setDate(domingo.getDate() + 6);
    const f = d => d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
    rango = f(lunes) + " – " + f(domingo);
  }
  const grid = el("div", { class: "grid grid-3" });
  grid.appendChild(stat("Semana actual", `${week}`, "/ 8", "accent", rango));
  grid.appendChild(stat("Bloque", `${block}`, blockNames[block], ""));
  const nextTest = week <= 4 ? "Control · S4" : week < 8 ? "Retest · S8" : "¡Retest!";
  grid.appendChild(stat("Próximo test", nextTest, "", ""));
  container.appendChild(grid);

  // 🎯 Contador hacia el mate + registro rápido de toque
  container.appendChild(renderHeroMate());

  // 🩺 Check-in diario de readiness (autorregulación)
  container.appendChild(renderReadiness());

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
    const dobleHoy = !!(get("settings.modoExigente") && todaySession.gymExtra);
    todayCard.appendChild(el("div", { class: "flex mt-1", style: "gap:10px" }, [
      el("span", { style: "font-size:1.6rem", text: todaySession.icono }),
      el("div", {}, [
        el("div", { style: "font-weight:700", text: todaySession.nombre }),
        el("small", { class: "dim", text: todaySession.foco }),
        dobleHoy ? el("div", { class: "mt-1" }, el("span", { class: "badge b3", text: "🔥 Doble sesión: + gym tren superior" })) : null
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

  /* ---------- 🎯 héroe: camino al mate ---------- */
  function renderHeroMate() {
    const da = VL.deficitAro();
    const card = el("div", { class: "card", style: "border:1px solid var(--accent);background:linear-gradient(135deg, rgba(255,77,61,.10), transparent 55%), var(--surface)" });
    card.appendChild(el("div", { style: "font-size:.74rem;color:var(--text-mute);text-transform:uppercase;letter-spacing:.08em;font-weight:700", text: "🎯 Camino al mate" }));

    if (da) {
      const tocaAro = da.deficit <= 0;
      card.appendChild(el("div", {
        style: "font-family:var(--font-display);font-size:2.3rem;font-weight:700;line-height:1.15;color:" + (tocaAro ? "var(--ok)" : "var(--accent-2)"),
        text: tocaAro ? "¡Tocas aro! +" + String(Math.abs(da.deficit)).replace(".", ",") + " cm de margen" : "A " + String(da.deficit).replace(".", ",") + " cm del aro"
      }));
      const mateFalta = Math.round((da.rim + 15 - da.mejorTotal) * 10) / 10;
      card.appendChild(el("div", { class: "dim", style: "font-size:.86rem;margin-top:2px", text: mateFalta > 0
        ? "Para el mate necesitas ~15 cm por encima del aro: te faltan " + String(mateFalta).replace(".", ",") + " cm."
        : "🏀 ¡Margen de mate conseguido! A por él en pista." }));
      card.appendChild(el("small", { class: "muted", text: "Mejor registro: " + da.mejorTotal + " cm (" + da.base + ") · aro a " + da.rim + " cm" }));
    } else {
      card.appendChild(el("p", { class: "dim mb-0", style: "font-size:.88rem", text: "Registra tu primer toque aquí abajo (o alcance + salto en Tests) para activar el contador." }));
    }

    // Registro rápido: "¿a cuánto llegaste hoy?"
    const inp = el("input", { type: "number", step: "0.5", placeholder: "¿A cuánto llegaste hoy? (cm, ej. 298)" });
    const btn = el("button", { class: "btn btn-primary btn-sm", text: "Guardar toque", onclick: () => {
      const v = parseFloat(inp.value);
      if (!v || v < 150 || v > 420) { VL.toast("Pon la altura tocada en cm (ej. 298)"); return; }
      const arr = get("tests.toque") || [];
      arr.push({ date: VL.todayISO(), fase: "", note: "registro rápido", vals: { marca: v } });
      set("tests.toque", arr);
      VL.toast("🎯 Toque registrado: " + v + " cm");
      window.App.render("dashboard");
    }});
    card.appendChild(el("div", { class: "row mt-2" }, [inp, el("div", { style: "flex:0 0 auto" }, btn)]));
    return card;
  }

  /* ---------- 🩺 check-in de readiness ---------- */
  function renderReadiness() {
    const hoy = todayISO();
    const saved = get("readiness." + hoy);
    const card = el("div", { class: "card" });

    if (saved && saved.nivel) {
      const info = saved.nivel === "verde"
        ? { b: "ok", t: "💚 Día verde — a por todas, cargas completas." }
        : saved.nivel === "ambar"
          ? { b: "warn", t: "🟡 Día regular — cargas de hoy −5%; plantéate saltarte los extras." }
          : { b: "warn", t: "🔴 Día rojo — prioriza técnica y movilidad; si entrenas, −10% y sin saltos máximos." };
      card.appendChild(el("div", { class: "flex-between flex-wrap" }, [
        el("div", { class: "card-title mb-0", html: "🩺 Check-in de hoy" }),
        el("button", { class: "btn btn-sm btn-ghost", text: "Cambiar", onclick: () => { set("readiness." + hoy, null); window.App.render("dashboard"); } })
      ]));
      card.appendChild(el("div", { class: "mt-1" }, el("span", { class: "badge " + info.b, style: "white-space:normal;line-height:1.4", text: info.t })));
      return card;
    }

    card.appendChild(el("div", { class: "card-title mb-0", html: "🩺 ¿Cómo llegas hoy?" }));
    card.appendChild(el("p", { class: "mt-1 dim", style: "font-size:.84rem", text: "30 segundos: la web ajusta las cargas de HOY a tu estado (autorregulación)." }));
    const state = {};
    const preguntas = [
      ["sueno", "😴 Sueño", ["Mal", "Normal", "Bien"]],
      ["agujetas", "🦵 Agujetas / molestias", ["Muchas", "Algunas", "Ninguna"]],
      ["energia", "⚡ Energía", ["Baja", "Normal", "Alta"]]
    ];
    preguntas.forEach(([key, label, ops]) => {
      const row = el("div", { class: "flex flex-wrap", style: "gap:6px;margin-top:8px;align-items:center" });
      row.appendChild(el("span", { style: "font-size:.85rem;font-weight:600;min-width:170px", text: label }));
      ops.forEach((op, i) => {
        const b = el("button", { class: "btn btn-sm", text: op });
        b.addEventListener("click", () => {
          state[key] = i + 1;
          row.querySelectorAll("button").forEach(x => x.classList.remove("btn-primary"));
          b.classList.add("btn-primary");
          if (state.sueno && state.agujetas && state.energia) {
            const score = state.sueno + state.agujetas + state.energia;
            const nivel = score >= 8 ? "verde" : score >= 5 ? "ambar" : "rojo";
            set("readiness." + hoy, { sueno: state.sueno, agujetas: state.agujetas, energia: state.energia, score, nivel });
            VL.toast(nivel === "verde" ? "💚 Día verde: a tope" : nivel === "ambar" ? "🟡 Día regular: cargas −5% hoy" : "🔴 Día rojo: cuida el cuerpo");
            window.App.render("dashboard");
          }
        });
        row.appendChild(b);
      });
      card.appendChild(row);
    });
    return card;
  }

  function stat(label, value, unit, cls, sub) {
    return el("div", { class: "stat " + cls }, [
      el("div", { class: "label", text: label }),
      el("div", { class: "value", html: value + (unit ? ` <span class="unit">${unit}</span>` : "") }),
      sub ? el("div", { class: "sub", text: sub }) : null
    ]);
  }
};
