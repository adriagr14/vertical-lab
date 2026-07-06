/* ============================================================
   hevy-routines.js — Crear rutinas en Hevy desde el plan (§4.8, dirección web→Hevy)
   Usa POST /v1/routines. Empareja cada ejercicio del plan con un
   exercise_template de Hevy (GET /v1/exercise_templates), bilingüe ES/EN.
   - Solo empuja ejercicios de gimnasio/pliometría que existan en Hevy.
   - Los de pista (finalizaciones, sprint, defensa) se omiten (no son de Hevy).
   - Lo que no encuentre, lo devuelve como "sin mapear" para añadir a mano.

   La clave API se reutiliza de settings.hevyApiKey (solo en local).
   ============================================================ */
(function () {
  "use strict";

  const BASE = "https://api.hevyapp.com/v1";
  let _templates = null;   // cache de plantillas de ejercicios

  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function firstInt(s) { const m = String(s).match(/\d+/); return m ? parseInt(m[0], 10) : null; }
  function parseRest(s) {
    if (!s) return null;
    const t = String(s).replace(",", ".");
    const num = parseFloat(t);
    if (isNaN(num)) return null;
    if (t.includes("'")) return Math.round(num * 60);   // minutos
    return Math.round(num);                              // segundos
  }

  /* Reglas: nombre del ejercicio del plan → grupos de tokens a buscar en Hevy.
     Las regex se evalúan sobre el nombre NORMALIZADO (minúsculas, sin acentos).
     "skip" = no es de Hevy (pista/sprint) → se omite sin avisar.
     Orden importante: en nombres compuestos gana la primera regla (la principal). */
  const RULES = [
    { re: /finaliza|euro|defens|close|slide|sprint|carrera|rebote|\bcod\b|acondicion|repeat|intermitente|tocar aro|\bmate\b|suicidi|tempo run/, groups: "skip" },
    { re: /pallof/, groups: [["pallof"]] },
    { re: /rueda abdominal|ab wheel|ab rollout|anti-?extensi/, groups: [["ab wheel"], ["rueda abdominal"]] },
    { re: /romanian|rumano|\brdl\b/, groups: [["romanian"], ["rumano"]] },
    { re: /nordic/, groups: [["nordic"]] },
    { re: /hip thrust|empuje de cadera/, groups: [["hip thrust"], ["empuje de cadera"]] },
    { re: /bulgar|split squat/, groups: [["bulgarian"], ["bulgara"]] },
    { re: /gemelo|calf|soleo|pantorrilla|elevacion de tal/, groups: [["calf"], ["gemelo"], ["pantorrilla"], ["talon"]] },
    { re: /jump squat|salto con barra|salto.*hexagonal/, groups: [["jump squat"], ["trap bar"]] },
    { re: /peso muerto|deadlift|hexagonal/, groups: [["trap bar"], ["hex"], ["peso muerto"], ["deadlift"]] },
    { re: /pogo/, groups: [["pogo"]] },
    { re: /depth jump|profundidad/, groups: [["depth jump"], ["salto", "profundidad"]] },
    { re: /cajon|box jump|drop land/, groups: [["box jump"], ["salto", "cajon"]] },
    { re: /valla|hurdle/, groups: [["hurdle"], ["valla"]] },
    { re: /line hop/, groups: [["line hop"]] },
    { re: /bounding|bound/, groups: [["bound"]] },
    { re: /broad jump|salto horizontal|long jump/, groups: [["broad jump"], ["long jump"], ["salto horizontal"]] },
    { re: /cargada|clean|high pull/, groups: [["clean"], ["cargada"]] },
    { re: /face pull/, groups: [["face pull"]] },
    { re: /\bremo\b|bent over row/, groups: [["bent over row"], ["remo con barra"], ["remo"]] },
    { re: /curl.*biceps|biceps.*curl/, groups: [["bicep curl"], ["curl de biceps"], ["curl"]] },
    { re: /press mancuerna/, groups: [["shoulder press", "dumbbell"], ["press de hombro"], ["shoulder press"]] },
    { re: /press.*banca|bench press/, groups: [["bench press"], ["press de banca"]] },
    { re: /press.*militar|overhead|shoulder press|press.*hombro/, groups: [["press militar"], ["overhead press"], ["press de hombro", "barra"], ["shoulder press"], ["press de hombro"]] },
    { re: /dominada|pull ?up|chin ?up/, groups: [["pull up"], ["dominada"], ["chin up"]] },
    { re: /core|plancha/, groups: [["plank"], ["plancha"]] },
    { re: /sentadilla|squat/, groups: [["squat", "barbell"], ["sentadilla", "barra"], ["squat"], ["sentadilla"]] }
  ];

  function candidates(name) {
    const n = norm(name);
    for (const r of RULES) if (r.re.test(n)) return r.groups;
    return null;   // desconocido → se reporta como "sin mapear"
  }

  function findTemplate(name) {
    const groups = candidates(name);
    if (groups === "skip") return "skip";
    if (!groups) return null;
    for (const tokens of groups) {
      // preferir plantillas oficiales (no personalizadas)
      const matches = _templates.filter(t => {
        const tt = norm(t.title);
        return tokens.every(tok => tt.includes(norm(tok)));
      });
      if (matches.length) {
        matches.sort((a, b) => (a.is_custom === b.is_custom) ? 0 : (a.is_custom ? 1 : -1));
        return matches[0];
      }
    }
    return null;
  }

  async function fetchTemplates(key, onProgress) {
    if (_templates) return _templates;
    const all = [];
    let page = 1, pageCount = 1;
    do {
      const r = await fetch(`${BASE}/exercise_templates?page=${page}&pageSize=100`, { headers: { "api-key": key, "Accept": "application/json" } });
      if (r.status === 401 || r.status === 403) throw new Error("Clave API no válida (" + r.status + ").");
      if (!r.ok) throw new Error("Error al leer ejercicios de Hevy: " + r.status);
      const j = await r.json();
      pageCount = j.page_count || 1;
      (j.exercise_templates || []).forEach(t => all.push(t));
      if (onProgress) onProgress(page, pageCount);
      page++;
    } while (page <= pageCount);
    _templates = all;
    return all;
  }

  function buildRoutine(week, dia) {
    const exercises = [];
    const matched = [], unmatched = [], skipped = [];
    (dia.bloques || []).forEach(grupo => {
      (grupo.ejercicios || []).forEach(ej => {
        const t = findTemplate(ej.nombre);
        if (t === "skip") { skipped.push(ej.nombre); return; }
        if (!t) { unmatched.push(ej.nombre); return; }
        const nSets = firstInt(ej.series) || 3;
        const reps = firstInt(ej.reps);
        const sets = [];
        for (let i = 0; i < Math.min(nSets, 10); i++) sets.push({ type: "normal", weight_kg: null, reps: reps, distance_meters: null, duration_seconds: null, custom_metric: null });
        exercises.push({
          exercise_template_id: t.id, superset_id: null,
          rest_seconds: parseRest(ej.descanso), notes: ej.cue || "",
          sets
        });
        matched.push({ plan: ej.nombre, hevy: t.title });
      });
    });
    const payload = { routine: { title: `Vertical Lab · S${week.n} ${dia.dia} — ${dia.nombre}`.slice(0, 90), folder_id: null, notes: dia.foco || "", exercises } };
    return { payload, matched, unmatched, skipped };
  }

  async function createRoutine(key, week, dia, onProgress) {
    await fetchTemplates(key, onProgress);
    const { payload, matched, unmatched, skipped } = buildRoutine(week, dia);
    if (!matched.length) return { ok: false, created: false, matched, unmatched, skipped, msg: "Ningún ejercicio de esta sesión existe en Hevy." };
    const r = await fetch(`${BASE}/routines`, {
      method: "POST",
      headers: { "api-key": key, "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!r.ok) {
      let detail = ""; try { detail = await r.text(); } catch (e) {}
      throw new Error("Hevy respondió " + r.status + (detail ? (": " + detail.slice(0, 140)) : ""));
    }
    return { ok: true, created: true, matched, unmatched, skipped, title: payload.routine.title };
  }

  // Para test offline: permite inyectar plantillas simuladas
  function _setTemplates(t) { _templates = t; }

  window.VLHevyRoutines = { createRoutine, buildRoutine, findTemplate, candidates, _setTemplates };
})();
