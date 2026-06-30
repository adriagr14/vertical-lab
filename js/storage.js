/* ============================================================
   storage.js — persistencia en localStorage + utilidades globales
   Namespace global: window.VL
   ============================================================ */
(function () {
  "use strict";

  const KEY = "verticalLab.v1";

  // Estructura por defecto de los datos del usuario
  const DEFAULT_DB = {
    meta: { createdAt: null, startDate: null, version: 1 },
    settings: { athleteWeightKg: 82, rimHeightCm: 305 },
    sessions: {},        // { "s1d2": { done:true, rpe:8, note:"", date:"..." } }
    tests: {},           // { cmj: [ {date, value, ...} ], ... }
    lifts: {},           // { sentadilla: [ {date, weight, sets, reps, rpe} ], ... }
    liftBaseline: {},    // cargas iniciales declaradas en §4.9
    bodyweight: [],      // [ {date, value} ]
    notes: {}
  };

  function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

  let _db = null;

  function load() {
    if (_db) return _db;
    try {
      const raw = localStorage.getItem(KEY);
      _db = raw ? Object.assign(deepClone(DEFAULT_DB), JSON.parse(raw)) : deepClone(DEFAULT_DB);
    } catch (e) {
      console.warn("No se pudo leer localStorage, uso valores por defecto.", e);
      _db = deepClone(DEFAULT_DB);
    }
    return _db;
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(_db));
    } catch (e) {
      console.error("No se pudo guardar en localStorage.", e);
      VL.toast("⚠️ No se pudo guardar (¿modo incógnito?)");
    }
  }

  // Acceso por ruta tipo "settings.athleteWeightKg"
  function get(path, fallback) {
    const db = load();
    const v = path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), db);
    return v === undefined ? fallback : v;
  }
  let _suppressTouch = false;
  let _onChange = null;
  function set(path, value) {
    const db = load();
    const keys = path.split(".");
    const last = keys.pop();
    const target = keys.reduce((o, k) => (o[k] = o[k] || {}), db);
    target[last] = value;
    if (!_suppressTouch && path !== "meta.updatedAt") {
      db.meta = db.meta || {};
      db.meta.updatedAt = Date.now();
    }
    save();
    if (!_suppressTouch && typeof _onChange === "function") { try { _onChange(); } catch (e) {} }
  }
  // Ejecuta cambios SIN marcarlos como edición del usuario (seeding, datos de la nube)
  function suppressTouch(fn) { _suppressTouch = true; try { fn(); } finally { _suppressTouch = false; } }
  function onChange(cb) { _onChange = cb; }
  // Sustituye toda la base de datos (desde la nube) sin disparar onChange
  function replaceAll(obj, updatedAt) {
    suppressTouch(() => {
      _db = Object.assign(deepClone(DEFAULT_DB), obj);
      _db.meta = _db.meta || {};
      if (updatedAt != null) _db.meta.updatedAt = updatedAt;
      save();
    });
  }

  /* ---------- Export / Import JSON ---------- */
  function exportJSON() {
    const db = load();
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url; a.download = `vertical-lab-${stamp}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }
  function importJSON(text) {
    const parsed = JSON.parse(text);
    if (typeof parsed !== "object" || parsed === null) throw new Error("JSON inválido");
    _db = Object.assign(deepClone(DEFAULT_DB), parsed);
    save();
  }
  function reset() {
    _db = deepClone(DEFAULT_DB);
    save();
  }

  /* ---------- Helpers DOM / formato ---------- */
  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else if (v != null) node.setAttribute(k, v);
    }
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  // Cabecera de acordeón compartida: click + teclado (Enter/Espacio) + aria-expanded.
  // `content` es un nodo o array de nodos para la izquierda; `body` es el contenedor
  // que se muestra/oculta (debe llevar la clase "hidden-body" si arranca cerrado).
  // Devuelve el nodo <head>; head.setOpen(bool) permite abrirlo programáticamente
  // (p. ej. para enlazar directo a la sesión de hoy desde el dashboard).
  function accordionHead(content, body, opts = {}) {
    const chevron = el("span", { class: "muted accordion-chevron", text: "▾", "aria-hidden": "true" });
    const left = Array.isArray(content) ? content : [content];
    const startOpen = !!opts.open;
    function setOpen(open) {
      body.classList.toggle("hidden-body", !open);
      head.setAttribute("aria-expanded", open ? "true" : "false");
    }
    const head = el("div", {
      class: "flex-between accordion-head",
      tabindex: "0",
      role: "button",
      "aria-expanded": startOpen ? "true" : "false",
      onclick: () => setOpen(body.classList.contains("hidden-body")),
      onkeydown: (e) => { if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); setOpen(body.classList.contains("hidden-body")); } }
    }, left.concat([chevron]));
    head.setOpen = setOpen;
    if (startOpen) setOpen(true);
    return head;
  }

  let _toastTimer = null;
  function toast(msg) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }

  function todayISO() { return new Date().toISOString().slice(0, 10); }
  function fmtDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
  }

  // 1RM estimado (Epley) — útil en gimnasio y progreso
  function epley1RM(weight, reps) {
    weight = parseFloat(weight); reps = parseInt(reps, 10);
    if (!weight || !reps) return null;
    return reps === 1 ? weight : Math.round(weight * (1 + reps / 30) * 10) / 10;
  }

  // Copiar texto al portapapeles (con fallback para file://)
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast("📋 Copiado al portapapeles");
    } catch (e) {
      const ta = el("textarea", { style: "position:fixed;opacity:0" });
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); toast("📋 Copiado"); }
      catch (_) { toast("No se pudo copiar"); }
      ta.remove();
    }
  }

  // Cálculo de la semana actual del plan a partir de startDate
  function currentWeek() {
    const start = get("meta.startDate");
    if (!start) return null;
    const ms = Date.now() - new Date(start + "T00:00:00").getTime();
    const week = Math.floor(ms / (7 * 864e5)) + 1;
    return Math.min(Math.max(week, 1), 8);
  }
  function blockForWeek(w) {
    if (!w) return null;
    if (w <= 3) return 1;
    if (w <= 6) return 2;
    return 3;
  }

  window.VL = {
    load, save, get, set,
    exportJSON, importJSON, reset,
    suppressTouch, onChange, replaceAll,
    el, accordionHead, toast, todayISO, fmtDate, epley1RM, copyText,
    currentWeek, blockForWeek,
    DEFAULT_DB
  };
})();
