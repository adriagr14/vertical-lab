/* ============================================================
   guias.js — Guías y consejos (§4.6 / §8)
   Lista de guías plegables con bloques (subtítulo + párrafo/lista).
   ============================================================ */
window.Sections = window.Sections || {};

Sections.guias = function (container) {
  const { el } = VL;
  container.innerHTML = "";

  container.appendChild(el("div", { class: "section-head" }, [
    el("div", { class: "eyebrow", text: "Criterio técnico" }),
    el("h1", { text: "Guías y consejos" }),
    el("p", { text: "Técnica de salto, pliometría, aterrizaje, tendones, RAMP, recuperación y cómo leer tus datos." })
  ]));

  GUIAS.forEach(g => container.appendChild(renderGuia(g)));

  function renderGuia(g) {
    const body = el("div", { class: "mt-2 hidden-body" });
    g.bloques.forEach(b => {
      body.appendChild(el("div", { class: "mt-2" }, [
        el("div", { style: "font-weight:700;color:var(--accent-2);font-size:.9rem;margin-bottom:3px", text: b.h }),
        b.p ? el("p", { class: "dim mb-0", style: "font-size:.9rem;line-height:1.55", text: b.p }) : null,
        b.items ? el("ul", { style: "margin:4px 0 0;padding-left:18px" },
          b.items.map(i => el("li", { class: "dim", style: "font-size:.88rem;margin-bottom:3px", text: i }))) : null
      ]));
    });

    const head = VL.accordionHead(
      el("div", { class: "flex", style: "gap:10px;min-width:0" }, [
        el("span", { style: "font-size:1.4rem", text: g.icono }),
        el("div", { style: "min-width:0" }, [
          el("div", { style: "font-weight:700", text: g.titulo }),
          el("small", { class: "muted", text: g.resumen })
        ])
      ]),
      body
    );

    return el("div", { class: "card" }, [head, body]);
  }
};
