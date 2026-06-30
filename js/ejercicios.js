/* ============================================================
   ejercicios.js — Biblioteca de ejercicios (§4.5)
   Buscador + filtro por categoría + fichas con vídeo (abre en YouTube).
   ============================================================ */
window.Sections = window.Sections || {};

Sections.ejercicios = function (container) {
  const { el } = VL;
  container.innerHTML = "";

  if (Sections.ejercicios._cat == null) Sections.ejercicios._cat = "Todas";
  if (Sections.ejercicios._q == null) Sections.ejercicios._q = "";

  container.appendChild(el("div", { class: "section-head" }, [
    el("div", { class: "eyebrow", text: "Técnica correcta" }),
    el("h1", { text: "Biblioteca de ejercicios" }),
    el("p", { text: "Objetivo, claves técnicas (cues), errores comunes, progresión y vídeo de demostración. Los enlaces abren en YouTube." })
  ]));

  // Buscador
  const search = el("input", { type: "text", placeholder: "🔍 Buscar ejercicio…", value: Sections.ejercicios._q,
    oninput: (e) => { Sections.ejercicios._q = e.target.value; renderList(); } });
  container.appendChild(el("div", { class: "card", style: "padding:12px" }, [search]));

  // Filtro de categorías
  const cats = ["Todas"].concat(EJERCICIOS_CATS);
  const catBar = el("div", { class: "flex flex-wrap", style: "gap:6px;margin-bottom:14px" });
  cats.forEach(c => {
    const sel = Sections.ejercicios._cat === c;
    catBar.appendChild(el("button", {
      class: "btn btn-sm" + (sel ? " btn-primary" : ""), style: "min-width:auto",
      text: c, onclick: () => { Sections.ejercicios._cat = c; Sections.ejercicios(container); }
    }));
  });
  container.appendChild(catBar);

  const listWrap = el("div");
  container.appendChild(listWrap);
  renderList();

  function renderList() {
    const q = (Sections.ejercicios._q || "").toLowerCase().trim();
    const cat = Sections.ejercicios._cat;
    const items = EJERCICIOS.filter(ex => {
      if (cat !== "Todas" && ex.cat !== cat) return false;
      if (q && !(ex.nombre.toLowerCase().includes(q) || ex.objetivo.toLowerCase().includes(q) || ex.cat.toLowerCase().includes(q))) return false;
      return true;
    });

    listWrap.innerHTML = "";
    listWrap.appendChild(el("div", { class: "muted", style: "font-size:.82rem;margin-bottom:8px", text: items.length + " ejercicio" + (items.length === 1 ? "" : "s") }));

    if (!items.length) {
      listWrap.appendChild(el("div", { class: "card text-c muted", text: "Sin resultados." }));
      return;
    }
    items.forEach(ex => listWrap.appendChild(renderFicha(ex)));
  }

  function renderFicha(ex) {
    const body = el("div", { class: "mt-2 hidden-body" });

    body.appendChild(block("🎯 Objetivo", el("p", { class: "dim mb-0", style: "font-size:.9rem", text: ex.objetivo })));
    body.appendChild(block("💡 Claves técnicas", listOf(ex.cues, "var(--ok)")));
    body.appendChild(block("⚠️ Errores comunes", listOf(ex.errores, "var(--warn)")));
    body.appendChild(block("📈 Progresión / regresión", el("p", { class: "dim mb-0", style: "font-size:.88rem", text: ex.progresion })));

    // Vídeo
    if (ex.video && ex.video.verificado) {
      body.appendChild(el("a", {
        class: "btn btn-sm mt-2", href: ex.video.url, target: "_blank", rel: "noopener"
      }, [el("span", { text: "▶️ Ver demostración" })]));
      body.appendChild(el("small", { class: "muted", style: "display:block;margin-top:4px", text: ex.video.titulo }));
    } else {
      body.appendChild(el("div", { class: "badge warn mt-2", text: "Vídeo pendiente de verificar" }));
    }

    const head = VL.accordionHead(
      el("div", { class: "flex", style: "gap:10px;min-width:0" }, [
        el("span", { style: "font-size:1.4rem", text: ex.icono }),
        el("div", { style: "min-width:0" }, [
          el("div", { style: "font-weight:700", text: ex.nombre }),
          el("small", { class: "muted", text: ex.cat })
        ])
      ]),
      body
    );

    return el("div", { class: "card" }, [head, body]);
  }

  function block(title, content) {
    return el("div", { class: "mt-2" }, [
      el("div", { style: "font-weight:700;font-size:.82rem;color:var(--text-dim);margin-bottom:3px", text: title }),
      content
    ]);
  }
  function listOf(arr, color) {
    return el("ul", { style: "margin:0;padding-left:4px;list-style:none" },
      arr.map(i => el("li", { class: "dim", style: "font-size:.87rem;margin-bottom:2px;border-left:0", html: `<span style="color:${color}">•</span> ${i}` })));
  }
};
