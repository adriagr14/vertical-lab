/* ============================================================
   plan-8-semanas.js — PLAN COMPLETO (§5)
   Modelo Verkhoshansky · periodización por bloques · 5 días/sem.
   Microciclo L-M-X-J-V con 2 días de pista (Mar = finalizaciones+defensa,
   Jue = salto aplicado+acond.). Pliometría SIEMPRE antes de la fuerza.

   EDITABLE: cargas, reps, RPE y cues son placeholders. Ajusta libremente.
   - Cambia las PLANTILLAS por bloque (PLAN.plantillas) para tocar ejercicios/cues.
   - Cambia PLAN.progresion para tocar la progresión semanal (carga/descarga/taper).
   El builder de abajo expande todo a PLAN.semanas (lo que lee la web).
   ============================================================ */
(function () {
  "use strict";

  const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  // Calentamiento RAMP base (común a casi todas las sesiones)
  const RAMP = [
    "RAMP: 4–5' movilidad + elevación de pulso (bici/comba)",
    "Tobillo/tendón: tibialis raises + isométrico de sóleo 30\"",
    "Activación: glúteo (monster walk) + core (dead bug)",
    "Específico: 2–3 series de aproximación del 1er ejercicio"
  ];
  const RAMP_PISTA = [
    "RAMP dinámico: skipping, talones, carioca, aperturas",
    "Escalera de agilidad 3–4 patrones",
    "Tobillo/tendón: pogos suaves 2×15 (preparar recepción)",
    "Tiro/manejo de balón en movimiento 4'"
  ];

  // helpers de ejercicio
  function ex(n, s, r, i, d, cue) { return { nombre: n, series: s, reps: r, intensidad: i, descanso: d, cue: cue || "" }; }

  /* ===========================================================
     PLANTILLAS POR BLOQUE  (un microciclo representativo por bloque)
     =========================================================== */
  const plantillas = {

    /* ---------- BLOQUE 1 · Acumulación / Fuerza máx + GPP ---------- */
    1: [
      { // Lunes
        nombre: "Fuerza máxima inferior + Pliometría extensiva", tipo: "fuerza", icono: "🏋️",
        foco: "Producir fuerza máxima y acondicionar tendones. Pliometría de bajo impacto antes de la fuerza.",
        calentamiento: RAMP,
        bloques: [
          { nombre: "Pliometría extensiva (antes de fuerza)", ejercicios: [
            ex("Pogos (saltos de tobillo)", 3, "20", "Baja", "60\"", "Rodilla casi recta, rebota con el tobillo, contacto corto."),
            ex("Line hops (adelante-atrás / lateral)", 2, "20\"", "Baja", "45\"", "Rígido, rápido, mira al frente."),
            ex("Drop land desde cajón bajo (20–30 cm)", 4, "3", "Recepción", "60\"", "CAE y AGUANTA: aterriza silencioso, rodilla sobre el pie, congela 1\".")
          ]},
          { nombre: "Fuerza principal", ejercicios: [
            ex("Sentadilla trasera (o frontal)", "4–5", "4–6", "RPE 7→8", "2,5–3'", "Pecho alto, empuja el suelo, controla la bajada (2\")."),
            ex("Búlgara (split squat) con mancuernas", 3, "8 / pierna", "RPE 7–8", "90\"", "Tronco vertical, rodilla trasera baja, empuje del talón delantero."),
            ex("Gemelo de pie pesado + isométrico sóleo", 4, "8 + 20\"", "RPE 8", "75\"", "Rango completo, pausa abajo; el sóleo es clave para el salto.")
          ]},
          { nombre: "Core pesado", ejercicios: [
            ex("Pallof press / plancha con lastre", 3, "10 / 30\"", "Exigente", "60\"", "Anti-rotación: no dejes que el tronco gire.")
          ]}
        ],
        finisher: "Opcional: tempo runs 4×100 m al 70% (base aeróbica)."
      },
      { // Martes — PISTA
        nombre: "Pista · Finalizaciones + Defensa", tipo: "pista", icono: "🏀",
        foco: "Técnica de finalización atacando el aro y desplazamientos defensivos. Intensidad media, calidad técnica.",
        calentamiento: RAMP_PISTA,
        bloques: [
          { nombre: "Finalizaciones (técnico)", ejercicios: [
            ex("Entradas a 2 pies (rebote-step)", 4, "6 / lado", "Media", "—", "Recoge en el penúltimo paso, salto a dos pies bajo control."),
            ex("Entradas a 1 pie (carrera)", 4, "6 / lado", "Media", "—", "Penúltimo paso largo y bajo, último corto y vertical."),
            ex("Finalización mano izq / dcha + euro-step", 3, "5 / lado", "Media", "—", "Protege el balón, finaliza con la mano de fuera.")
          ]},
          { nombre: "Defensa (COD controlado)", ejercicios: [
            ex("Desplazamientos laterales (slides)", 4, "20\"", "Media", "40\"", "Cadera baja, no juntes los pies, empuje lateral."),
            ex("Close-outs", 3, "6", "Media", "45\"", "Sprint y frena corto, manos arriba, base ancha.")
          ]}
        ],
        finisher: "Tiro libre x10 entre series + shooting suave (recuperación activa)."
      },
      { // Miércoles
        nombre: "Cadena posterior + Tren superior + Core", tipo: "fuerza", icono: "💪",
        foco: "Fuerza de cadena posterior (clave para el salto) y tren superior para el contacto.",
        calentamiento: RAMP,
        bloques: [
          { nombre: "Fuerza principal", ejercicios: [
            ex("Peso muerto con barra hexagonal", 4, "5", "RPE 7→8", "2,5–3'", "Pecho alto, empuja con las piernas, espalda neutra."),
            ex("Hip thrust", 3, "8", "RPE 7–8", "2'", "Pausa 1\" arriba, mentón metido, aprieta glúteo."),
            ex("RDL o Nordic curl (isquios)", 3, "6–8", "RPE 8", "90\"", "Excéntrica lenta (3\"), bisagra de cadera, isquios bajo tensión.")
          ]},
          { nombre: "Tren superior", ejercicios: [
            ex("Press banca o militar", 3, "6–8", "RPE 7–8", "2'", "Escápulas retraídas, recorrido completo."),
            ex("Dominadas", 3, "AMRAP−2", "RPE 8", "2'", "Rango completo, sin balanceo; lastra si pasas de 10.")
          ]},
          { nombre: "Core", ejercicios: [
            ex("Rueda abdominal / anti-extensión", 3, "8–10", "Exigente", "60\"", "No arquees la lumbar.")
          ]}
        ],
        finisher: ""
      },
      { // Jueves — PISTA
        nombre: "Pista · Salto aplicado + Acondicionamiento", tipo: "pista", icono: "🏀",
        foco: "Transferir el salto a la cancha (volumen bajo en B1) + base de acondicionamiento intermitente.",
        calentamiento: RAMP_PISTA,
        bloques: [
          { nombre: "Salto aplicado (intención, volumen bajo)", ejercicios: [
            ex("Rebote a 2 pies (tocar tablero/aro)", 4, "4", "Alta intención", "60\"", "Doble apoyo rápido, brazos arriba, busca el punto más alto."),
            ex("Salto con carrera a tocar aro", 4, "3", "Alta intención", "75\"", "2–3 pasos de carrera, penúltimo paso de freno, todo hacia arriba.")
          ]},
          { nombre: "Acondicionamiento específico", ejercicios: [
            ex("Repeat-sprint en pista (suicidios suaves)", 5, "1", "80%", "60\"", "Imita el esfuerzo del partido, controla la técnica de freno."),
            ex("Esfuerzos intermitentes (defensa-transición)", 4, "30\"", "Media-alta", "60\"", "Trabajo:descanso ~1:2.")
          ]}
        ],
        finisher: "Movilidad de cadera/tobillo 5'."
      },
      { // Viernes
        nombre: "Introducción a la potencia + Sprint técnico", tipo: "potencia", icono: "⚡",
        foco: "Calidad de movimiento explosivo a baja carga y mecánica de sprint. En B1 es introductorio.",
        calentamiento: RAMP,
        bloques: [
          { nombre: "Pliometría de recepción + bounding", ejercicios: [
            ex("Salto a cajón bajo (énfasis recepción)", 4, "3", "Baja", "60\"", "Sube saltando, baja escalonado; aterriza suave."),
            ex("Bounding (zancadas saltadas) suave", 3, "20 m", "Media", "75\"", "Busca distancia y amplitud, no velocidad máxima aún.")
          ]},
          { nombre: "Fuerza-velocidad ligera", ejercicios: [
            ex("Jump squat carga ligera (técnica)", 5, "3", "20–30%", "2'", "Máxima velocidad de subida, sin estrellarte al bajar."),
            ex("CMJ con foco técnico (brazos)", 4, "3", "Corporal", "75\"", "Coordina el brazeo, bloqueo de tronco, extensión completa.")
          ]},
          { nombre: "Sprint", ejercicios: [
            ex("Sprint de aceleración", 6, "20 m", "Técnico 90%", "90\"", "Proyección hacia delante, zancada potente, no te incorpores pronto.")
          ]}
        ],
        finisher: "Tempo runs 6×100 m al 70% (GPP)."
      }
    ],

    /* ---------- BLOQUE 2 · Conversión / Fuerza-velocidad + Potencia ---------- */
    2: [
      { // Lunes
        nombre: "Fuerza-velocidad inferior + Pliometría intensa", tipo: "potencia", icono: "⚡",
        foco: "Convertir fuerza en potencia con carga óptima. Pliometría más intensa. Fuerza máx en mantenimiento.",
        calentamiento: RAMP,
        bloques: [
          { nombre: "Pliometría intensificada (antes de fuerza)", ejercicios: [
            ex("Depth jump altura moderada (30–40 cm)", 4, "4", "Alta", "90\"", "Cae y rebota YA: minimiza el tiempo en el suelo."),
            ex("Saltos repetidos de valla", 4, "5", "Alta", "75\"", "Reactivo, contacto corto, rodillas arriba."),
          ]},
          { nombre: "Conversión a potencia", ejercicios: [
            ex("Jump squat con carga óptima", 5, "3", "~30% 1RM", "2,5'", "Carga que maximiza potencia; intención balística."),
            ex("Sentadilla — series top (mantener fuerza)", 2, "3", "RPE 8", "3'", "Solo 1–2 series pesadas para no perder fuerza máx.")
          ]},
          { nombre: "Unilateral + tobillo", ejercicios: [
            ex("Búlgara con salto / step-up explosivo", 3, "6 / pierna", "Explosivo", "90\"", "Empuje rápido, control en la bajada."),
            ex("Gemelo pesado + pogos reactivos", 3, "8 + 15", "RPE 8", "75\"", "Combina pesado y reactivo.")
          ]}
        ],
        finisher: ""
      },
      { // Martes — PISTA
        nombre: "Pista · Finalizaciones con contacto + Defensa", tipo: "pista", icono: "🏀",
        foco: "Finalizar atacando el aro a alta intención, con contacto y ambas manos. Defensa con cambios de dirección.",
        calentamiento: RAMP_PISTA,
        bloques: [
          { nombre: "Finalizaciones (alta intención)", ejercicios: [
            ex("Entradas a máxima intención + contacto (almohadilla)", 4, "5 / lado", "Alta", "60\"", "Aguanta el contacto, finaliza fuerte, busca el and-one."),
            ex("Recogida penúltimo paso → mate/tocar aro", 4, "4", "Máxima", "75\"", "Transfiere el salto del gimnasio: explota hacia arriba."),
            ex("Finalización ambas manos bajo presión", 3, "5 / lado", "Alta", "—", "Lee la ayuda, cambia de mano si hace falta.")
          ]},
          { nombre: "Defensa (COD)", ejercicios: [
            ex("Lane agility / zig-zag defensivo", 4, "1", "Alta", "60\"", "Cadera baja, no cruces los pies, reacciona rápido."),
            ex("Close-out → slide → recovery", 3, "6", "Alta", "60\"", "Controla el cierre, no saltes al primer finteo.")
          ]}
        ],
        finisher: "Tiro en movimiento tras finta 5'."
      },
      { // Miércoles
        nombre: "Cadena posterior + Halterofilia + Tren superior", tipo: "fuerza", icono: "💪",
        foco: "Velocidad de cadena posterior y triple extensión (variantes oly si la técnica es sólida).",
        calentamiento: RAMP,
        bloques: [
          { nombre: "Triple extensión (si técnica sólida)", ejercicios: [
            ex("Cargada de fuerza desde colgado / High pull", 4, "3", "RPE 7–8", "2,5'", "Explosión de cadera, codos altos; si no dominas la técnica, usa el high pull.")
          ]},
          { nombre: "Cadena posterior", ejercicios: [
            ex("Peso muerto hexagonal — velocidad", 4, "3", "60–70% rápido", "2,5'", "Mueve la carga RÁPIDO; calidad sobre cantidad."),
            ex("Hip thrust", 3, "6", "RPE 8", "2'", "Pausa arriba, empuje potente.")
          ]},
          { nombre: "Tren superior", ejercicios: [
            ex("Press (banca/militar)", 3, "5", "RPE 8", "2'", "Controla y empuja con intención."),
            ex("Dominadas lastradas", 3, "5", "RPE 8", "2'", "Añade lastre, rango completo.")
          ]}
        ],
        finisher: "Core anti-rotación 3×10."
      },
      { // Jueves — PISTA
        nombre: "Pista · Salto aplicado + Repeat-sprint", tipo: "pista", icono: "🏀",
        foco: "Intentos de salto a máxima intención y acondicionamiento anaeróbico específico.",
        calentamiento: RAMP_PISTA,
        bloques: [
          { nombre: "Salto aplicado (máxima intención)", ejercicios: [
            ex("Rebote ofensivo a 2 pies (repetido)", 4, "3", "Máxima", "75\"", "Doble salto rápido, ataca el tablero arriba."),
            ex("Salto con carrera a tocar aro / mate", 5, "3", "Máxima", "90\"", "Pocos intentos, todos al 100%; descansa si baja la altura.")
          ]},
          { nombre: "Sprint + acondicionamiento", ejercicios: [
            ex("Sprint de aceleración", 6, "10–30 m", "Máxima", "2'", "Calidad máxima; descanso completo entre repes."),
            ex("Repeat-sprint anaeróbico (líneas)", 6, "1", "90–95%", "45\"", "Imita las demandas del partido; aguanta la técnica de freno.")
          ]}
        ],
        finisher: "Respiración + movilidad 5'."
      },
      { // Viernes
        nombre: "Potencia balística + Sprint", tipo: "potencia", icono: "⚡",
        foco: "Potencia con carga e impulso (barra hexagonal, bandas) y velocidad de sprint.",
        calentamiento: RAMP,
        bloques: [
          { nombre: "Pliometría reactiva", ejercicios: [
            ex("Hops a una pierna (lineales)", 4, "5 / pierna", "Alta", "90\"", "Reactivo, rígido en el tobillo, contacto corto."),
            ex("Bounding por distancia", 3, "25 m", "Alta", "90\"", "Amplitud + velocidad, proyecta hacia delante.")
          ]},
          { nombre: "Potencia con carga", ejercicios: [
            ex("Salto con barra hexagonal (jump)", 5, "3", "20–30%", "2,5'", "Despega del suelo, aterriza suave; intención máxima."),
            ex("Sentadilla con bandas / acelerada", 4, "3", "40% + bandas", "2,5'", "Acelera toda la subida, no frenes arriba.")
          ]},
          { nombre: "Sprint", ejercicios: [
            ex("Sprint", 5, "20–30 m", "Máxima", "2–3'", "Velocidad máxima con recuperación completa.")
          ]}
        ],
        finisher: ""
      }
    ],

    /* ---------- BLOQUE 3 · Realización / Reactividad + Pico ---------- */
    3: [
      { // Lunes
        nombre: "Reactividad alta intensidad + Potenciación", tipo: "potencia", icono: "🔥",
        foco: "Pliometría reactiva de alta intensidad y BAJO volumen. Fuerza solo para potenciar (dobles/singles).",
        calentamiento: RAMP,
        bloques: [
          { nombre: "Pliometría reactiva (alta intensidad, bajo volumen)", ejercicios: [
            ex("Depth jump altura óptima", 5, "3", "Máxima", "2,5'", "Minimiza el tiempo de contacto; si aumenta, baja la altura."),
            ex("Drop jump reactivo (medir RSI si puedes)", 4, "3", "Máxima", "2,5'", "Rebota como un muelle; calidad por encima de todo.")
          ]},
          { nombre: "Salto al aro (cada sesión en B3)", ejercicios: [
            ex("Intentos de mate / tocar aro con carrera", 6, "2", "Máxima", "2'", "Frescos y al 100%; para cuando baje la altura.")
          ]},
          { nombre: "Fuerza de potenciación (mantenimiento)", ejercicios: [
            ex("Sentadilla — dobles/singles pesados", 3, "1–2", "RPE 8–9", "3'", "Mantiene fuerza y potencia el SNC; sin fallo.")
          ]}
        ],
        finisher: ""
      },
      { // Martes — PISTA
        nombre: "Pista · Salto al aro máx. + Finalizaciones frescas", tipo: "pista", icono: "🏀",
        foco: "Muchos intentos de mate/tocar aro con frescura. Finalizaciones de partido sin fatiga.",
        calentamiento: RAMP_PISTA,
        bloques: [
          { nombre: "Salto al aro (máxima intención)", ejercicios: [
            ex("Intentos de mate / tocar aro (carrera)", 8, "2", "Máxima", "90\"", "Sesión 'de récord': busca tu salto máximo, descansa entre intentos."),
            ex("Rebote ofensivo explosivo", 4, "3", "Máxima", "75\"", "Segundo salto rápido y alto.")
          ]},
          { nombre: "Finalizaciones de partido (frescas)", ejercicios: [
            ex("Entradas a 1 y 2 pies a ritmo de partido", 4, "4 / lado", "Alta", "60\"", "Calidad técnica, decisión rápida, sin fatiga acumulada.")
          ]}
        ],
        finisher: "Tiro libre + tiro en suspensión 8'."
      },
      { // Miércoles
        nombre: "Mantenimiento + Reactivo unilateral", tipo: "potencia", icono: "🔥",
        foco: "Volumen muy bajo. Mantener cadena posterior y reactividad a una pierna (penúltimo paso).",
        calentamiento: RAMP,
        bloques: [
          { nombre: "Reactivo a una pierna", ejercicios: [
            ex("Hops a 1 pierna (lineal y lateral)", 4, "4 / pierna", "Alta", "90\"", "Específico del salto a una pierna en bandeja."),
            ex("Bound a una pierna (penúltimo paso simulado)", 3, "4 / pierna", "Alta", "90\"", "Freno potente y reproyección hacia arriba.")
          ]},
          { nombre: "Fuerza mantenimiento (mínima)", ejercicios: [
            ex("Hip thrust pesado", 2, "3", "RPE 8", "2'", "Pocas series, mantener tensión."),
            ex("Peso muerto hexagonal — single pesado", 2, "2", "RPE 8", "2,5'", "Mantener fuerza con volumen mínimo.")
          ]}
        ],
        finisher: "Tobillo/tendón: isométricos 3×30\" (mantenimiento)."
      },
      { // Jueves — PISTA
        nombre: "Pista · Salto aplicado + Velocidad máxima", tipo: "pista", icono: "🏀",
        foco: "Sprint a velocidad máxima y salto con carrera. Frescura por encima del volumen.",
        calentamiento: RAMP_PISTA,
        bloques: [
          { nombre: "Velocidad máxima", ejercicios: [
            ex("Sprint a velocidad máxima (lanzado)", 5, "20–30 m", "Máxima", "3'", "Recuperación completa; busca tu máxima velocidad real.")
          ]},
          { nombre: "Salto aplicado", ejercicios: [
            ex("Salto con carrera a tocar aro", 6, "2", "Máxima", "90\"", "Pocos, frescos, todos al 100%.")
          ]}
        ],
        finisher: "Movilidad + descarga 6'."
      },
      { // Viernes
        nombre: "Taper / Activación + Intentos al aro", tipo: "potencia", icono: "🔥",
        foco: "Descarga del pico. Mantener chispa del SNC sin fatigar. En semana 8: taper final + RETEST.",
        calentamiento: RAMP,
        bloques: [
          { nombre: "Activación neural (poco volumen)", ejercicios: [
            ex("Pogos reactivos + 2–3 saltos máximos", 3, "5 + 2", "Alta", "90\"", "Despierta el sistema, sin acumular fatiga."),
            ex("Sentadilla — single de activación", 2, "1", "RPE 7", "3'", "Una carga moderada-alta para potenciar, sin vaciarte.")
          ]},
          { nombre: "Salto al aro", ejercicios: [
            ex("Intentos de mate / tocar aro", 5, "2", "Máxima", "2'", "Disfruta: estás en pico. Mide tu mejor salto.")
          ]}
        ],
        finisher: "Semana 8 → RETEST de la batería de tests."
      }
    ]
  };

  /* ===========================================================
     PROGRESIÓN SEMANAL  (overlay por semana sobre la plantilla del bloque)
     =========================================================== */
  const progresion = {
    1: { bloque: 1, titulo: "Adaptación anatómica", nota: "Aprende los patrones y la recepción. Carga conservadora (RPE 7). Prioriza técnica de aterrizaje.", carga: "Base", descarga: false },
    2: { bloque: 1, titulo: "Acumulación", nota: "Sube carga en los básicos (RPE 8). Mantén volumen de pliometría extensiva. Cuida los tendones (sin añadir nada de golpe).", carga: "↑ Carga", descarga: false },
    3: { bloque: 1, titulo: "Descarga + reevaluación", nota: "Reduce volumen ~40% y mantén algo de intensidad. Al final de la semana: mini-test de control (opcional).", carga: "Descarga", descarga: true },
    4: { bloque: 2, titulo: "Introducción a la conversión", nota: "Empieza la potencia: carga óptima en jump squats, pliometría intensa moderada. Fuerza máx en mantenimiento (1–2 series top).", carga: "Base", descarga: false },
    5: { bloque: 2, titulo: "Pico de conversión", nota: "Máxima carga del bloque: más intención balística, depth jumps y bounding. Sprint a máxima calidad.", carga: "↑↑ Carga", descarga: false },
    6: { bloque: 2, titulo: "Mini-descarga", nota: "Baja el volumen, mantén la intención. Prepara el SNC para el bloque de pico.", carga: "Descarga", descarga: true },
    7: { bloque: 3, titulo: "Realización / Pico", nota: "Pliometría reactiva de alta intensidad y bajo volumen. Salto al aro CADA sesión. Frescura del SNC = prioridad.", carga: "Pico", descarga: false },
    8: { bloque: 3, titulo: "Taper + RETEST", nota: "Últimos 4–5 días en descarga. Volumen muy bajo, intensidad alta puntual. Muchos intentos al aro. RETEST al final de la semana.", carga: "Taper", descarga: true, taper: true }
  };

  /* ===========================================================
     BUILDER — expande plantillas + progresión a PLAN.semanas
     =========================================================== */
  function buildSemanas() {
    const out = [];
    for (let w = 1; w <= 8; w++) {
      const prog = progresion[w];
      const plantilla = plantillas[prog.bloque];
      const dias = plantilla.map((d, idx) => Object.assign({ dia: DIAS[idx], dayIndex: idx }, d));
      out.push({
        n: w,
        bloque: prog.bloque,
        titulo: prog.titulo,
        nota: prog.nota,
        carga: prog.carga,
        descarga: !!prog.descarga,
        taper: !!prog.taper,
        dias
      });
    }
    return out;
  }

  window.PLAN = {
    meta: {
      semanas: 8,
      diasPorSemana: 5,
      dias: DIAS,
      bloques: [
        { id: 1, nombre: "Acumulación · Fuerza máxima + GPP", semanas: [1, 2, 3], color: "b1" },
        { id: 2, nombre: "Conversión · Fuerza-velocidad + Potencia", semanas: [4, 5, 6], color: "b2" },
        { id: 3, nombre: "Realización · Reactividad + Pico", semanas: [7, 8], color: "b3" }
      ]
    },
    plantillas,
    progresion,
    semanas: buildSemanas()
  };
})();
