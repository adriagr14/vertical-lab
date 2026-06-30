/* ============================================================
   heavy-import.js — Importador del CSV exportado por la app Heavy (§4.8)
   - Parsea el CSV (campos entrecomillados con comas internas).
   - Mapea los ejercicios de Heavy a tus levantamientos (LIFTS).
   - Por cada ejercicio y sesión, toma la MEJOR serie de trabajo (mayor 1RM est.;
     en dominadas, más reps), ignorando calentamientos.
   - Deduplica: puedes reimportar todo el historial cada semana y solo añade lo nuevo.

   El mapeo es EDITABLE: ajusta matchLift() si usas otros nombres en Heavy.
   ============================================================ */
(function () {
  "use strict";

  const MESES = { ene: "01", feb: "02", mar: "03", abr: "04", may: "05", jun: "06", jul: "07", ago: "08", sep: "09", sept: "09", oct: "10", nov: "11", dic: "12" };

  /* ---------- Parser CSV robusto ---------- */
  function parseCSV(text) {
    const rows = [];
    let row = [], field = "", inQuotes = false;
    text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQuotes = false;
        } else field += c;
      } else {
        if (c === '"') inQuotes = true;
        else if (c === ",") { row.push(field); field = ""; }
        else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
        else field += c;
      }
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  /* ---------- Fecha "23 jun 2026, 8:48" → "2026-06-23" ---------- */
  function parseDate(s) {
    if (!s) return null;
    const m = s.match(/(\d{1,2})\s+([a-záéíóú]+)\.?\s+(\d{4})/i);
    if (!m) return null;
    const dd = m[1].padStart(2, "0");
    const mm = MESES[m[2].toLowerCase().replace(".", "")];
    if (!mm) return null;
    return `${m[3]}-${mm}-${dd}`;
  }

  /* ---------- Mapeo Heavy → liftId (bilingüe ES/EN; CSV usa inglés, la API español) ---------- */
  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function matchLift(name) {
    const n = norm(name);
    const barra = n.includes("barbell") || n.includes("barra");
    if (n.includes("romanian") || n.includes("rumano") || n.includes("stiff")) return "rdl";
    if (n.includes("hip thrust") || n.includes("empuje de cadera")) return "hip-thrust";
    if (n.includes("bulgar")) return "bulgaras";
    if (n.includes("deadlift") || n.includes("peso muerto")) return "pm-hex";
    if ((n.includes("bench press") || n.includes("press de banca") || n.includes("press banca")) && barra) return "press-banca";
    if (n.includes("overhead press") || n.includes("military") || n.includes("press militar") || ((n.includes("shoulder press") || n.includes("press de hombro")) && barra)) return "press-militar";
    if (n.includes("pull up") || n.includes("pull-up") || n.includes("pullup") || n.includes("chin up") || n.includes("dominada")) return "dominadas";
    if (n.includes("calf") || n.includes("gemelo") || n.includes("pantorrilla") || n.includes("elevacion de talon")) return "gemelo";
    if ((n.includes("squat") || n.includes("sentadilla")) && barra && !n.includes("split") && !n.includes("hack") && !n.includes("bulgar")) return "sentadilla";
    return null;
  }

  function isBwLift(liftId) {
    const l = (window.LIFTS || []).find(x => x.id === liftId);
    return l && l.bw;
  }
  function est1rm(w, r) { return (window.VL && VL.epley1RM) ? VL.epley1RM(w, r) : (w ? w * (1 + r / 30) : null); }

  /* ---------- Construir entradas (sin escribir) ---------- */
  function buildEntries(text) {
    const rows = parseCSV(text);
    if (!rows.length) return { groups: {}, unmapped: [], rowsLeidas: 0 };
    const header = rows[0].map(h => h.trim());
    const idx = {};
    header.forEach((h, i) => idx[h] = i);
    const col = (r, name) => r[idx[name]];

    const groups = {};       // liftId -> { "date|exercise|start": entry }
    const unmapped = new Set();
    let dataRows = 0;

    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.length < header.length) continue;
      const exercise = (col(r, "exercise_title") || "").trim();
      if (!exercise) continue;
      dataRows++;

      const liftId = matchLift(exercise);
      const setType = (col(r, "set_type") || "").trim().toLowerCase();
      const weight = parseFloat(col(r, "weight_kg"));
      const reps = parseInt(col(r, "reps"), 10);
      const rpe = col(r, "rpe") !== "" ? parseFloat(col(r, "rpe")) : null;
      const date = parseDate(col(r, "start_time"));
      const start = (col(r, "start_time") || "").trim();
      const bw = isBwLift(liftId);

      if (!liftId) { if (!isNonLift(exercise)) unmapped.add(exercise); continue; }
      if (setType === "warmup") continue;             // ignorar calentamientos
      if (!reps) continue;                            // necesita reps
      if (!bw && !(weight > 0)) continue;             // levantamientos con carga necesitan peso
      if (!date) continue;

      const gkey = `${date}|${exercise}|${start}`;
      groups[liftId] = groups[liftId] || {};
      const prev = groups[liftId][gkey];
      const score = bw ? reps : est1rm(weight, reps);
      const entry = { date, weight: bw ? (weight > 0 ? weight : 0) : weight, sets: 1, reps, rpe, src: gkey };

      if (!prev) { entry.sets = 1; groups[liftId][gkey] = entry; }
      else {
        prev.sets += 1;                               // cuenta series de trabajo
        const prevScore = bw ? prev.reps : est1rm(prev.weight, prev.reps);
        if (score > prevScore) { entry.sets = prev.sets; groups[liftId][gkey] = entry; } // quédate con la mejor
      }
    }
    return { groups, unmapped: [...unmapped].sort(), rowsLeidas: dataRows };
  }

  // Ejercicios que sabemos que no son levantamientos rastreados (no avisar como "sin mapear")
  function isNonLift(name) {
    const n = name.toLowerCase();
    return ["movilidad", "warm up", "calentamiento", "box jump", "depth jump", "hurdle jump", "burpee", "dball", "crunch", "plank", "running", "stretch", "mobility"]
      .some(k => n.includes(k));
  }

  /* ---------- Aplicar (escribe en VL con dedup) ---------- */
  function apply(text) {
    const { groups, unmapped, rowsLeidas } = buildEntries(text);
    let added = 0, skipped = 0;
    const perLift = {};

    Object.keys(groups).forEach(liftId => {
      const arr = VL.get("lifts." + liftId) || [];
      // Dedup por FECHA (no por "src"): así no importa si el mismo entreno llegó
      // antes por CSV y ahora por la API de Hevy (o al revés), no se duplica.
      const existingDates = new Set(arr.map(e => e.date).filter(Boolean));
      let liftAdded = 0;
      Object.values(groups[liftId]).forEach(entry => {
        if (existingDates.has(entry.date)) { skipped++; return; }
        existingDates.add(entry.date);
        arr.push(entry); added++; liftAdded++;
      });
      if (liftAdded) {
        arr.sort((a, b) => a.date.localeCompare(b.date));
        VL.set("lifts." + liftId, arr);
        perLift[liftId] = liftAdded;
      }
    });

    return { added, skipped, perLift, unmapped, rowsLeidas };
  }

  window.VLHeavyImport = { parseCSV, parseDate, matchLift, buildEntries, apply };
})();
