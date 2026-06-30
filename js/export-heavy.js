/* ============================================================
   export-heavy.js — exporta una sesión de fuerza a texto plano
   para copiarla a la app Heavy.
   Formato: "Ejercicio — series x reps @ %/RPE"
   ============================================================ */
(function () {
  "use strict";

  function sessionToText(session) {
    if (!session) return "";
    const lines = [];
    lines.push(`# ${session.titulo || "Sesión"}${session.dia ? " · " + session.dia : ""}`);
    if (session.bloque) lines.push(`Bloque ${session.bloque} · Semana ${session.semana || "—"}`);
    lines.push("");
    (session.bloques || []).forEach(grupo => {
      if (grupo.nombre) lines.push(`— ${grupo.nombre} —`);
      (grupo.ejercicios || []).forEach(ej => {
        const carga = ej.intensidad ? ` @ ${ej.intensidad}` : "";
        const descanso = ej.descanso ? `  (desc. ${ej.descanso})` : "";
        lines.push(`${ej.nombre}: ${ej.series} x ${ej.reps}${carga}${descanso}`);
      });
      lines.push("");
    });
    return lines.join("\n").trim();
  }

  function copySession(session) {
    VL.copyText(sessionToText(session));
  }

  window.VLHeavy = { sessionToText, copySession };
})();
