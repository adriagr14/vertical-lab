/* ============================================================
   baloncesto.js — Baloncesto específico (§4.10)
   Categorías con drills (objetivo, claves, vídeo, día y bloque).
   ============================================================ */
window.Sections = window.Sections || {};

Sections.baloncesto = function (container) {
  const { el } = VL;
  container.innerHTML = "";

  container.appendChild(el("div", { class: "section-head" }, [
    el("div", { class: "eyebrow", text: "Transferencia a pista" }),
    el("h1", { text: "Baloncesto específico" }),
    el("p", { text: "Finalizaciones atacando el aro, salto aplicado, defensa (COD, close-outs) y acondicionamiento de partido." })
  ]));

  // Nota de coordinación con el gimnasio
  container.appendChild(el("div", { class: "card", style: "border-left:3px solid var(--info)" }, [
    el("div", { class: "card-title mb-0", style: "font-size:.92rem", html: "🔗 Coordinado con el gimnasio" }),
    el("p", { class: "mt-1 mb-0 dim", style: "font-size:.86rem", text: BALONCESTO.nota })
  ]));

  BALONCESTO.categorias.forEach(cat => {
    container.appendChild(el("div", { class: "flex flex-wrap mt-2", style: "gap:8px;align-items:center;margin-top:22px" }, [
      el("span", { style: "font-size:1.5rem", text: cat.icono }),
      el("div", {}, [
        el("h2", { class: "mb-0", text: cat.nombre }),
        el("small", { class: "muted", text: cat.descripcion })
      ]),
      el("span", { class: "badge", style: "margin-left:auto", text: "📅 " + cat.dia })
    ]));

    cat.drills.forEach(d => container.appendChild(renderDrill(d)));
  });

  function renderDrill(d) {
    const body = el("div", { class: "mt-2 hidden-body" }, [
      el("div", { class: "mt-1" }, [
        el("div", { style: "font-weight:700;font-size:.82rem;color:var(--text-dim);margin-bottom:3px", text: "🎯 Objetivo" }),
        el("p", { class: "dim mb-0", style: "font-size:.9rem", text: d.objetivo })
      ]),
      el("div", { class: "mt-2" }, [
        el("div", { style: "font-weight:700;font-size:.82rem;color:var(--text-dim);margin-bottom:3px", text: "💡 Claves" }),
        el("ul", { style: "margin:0;padding-left:4px;list-style:none" },
          d.claves.map(c => el("li", { class: "dim", style: "font-size:.87rem;margin-bottom:2px", html: `<span style="color:var(--ok)">•</span> ${c}` })))
      ])
    ]);

    if (d.video && d.video.verificado) {
      body.appendChild(el("a", { class: "btn btn-sm mt-2", href: d.video.url, target: "_blank", rel: "noopener" }, [el("span", { text: "▶️ Ver demostración" })]));
      body.appendChild(el("small", { class: "muted", style: "display:block;margin-top:4px", text: d.video.titulo }));
    } else {
      body.appendChild(el("div", { class: "muted mt-2", style: "font-size:.82rem", text: "🎥 Sin vídeo (drill de pista guiado por las claves)." }));
    }

    const head = el("div", { class: "flex-between", style: "cursor:pointer;gap:10px", onclick: () => body.classList.toggle("hidden-body") }, [
      el("div", { style: "min-width:0" }, [
        el("div", { style: "font-weight:700", text: d.nombre }),
        el("small", { class: "muted", text: "Bloque " + d.bloque })
      ]),
      el("span", { class: "muted", text: "▾" })
    ]);

    return el("div", { class: "card" }, [head, body]);
  }
};
