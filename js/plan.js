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

  // Cabecera
  container.appendChild(el("div", { class: "section-head" }, [
    el("div", { class: "eyebrow", text: "Periodización por bloques · Verkhoshansky" }),
    el("h1", { text: "Plan · 8 semanas" }),
    el("p", { text: "5 sesiones/semana (L-M-X-J-V). Pliometría antes de la fuerza. Cargas y RPE editables." })
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

  // Banner de la semana (progresión)
  container.appendChild(el("div", { class: "card", style: "border-left:3px solid var(--accent)" }, [
    el("div", { class: "flex-between flex-wrap" }, [
      el("div", {}, [
        el("div", { class: "flex flex-wrap", style: "gap:6px;margin-bottom:4px" }, [
          el("span", { class: "badge " + blk.color, text: "Bloque " + wk.bloque }),
          el("span", { class: "badge", text: "Semana " + wk.n + " / 8" }),
          el("span", { class: "badge " + (wk.taper ? "warn" : wk.descarga ? "warn" : "ok"), text: wk.carga })
        ]),
        el("h3", { class: "mb-0", text: wk.titulo })
      ])
    ]),
    el("p", { class: "mt-1 mb-0", text: wk.nota })
  ]));

  // Sesiones (acordeón)
  wk.dias.forEach(dia => {
    container.appendChild(renderDay(wk, dia));
  });

  /* ---------- render de un día ---------- */
  function renderDay(week, dia) {
    const key = "w" + week.n + "d" + dia.dayIndex;
    const rec = get("sessions." + key) || {};
    const done = !!rec.done;

    const head = el("div", { class: "flex-between", style: "cursor:pointer;gap:10px", onclick: () => body.classList.toggle("hidden-body") }, [
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
      el("span", { class: "muted", text: "▾" })
    ]);

    const body = el("div", { class: "mt-2 hidden-body" });

    // Foco
    body.appendChild(el("p", { class: "dim", style: "font-size:.88rem", text: dia.foco }));

    // Calentamiento
    body.appendChild(collapseList("🔥 Calentamiento (RAMP)", dia.calentamiento));

    // Bloques de ejercicios
    dia.bloques.forEach(grupo => {
      body.appendChild(el("div", { class: "mt-2", style: "font-weight:700;color:var(--accent-2);font-size:.85rem;text-transform:uppercase;letter-spacing:.04em", text: grupo.nombre }));
      const wrap = el("div", { class: "table-wrap" });
      const table = el("table");
      table.appendChild(el("thead", {}, el("tr", {}, [
        th("Ejercicio"), th("Series"), th("Reps"), th("Intensidad"), th("Desc.")
      ])));
      const tb = el("tbody");
      grupo.ejercicios.forEach(ex => {
        const tr = el("tr", {}, [
          el("td", {}, [
            el("div", { style: "font-weight:600", text: ex.nombre }),
            ex.cue ? el("small", { style: "color:var(--text-mute)", text: "💡 " + ex.cue }) : null
          ]),
          el("td", { text: String(ex.series) }),
          el("td", { text: String(ex.reps) }),
          el("td", {}, el("span", { class: "badge", text: ex.intensidad })),
          el("td", { class: "muted", text: ex.descanso || "—" })
        ]);
        tb.appendChild(tr);
      });
      table.appendChild(tb);
      wrap.appendChild(table);
      body.appendChild(wrap);
    });

    if (dia.finisher) body.appendChild(el("p", { class: "mt-2 dim", style: "font-size:.86rem", text: "🏁 " + dia.finisher }));

    // Acciones: copiar a Heavy (si es día de fuerza/potencia) + completar
    const actions = el("div", { class: "flex flex-wrap mt-2", style: "gap:8px" });
    if (dia.tipo !== "pista") {
      actions.appendChild(el("button", {
        class: "btn btn-sm", text: "📋 Copiar a Heavy",
        onclick: () => VLHeavy.copySession(toHeavySession(week, dia))
      }));
    }
    actions.appendChild(el("button", {
      class: "btn btn-sm " + (done ? "btn-ghost" : "btn-primary"),
      text: done ? "Desmarcar" : "✓ Marcar hecha",
      onclick: () => toggleDone(week, dia, key)
    }));
    body.appendChild(actions);

    // RPE + nota (si está hecha o al marcar)
    const rpeInput = el("input", { type: "number", min: "1", max: "10", step: "0.5", placeholder: "RPE", value: rec.rpe || "", style: "max-width:90px" });
    const noteInput = el("input", { type: "text", placeholder: "Nota de la sesión…", value: rec.note || "" });
    const saveBtn = el("button", { class: "btn btn-sm", text: "Guardar", onclick: () => {
      const r = get("sessions." + key) || {};
      r.rpe = rpeInput.value ? parseFloat(rpeInput.value) : null;
      r.note = noteInput.value;
      set("sessions." + key, r);
      VL.toast("Guardado"); Sections.plan(container);
    }});
    body.appendChild(el("div", { class: "row mt-2" }, [rpeInput, noteInput, el("div", { style: "flex:0 0 auto" }, saveBtn)]));

    return el("div", { class: "card" }, [head, body]);

    function toggleDone(week, dia, key) {
      const r = get("sessions." + key) || {};
      r.done = !r.done;
      if (r.done && !r.date) r.date = VL.todayISO();
      set("sessions." + key, r);
      VL.toast(r.done ? "Sesión completada 💪" : "Sesión desmarcada");
      Sections.plan(container);
    }
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
};
