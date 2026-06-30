/* ============================================================
   hevy-sync.js — Sincronización directa con la API de Hevy (§4.8)
   Lee los entrenos vía GET /v1/workouts (la API permite CORS desde el navegador).
   Reutiliza el mapeo y la lógica de "mejor serie por sesión" del importador CSV.

   SEGURIDAD: la clave API se introduce en la web y se guarda SOLO en este
   dispositivo (localStorage). Nunca se incrusta en el código ni se sube al repo.
   ============================================================ */
(function () {
  "use strict";

  const BASE = "https://api.hevyapp.com/v1";

  async function fetchAllWorkouts(key, onProgress) {
    const all = [];
    let page = 1, pageCount = 1;
    do {
      const r = await fetch(`${BASE}/workouts?page=${page}&pageSize=10`, { headers: { "api-key": key, "Accept": "application/json" } });
      if (r.status === 401 || r.status === 403) throw new Error("Clave API no válida o sin permiso (" + r.status + ").");
      if (!r.ok) throw new Error("Error de la API de Hevy: " + r.status);
      const j = await r.json();
      pageCount = j.page_count || 1;
      (j.workouts || []).forEach(w => all.push(w));
      if (onProgress) onProgress(page, pageCount);
      page++;
    } while (page <= pageCount);
    return all;
  }

  function est1rm(w, r) { return (window.VL && VL.epley1RM) ? VL.epley1RM(w, r) : (w ? w * (1 + r / 30) : null); }
  function isBw(id) { const l = (window.LIFTS || []).find(x => x.id === id); return l && l.bw; }

  // workouts (JSON de la API) → { groups, unmapped }
  function buildGroups(workouts) {
    const groups = {};
    const unmapped = new Set();
    workouts.forEach(w => {
      const date = (w.start_time || "").slice(0, 10);   // ISO → YYYY-MM-DD
      if (!date) return;
      (w.exercises || []).forEach(ex => {
        const liftId = VLHeavyImport.matchLift(ex.title);
        if (!liftId) { unmapped.add(ex.title); return; }
        const bw = isBw(liftId);
        const gkey = "hevy:" + w.id + "|" + ex.title;     // src estable (id de entreno)
        (ex.sets || []).forEach(s => {
          if ((s.type || "").toLowerCase() === "warmup") return;
          const reps = s.reps, weight = s.weight_kg;
          if (!reps) return;
          if (!bw && !(weight > 0)) return;
          groups[liftId] = groups[liftId] || {};
          const prev = groups[liftId][gkey];
          const entry = { date, weight: bw ? (weight > 0 ? weight : 0) : weight, sets: 1, reps, rpe: s.rpe != null ? s.rpe : null, src: gkey };
          const score = bw ? reps : est1rm(weight, reps);
          if (!prev) groups[liftId][gkey] = entry;
          else { prev.sets += 1; const ps = bw ? prev.reps : est1rm(prev.weight, prev.reps); if (score > ps) { entry.sets = prev.sets; groups[liftId][gkey] = entry; } }
        });
      });
    });
    return { groups, unmapped: [...unmapped].sort() };
  }

  function applyGroups(groups) {
    let added = 0, skipped = 0;
    const perLift = {};
    Object.keys(groups).forEach(liftId => {
      const arr = VL.get("lifts." + liftId) || [];
      const seen = new Set(arr.map(e => e.src).filter(Boolean));
      let n = 0;
      Object.values(groups[liftId]).forEach(en => { if (seen.has(en.src)) { skipped++; return; } arr.push(en); added++; n++; });
      if (n) { arr.sort((a, b) => a.date.localeCompare(b.date)); VL.set("lifts." + liftId, arr); perLift[liftId] = n; }
    });
    return { added, skipped, perLift };
  }

  async function sync(key, onProgress) {
    const workouts = await fetchAllWorkouts(key, onProgress);
    const { groups, unmapped } = buildGroups(workouts);
    const res = applyGroups(groups);
    return Object.assign(res, { unmapped, workouts: workouts.length });
  }

  window.VLHevySync = { fetchAllWorkouts, buildGroups, sync };
})();
