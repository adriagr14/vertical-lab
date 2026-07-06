/* ============================================================
   plan.js — Plan 8 semanas (§4.2)
   Lee PLAN.semanas. Selector de semana, acordeón de sesiones,
   marcar completada + RPE + nota, copiar sesión a Heavy.
   ============================================================ */
window.Sections = window.Sections || {};

Sections.plan = function (container) {
  const { el, get, set, currentWeek, blockForWeek, save } = VL;
  container.innerHTML = "";

  // Estado de UI: semana seleccionada (memoria en sesión de página)
  if (Sections.plan._week == null) Sections.plan._week = currentWeek() || 1;
  let selWeek = Sections.plan._week;

  // Día a abrir y enfocar automáticamente (lo fija el dashboard al pulsar "Ir al plan").
  // Se consume una sola vez para no reabrirlo en visitas posteriores a esta sección.
  const openDayTarget = Sections.plan._openDay;
  Sections.plan._openDay = null;

  // Cabecera
  container.appendChild(el("div", { class: "section-head" }, [
    el("div", { class: "eyebrow", text: "Periodización por bloques · Verkhoshansky" }),
    el("h1", { text: "Plan · 8 semanas" }),
    el("p", { text: "5 sesiones/semana (L-M-X-J-V). Pliometría antes de la fuerza. Cargas y RPE editables." })
  ]));

  // Modo exigente: dobles sesiones (pista + gym superior) y +2,5% de carga
  const exigente = !!get("settings.modoExigente");
  const exigChk = el("input", { type: "checkbox" });
  if (exigente) exigChk.checked = true;
  exigChk.addEventListener("change", () => {
    set("settings.modoExigente", exigChk.checked);
    VL.toast(exigChk.checked ? "🔥 Modo exigente activado" : "Modo exigente desactivado");
    Sections.plan(container);
  });
  container.appendChild(el("div", { class: "card", style: exigente ? "border-color:var(--accent)" : "" }, [
    el("div", { class: "flex-between flex-wrap" }, [
      el("div", { class: "card-title mb-0", html: "🔥 Modo exigente" }),
      el("label", { class: "flex", style: "gap:8px;cursor:pointer;flex:0 0 auto" }, [
        exigChk,
        el("span", { style: "font-weight:700;font-size:.88rem;color:" + (exigente ? "var(--accent-2)" : "var(--text-mute)"), text: exigente ? "Activado" : "Desactivado" })
      ])
    ]),
    el("p", { class: "mt-1 mb-0 dim", style: "font-size:.85rem", text: "Dobles sesiones: los días de pista añaden un bloque de gimnasio de tren superior (~35'), y las cargas sugeridas suben +2,5% desde la semana 1. Ideal: pista y gimnasio separados ≥6 h (mañana/tarde); si no, pista primero y pesas después. La pliometría NO aumenta: el tendón se adapta más lento que el músculo y necesita progresión gradual." })
  ]));

  // Resumen de bloques
  const blocks = el("div", { class: "grid grid-3" });
  PLAN.meta.bloques.forEach(b => {
    const active = b.semanas.includes(selWeek);
    blocks.appendChild(el("div", { class: "card", style: active ? "border-color:var(--accent)" : "" }, [
      el("div", { class: "flex-between" }, [
        el("span", { class: "badge " + b.color, text: "Bloque " + b.id }),
        el("small", { text: "Sem " + b.semanas[0] + "–" + b.semanas[b.semanas.length - 1] })
      ]),
      el("div", { class: "mt-1", style: "font-weight:600;font-size:.92rem", text: b.nombre })
    ]));
  });
  container.appendChild(blocks);

  // Selector de semanas (chips)
  const weekBar = el("div", { class: "flex flex-wrap", style: "margin:14px 0 6px" });
  PLAN.semanas.forEach(w => {
    const isSel = w.n === selWeek;
    const isNow = w.n === currentWeek();
    const chip = el("button", {
      class: "btn btn-sm" + (isSel ? " btn-primary" : ""),
      style: "min-width:auto",
      onclick: () => { Sections.plan._week = w.n; Sections.plan(container); }
    }, [
      el("span", { text: "S" + w.n }),
      w.descarga ? el("span", { text: " ↓", title: "Descarga" }) : null,
      isNow ? el("span", { text: " •", style: "color:var(--ok)" }) : null
    ]);
    weekBar.appendChild(chip);
  });
  container.appendChild(weekBar);

  const wk = PLAN.semanas.find(w => w.n === selWeek);
  const blk = PLAN.meta.bloques.find(b => b.id === wk.bloque);

  // Rango de fechas de la semana (si el plan está activado)
  const lunes = VL.weekStartDate(wk.n);
  let rango = null;
  if (lunes) {
    const viernes = new Date(lunes); viernes.setDate(viernes.getDate() + 4);
    const f = d => d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
    rango = f(lunes) + " – " + f(viernes);
  }

  // ¿Hay cargas personalizadas calculables esta semana?
  const hayCargas = wk.dias.some(d => (d.bloques || []).some(g => (g.ejercicios || []).some(e => cargaSugerida(e, wk, d))));

  // Banner de la semana (progresión)
  container.appendChild(el("div", { class: "card", style: "border-left:3px solid var(--accent)" }, [
    el("div", { class: "flex-between flex-wrap" }, [
      el("div", {}, [
        el("div", { class: "flex flex-wrap", style: "gap:6px;margin-bottom:4px" }, [
          el("span", { class: "badge " + blk.color, text: "Bloque " + wk.bloque }),
          el("span", { class: "badge", text: "Semana " + wk.n + " / 8" }),
          rango ? el("span", { class: "badge", text: "📅 " + rango }) : null,
          el("span", { class: "badge " + (wk.taper ? "warn" : wk.descarga ? "warn" : "ok"), text: wk.carga }),
          exigente ? el("span", { class: "badge b3", text: "🔥 Exigente" }) : null
        ]),
        el("h3", { class: "mb-0", text: wk.titulo })
      ])
    ]),
    el("p", { class: "mt-1 mb-0", text: wk.nota }),
    hayCargas ? el("p", { class: "mb-0", style: "margin-top:8px;font-size:.8rem;color:var(--text-mute)", text: "⚖️ Las cargas «≈ kg» se calculan de TU 1RM estimado y se actualizan solas al registrar/sincronizar entrenos. Son orientativas: ajusta ±2,5 kg según el RPE del día." }) : null
  ]));

  // Sesiones (acordeón)
  let targetCard = null;
  wk.dias.forEach(dia => {
    const card = renderDay(wk, dia);
    if (openDayTarget != null && dia.dayIndex === openDayTarget) targetCard = card;
    container.appendChild(card);
  });
  if (targetCard) requestAnimationFrame(() => targetCard.scrollIntoView({ behavior: "smooth", block: "start" }));

  // Entrenamientos opcionales de la semana
  container.appendChild(renderExtras(wk));

  /* ---------- render de un día ---------- */
  function renderDay(week, dia) {
    const key = "w" + week.n + "d" + dia.dayIndex;
    const rec = get("sessions." + key) || {};
    const done = !!rec.done;

    const body = el("div", { class: "mt-2 hidden-body" });
    const head = VL.accordionHead(
      el("div", { class: "flex", style: "gap:10px;min-width:0" }, [
        el("span", { style: "font-size:1.3rem", text: dia.icono }),
        el("div", { style: "min-width:0" }, [
          el("div", { class: "flex flex-wrap", style: "gap:6px" }, [
            el("small", { style: "color:var(--text-mute);font-weight:700", text: dia.dia.toUpperCase() }),
            done ? el("span", { class: "badge ok", text: "✓ Hecha" + (rec.rpe ? " · RPE " + rec.rpe : "") }) : null
          ]),
          el("div", { style: "font-weight:700;font-size:.96rem", text: dia.nombre })
        ])
      ]),
      body,
      { open: openDayTarget === dia.dayIndex }
    );

    // Foco
    body.appendChild(el("p", { class: "dim", style: "font-size:.88rem", text: dia.foco }));

    // Calentamiento
    body.appendChild(collapseList("🔥 Calentamiento (RAMP)", dia.calentamiento));

    // Bloques de ejercicios (+ gym extra del modo exigente en días de pista)
    const bloquesFx = (exigente && dia.gymExtra) ? dia.bloques.concat([dia.gymExtra]) : dia.bloques;
    const diaFx = (exigente && dia.gymExtra) ? Object.assign({}, dia, { bloques: bloquesFx }) : dia;
    bloquesFx.forEach(grupo => {
      body.appendChild(el("div", { class: "mt-2", style: "font-weight:700;color:var(--accent-2);font-size:.85rem;text-transform:uppercase;letter-spacing:.04em", text: grupo.nombre }));
      const wrap = el("div", { class: "table-wrap" });
      const table = el("table");
      table.appendChild(el("thead", {}, el("tr", {}, [
        th("Ejercicio"), th("Series"), th("Reps"), th("Intensidad"), th("Desc.")
      ])));
      const tb = el("tbody");
      grupo.ejercicios.forEach(ex => {
        const carga = cargaSugerida(ex, week, dia);
        const alts = (ex.lift && PLAN.alternativas) ? PLAN.alternativas[ex.lift] : null;

        // Info expandible bajo el nombre: aproximación (toca el chip) y alternativas
        const aproxDiv = el("div", { class: "hidden-body", style: "margin-top:4px;font-size:.8rem;color:var(--info)" });
        const altDiv = el("div", { class: "hidden-body", style: "margin-top:4px;font-size:.8rem;color:var(--warn)" });
        if (alts) altDiv.textContent = "⇄ Si está ocupado (misma dosis): " + alts.join(" · ");

        let chip = null;
        if (carga) {
          chip = el("span", {
            class: "badge ok", style: "cursor:pointer",
            title: carga.title + " · toca para ver la aproximación",
            text: "≈ " + String(carga.peso).replace(".", ",") + " kg · " + carga.pct + "%"
          });
          chip.addEventListener("click", () => {
            aproxDiv.textContent = "🔥 Aproximación: " + aproximacion(carga.peso);
            aproxDiv.classList.toggle("hidden-body");
          });
        }

        const tr = el("tr", {}, [
          el("td", {}, [
            el("div", { class: "flex flex-wrap", style: "gap:6px;align-items:center" }, [
              el("span", { style: "font-weight:600", text: ex.nombre }),
              alts ? el("button", { class: "btn btn-sm btn-ghost", style: "padding:1px 7px;font-size:.7rem;min-width:auto", text: "⇄ ¿ocupado?", onclick: () => altDiv.classList.toggle("hidden-body") }) : null
            ]),
            ex.cue ? el("small", { style: "color:var(--text-mute)", text: "💡 " + ex.cue }) : null,
            aproxDiv, altDiv
          ]),
          el("td", { text: String(ex.series) }),
          el("td", { text: String(ex.reps) }),
          el("td", {}, [
            el("span", { class: "badge", text: ex.intensidad }),
            chip ? el("div", { style: "margin-top:4px" }, chip) : null
          ]),
          el("td", { class: "muted", text: ex.descanso || "—" })
        ]);
        tb.appendChild(tr);
      });
      table.appendChild(tb);
      wrap.appendChild(table);
      body.appendChild(wrap);
    });

    if (dia.finisher) body.appendChild(el("p", { class: "mt-2 dim", style: "font-size:.86rem", text: "🏁 " + dia.finisher }));

    // Acciones: copiar / crear rutina en Hevy (días con gimnasio) + completar
    const hevyResult = el("div", { class: "mt-2" });
    const actions = el("div", { class: "flex flex-wrap mt-2", style: "gap:8px" });
    if (dia.tipo !== "pista" || (exigente && dia.gymExtra)) {
      actions.appendChild(el("button", {
        class: "btn btn-sm", text: "📋 Copiar a Heavy",
        onclick: () => VLHeavy.copySession(toHeavySession(week, diaFx))
      }));
      const createBtn = el("button", { class: "btn btn-sm", text: "➕ Crear rutina en Hevy" });
      createBtn.addEventListener("click", async () => {
        const apiKey = get("settings.hevyApiKey");
        if (!apiKey) { VL.toast("Pega tu clave de Hevy en Gimnasio primero"); window.App.go("gimnasio"); return; }
        const prev = createBtn.textContent; createBtn.disabled = true; createBtn.textContent = "Creando…";
        hevyResult.innerHTML = "";
        try {
          const res = await VLHevyRoutines.createRoutine(apiKey, week, diaFx);
          createBtn.disabled = false; createBtn.textContent = prev;
          VL.toast(res.created ? "✅ Rutina creada en Hevy" : "⚠️ " + res.msg);
          hevyResult.appendChild(renderHevyResult(res));
        } catch (err) {
          createBtn.disabled = false; createBtn.textContent = prev;
          hevyResult.appendChild(el("div", { class: "badge warn", text: "⚠️ " + err.message }));
        }
      });
      actions.appendChild(createBtn);
    }
    actions.appendChild(el("button", {
      class: "btn btn-sm " + (done ? "btn-ghost" : "btn-primary"),
      text: done ? "Desmarcar" : "✓ Marcar hecha",
      onclick: () => toggleDone(week, dia, key)
    }));
    body.appendChild(actions);
    body.appendChild(hevyResult);

    // RPE + nota (si está hecha o al marcar)
    const rpeInput = el("input", { type: "number", min: "1", max: "10", step: "0.5", placeholder: "RPE", value: rec.rpe || "", style: "max-width:90px" });
    const noteInput = el("input", { type: "text", placeholder: "Nota de la sesión…", value: rec.note || "" });
    const saveBtn = el("button", { class: "btn btn-sm", text: "Guardar", onclick: () => {
      const r = get("sessions." + key) || {};
      r.rpe = rpeInput.value ? parseFloat(rpeInput.value) : null;
      r.note = noteInput.value;
      set("sessions." + key, r);
      VL.toast("Guardado");
      Sections.plan._openDay = dia.dayIndex;   // mantener el día abierto tras re-render
      Sections.plan(container);
    }});
    body.appendChild(el("div", { class: "row mt-2" }, [rpeInput, noteInput, el("div", { style: "flex:0 0 auto" }, saveBtn)]));

    return el("div", { class: "card" }, [head, body]);

    function toggleDone(week, dia, key) {
      const r = get("sessions." + key) || {};
      r.done = !r.done;
      if (r.done && !r.date) r.date = VL.todayISO();
      set("sessions." + key, r);
      VL.toast(r.done ? "Sesión completada 💪" : "Sesión desmarcada");
      Sections.plan._openDay = dia.dayIndex;   // mantener el día abierto tras re-render
      Sections.plan(container);
    }
  }

  /* ---------- carga sugerida personalizada ----------
     pct base del ejercicio (data/plan-8-semanas.js) sobre TU mejor 1RM estimado
     (punto de partida + historial/Hevy), con ajuste semanal:
     +2,5% a partir de la 2ª semana del bloque · −7,5% en descarga/taper. */
  function cargaSugerida(ex, week, dia) {
    if (!ex.lift || !ex.pct) return null;
    const e1 = VL.bestE1RM(ex.lift);
    if (!e1) return null;
    const blk = PLAN.meta.bloques.find(b => b.id === week.bloque);
    const idx = blk ? blk.semanas.indexOf(week.n) : 0;
    const relajado = week.descarga || week.taper;
    const exig = exigente ? 0.025 : 0;   // modo exigente: +2,5% desde la semana 1
    const pct = ex.pct + exig + (relajado ? 0 : Math.min(Math.max(idx, 0), 1) * 0.025);
    let factor = relajado ? 0.925 : 1;
    let notaReadiness = "";
    // Autorregulación: si es la sesión de HOY y has hecho el check-in, modula la carga
    if (dia && week.n === VL.currentWeek() && dia.dayIndex === (new Date().getDay() - 1)) {
      const r = get("readiness." + VL.todayISO());
      if (r && r.nivel === "ambar") { factor *= 0.95; notaReadiness = " · check-in de hoy: −5%"; }
      else if (r && r.nivel === "rojo") { factor *= 0.90; notaReadiness = " · check-in de hoy: −10%"; }
    }
    const peso = Math.max(2.5, Math.round((e1 * pct * factor) / 2.5) * 2.5);
    const pctShow = Math.round(pct * factor * 100);
    return {
      peso, pct: pctShow,
      title: `${pctShow}% de tu 1RM estimado (${e1} kg)` + (exig ? " · modo exigente (+2,5%)" : "") + (relajado ? " · semana de descarga (−7,5%)" : "") + notaReadiness
    };
  }

  // Series de aproximación hasta la carga de trabajo
  function aproximacion(peso) {
    const fmt = w => String(w).replace(".", ",");
    const pasos = ["barra 20 ×10"];
    [[.45, 5], [.65, 3], [.85, 1]].forEach(([p, reps]) => {
      const w = Math.round(peso * p / 2.5) * 2.5;
      if (w > 20 && w < peso) pasos.push(fmt(w) + " ×" + reps);
    });
    pasos.push(fmt(peso) + " kg → series de trabajo");
    return pasos.join("  ·  ");
  }

  function collapseList(title, items) {
    const ul = el("ul", { style: "margin:6px 0 0;padding-left:18px" });
    items.forEach(i => ul.appendChild(el("li", { class: "dim", style: "font-size:.86rem;margin-bottom:2px", text: i })));
    return el("div", { class: "mt-2" }, [
      el("div", { style: "font-weight:700;color:var(--info);font-size:.85rem", text: title }),
      ul
    ]);
  }

  function th(t) { return el("th", { text: t }); }

  function toHeavySession(week, dia) {
    return {
      titulo: dia.nombre, dia: dia.dia, bloque: week.bloque, semana: week.n,
      bloques: dia.bloques.map(g => ({
        nombre: g.nombre,
        ejercicios: g.ejercicios.map(e => ({ nombre: e.nombre, series: e.series, reps: e.reps, intensidad: e.intensidad, descanso: e.descanso }))
      }))
    };
  }

  /* ---------- entrenamientos opcionales de la semana ---------- */
  function renderExtras(week) {
    const wkey = "w" + week.n;
    const items = get("extras." + wkey) || [];

    const TIPOS = [
      { id: "partido", icono: "🏀", nombre: "Partido / práctica" },
      { id: "carrera", icono: "🏃", nombre: "Carrera / cardio" },
      { id: "gym", icono: "🏋️", nombre: "Gimnasio extra" },
      { id: "movilidad", icono: "🧘", nombre: "Movilidad / recuperación" },
      { id: "otro", icono: "➕", nombre: "Otro" }
    ];
    const tipoDe = id => TIPOS.find(t => t.id === id) || TIPOS[TIPOS.length - 1];

    const card = el("div", { class: "card", style: "border-style:dashed" });
    card.appendChild(el("div", { class: "card-title mb-0", html: "➕ Entrenamientos opcionales · Semana " + week.n }));
    card.appendChild(el("p", { class: "mt-1 dim", style: "font-size:.86rem", text: "Sesiones fuera del plan: partidos, práctica de equipo, carrera, gimnasio extra… Cuidado en semanas de descarga: los extras también son carga." }));

    // Lista de extras existentes
    if (items.length) {
      const list = el("div", { class: "mt-1" });
      items.forEach((it, idx) => {
        const t = tipoDe(it.tipo);
        list.appendChild(el("div", { class: "flex-between", style: "gap:10px;padding:8px 0;border-bottom:1px solid var(--border)" }, [
          el("div", { class: "flex", style: "gap:10px;min-width:0" }, [
            el("span", { style: "font-size:1.2rem", text: t.icono }),
            el("div", { style: "min-width:0" }, [
              el("div", { style: "font-weight:600;font-size:.92rem", text: it.nombre || t.nombre }),
              el("small", { class: "muted", text: t.nombre + (it.done && it.date ? " · ✓ " + VL.fmtDate(it.date) : "") })
            ])
          ]),
          el("div", { class: "flex", style: "gap:6px;flex:0 0 auto" }, [
            el("button", {
              class: "btn btn-sm " + (it.done ? "btn-ghost" : ""),
              text: it.done ? "✓ Hecho" : "Marcar",
              onclick: () => {
                const arr = get("extras." + wkey) || [];
                arr[idx].done = !arr[idx].done;
                arr[idx].date = arr[idx].done ? VL.todayISO() : null;
                set("extras." + wkey, arr);
                Sections.plan(container);
              }
            }),
            el("button", {
              class: "btn btn-sm btn-ghost", style: "padding:6px 9px", text: "✕",
              onclick: () => {
                if (!confirm("¿Eliminar este entrenamiento opcional?")) return;
                const arr = get("extras." + wkey) || [];
                arr.splice(idx, 1);
                set("extras." + wkey, arr);
                Sections.plan(container);
              }
            })
          ])
        ]));
      });
      card.appendChild(list);
    }

    // Formulario de alta
    const tipoSel = el("select", {}, TIPOS.map(t => el("option", { value: t.id, text: t.icono + " " + t.nombre })));
    const nameIn = el("input", { type: "text", placeholder: "Descripción (ej. Partido liga, 5 km suaves…)" });
    const addBtn = el("button", { class: "btn btn-primary btn-sm", text: "+ Añadir", onclick: () => {
      const arr = get("extras." + wkey) || [];
      arr.push({ id: Date.now(), tipo: tipoSel.value, nombre: nameIn.value.trim(), done: false, date: null });
      set("extras." + wkey, arr);
      VL.toast("Opcional añadido");
      Sections.plan(container);
    }});
    card.appendChild(el("div", { class: "row mt-2" }, [
      el("div", { style: "flex:0 0 auto;min-width:170px" }, tipoSel),
      nameIn,
      el("div", { style: "flex:0 0 auto" }, addBtn)
    ]));

    return card;
  }

  function renderHevyResult(res) {
    const box = el("div", { class: "card", style: "background:var(--bg-3);padding:11px;margin:0" });
    if (res.created) box.appendChild(el("div", { class: "badge ok", text: "✅ Rutina creada: " + (res.matched.length) + " ejercicios" }));
    else box.appendChild(el("div", { class: "badge warn", text: res.msg || "No se creó la rutina" }));
    if (res.matched && res.matched.length) {
      box.appendChild(el("div", { class: "mt-1", style: "font-size:.82rem;color:var(--text-dim)", text: "Añadidos: " + res.matched.map(m => m.hevy).join(", ") }));
    }
    if (res.unmatched && res.unmatched.length) {
      box.appendChild(el("div", { class: "mt-1", style: "font-size:.82rem;color:var(--warn)", text: "➕ Añade tú en Hevy (no encontrados): " + res.unmatched.join(", ") }));
    }
    return box;
  }
};
