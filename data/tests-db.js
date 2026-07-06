/* ============================================================
   tests-db.js — batería de tests (§6)
   Cada test: protocolo, campos a registrar, unidad y dirección (mejor = alto/bajo).
   Las métricas derivadas (déficit aro, ratio CMJ–SJ, RSI, fuerza/peso) se
   calculan en tests.js a partir de estos registros.
   ============================================================ */
window.TESTS = [
  /* ---------- ANTROPOMETRÍA ---------- */
  {
    id: "alcance", nombre: "Alcance de pie", icono: "📏", cat: "Antropometría",
    campos: [{ key: "marca", label: "Alcance", unidad: "cm", paso: "0.5" }],
    mejor: "alto",
    desc: "Referencia base para calcular el déficit hasta el aro. Mídelo una vez (y revísalo si creces o cambias calzado).",
    protocolo: [
      "De pie, de lado junto a una pared, pies planos en el suelo.",
      "Extiende el brazo dominante completamente hacia arriba, hombro elevado.",
      "Marca con tiza en los dedos y toca lo más alto posible SIN despegar talones.",
      "3 intentos, registra el más alto (en cm desde el suelo)."
    ]
  },
  {
    id: "bw", nombre: "Peso corporal", icono: "⚖️", cat: "Antropometría",
    campos: [{ key: "marca", label: "Peso", unidad: "kg", paso: "0.1" }],
    mejor: "neutro",
    desc: "Controla el ratio potencia-peso. A 82 kg, gana fuerza vigilando no penalizar la relación con el salto.",
    protocolo: [
      "Mismo momento del día (ideal: en ayunas, tras ir al baño).",
      "Misma báscula y condiciones.",
      "Registra 1–2 veces por semana, no a diario (ruido)."
    ]
  },

  /* ---------- SALTO ---------- */
  {
    id: "cmj", nombre: "CMJ · salto con contramovimiento", icono: "🆙", cat: "Salto",
    campos: [{ key: "marca", label: "Altura de salto", unidad: "cm", paso: "0.1" }],
    mejor: "alto", aro: true,
    desc: "Tu salto vertical 'estándar' a dos pies. La métrica principal de progreso global.",
    protocolo: [
      "Manos en la cadera (o libres si comparas siempre igual).",
      "Desde de pie: bajada rápida (~90° rodilla) y salto máximo inmediato, sin pausa.",
      "Mide con My Jump 2, o jump-and-reach (toca lo más alto y resta tu alcance de pie).",
      "3 intentos con descanso completo, registra el mejor.",
      "Mismo calzado y superficie cada vez."
    ]
  },
  {
    id: "sj", nombre: "SJ · squat jump", icono: "⏫", cat: "Salto",
    campos: [{ key: "marca", label: "Altura de salto", unidad: "cm", paso: "0.1" }],
    mejor: "alto",
    desc: "Salto SIN contramovimiento. Comparado con el CMJ revela tu uso del ciclo estiramiento-acortamiento.",
    protocolo: [
      "Parte de posición de media sentadilla (~90° rodilla).",
      "PAUSA de 2–3 s totalmente quieto (clave: sin rebote).",
      "Salta al máximo sin volver a bajar.",
      "Si te 'hundes' antes de saltar, el intento no vale. 3 intentos, mejor marca."
    ]
  },
  {
    id: "saltoCarrera2", nombre: "Salto con carrera · 2 pies", icono: "🏀", cat: "Salto",
    campos: [{ key: "marca", label: "Altura de salto", unidad: "cm", paso: "0.1" }],
    mejor: "alto", aro: true,
    desc: "El más específico para rebote y mate a dos pies. El que más se parece a tu objetivo de aro.",
    protocolo: [
      "2–3 pasos de carrera de aproximación.",
      "Penúltimo paso largo y bajo (freno), último corto y vertical, doble apoyo.",
      "Brazos arriba, busca el punto más alto (toca pared/aro con tiza).",
      "Altura = toque máximo − alcance de pie. Mejor de 3–5 intentos frescos."
    ]
  },
  {
    id: "saltoCarrera1", nombre: "Salto con carrera · 1 pierna", icono: "🦵", cat: "Salto",
    campos: [{ key: "marca", label: "Altura de salto", unidad: "cm", paso: "0.1" }],
    mejor: "alto", aro: true,
    desc: "Salto a una pierna (penúltimo paso de bandeja). Específico de tu entrada a una pierna.",
    protocolo: [
      "Carrera de aproximación, despegue con UNA pierna (la de bandeja).",
      "Penúltimo paso de freno potente, rodilla libre arriba, brazos coordinados.",
      "Mide el toque máximo − alcance de pie. Registra ambas piernas si difieren.",
      "Mejor de 3–5 intentos. Muy dependiente de la técnica: caliéntalo bien."
    ]
  },
  {
    id: "toque", nombre: "Toque máximo en pista", icono: "🎯", cat: "Salto",
    campos: [{ key: "marca", label: "Altura tocada", unidad: "cm", paso: "0.5" }],
    mejor: "alto",
    desc: "El dato más directo hacia el mate: la altura ABSOLUTA que tocas con carrera (tablero, aro, tiza en la pared). Regístralo tras cada sesión de pista con intentos máximos — alimenta el contador del inicio.",
    protocolo: [
      "Con carrera de aproximación, salta y toca lo más alto posible (aro = 305 cm).",
      "Referencias útiles: la parte baja del tablero suele estar a ~290 cm; el aro a 305.",
      "Usa tiza o cinta si quieres precisión; si no, estima contra el tablero/aro.",
      "Registra tu MEJOR toque del día, fresco (no tras el acondicionamiento)."
    ]
  },
  {
    id: "dropJump", nombre: "Drop Jump · RSI", icono: "⚡", cat: "Salto",
    campos: [
      { key: "altura", label: "Altura de salto", unidad: "cm", paso: "0.1" },
      { key: "contacto", label: "Tiempo de contacto", unidad: "ms", paso: "1" }
    ],
    mejor: "alto", rsi: true,
    desc: "Capacidad reactiva. RSI = altura de salto ÷ tiempo de contacto. Necesitas medir el tiempo de contacto (My Jump 2).",
    protocolo: [
      "Déjate caer desde un cajón (empieza 30 cm), sin saltar hacia arriba al salir.",
      "Al tocar el suelo, rebota lo más ALTO y RÁPIDO posible (contacto mínimo).",
      "My Jump 2 te da altura y tiempo de contacto.",
      "Si el tiempo de contacto se dispara (>250 ms), baja la altura del cajón.",
      "3–5 intentos, registra el de mejor RSI."
    ]
  },
  {
    id: "broadJump", nombre: "Salto horizontal (broad jump)", icono: "↔️", cat: "Salto",
    campos: [{ key: "marca", label: "Distancia", unidad: "cm", paso: "1" }],
    mejor: "alto",
    desc: "Potencia horizontal a dos pies. Buen complemento del salto vertical y fácil de medir.",
    protocolo: [
      "Pies a la anchura de hombros tras la línea.",
      "Contramovimiento con brazos y salto horizontal máximo.",
      "Aterriza estable (si caes hacia atrás con las manos, no cuenta).",
      "Mide del talón más atrasado a la línea de salida. Mejor de 3."
    ]
  },

  /* ---------- VELOCIDAD / AGILIDAD ---------- */
  {
    id: "sprint10", nombre: "Sprint 10 m", icono: "💨", cat: "Velocidad",
    campos: [{ key: "marca", label: "Tiempo", unidad: "s", paso: "0.01" }],
    mejor: "bajo",
    desc: "Aceleración pura (las primeras zancadas). Muy relevante para el primer paso.",
    protocolo: [
      "Salida parado, sin balanceo previo, desde 0,5 m antes de la primera línea.",
      "Cronómetro/app/fotocélula. Si es manual, promedia 2 tomas o usa app.",
      "2–3 intentos con descanso completo (≥2–3'). Registra el mejor."
    ]
  },
  {
    id: "sprint20", nombre: "Sprint 20 m", icono: "🚀", cat: "Velocidad",
    campos: [{ key: "marca", label: "Tiempo", unidad: "s", paso: "0.01" }],
    mejor: "bajo",
    desc: "Aceleración + transición a velocidad. Mídelo junto al de 10 m para ver el tramo volante.",
    protocolo: [
      "Mismo protocolo de salida que el de 10 m.",
      "Idealmente parcial en 10 m y total en 20 m a la vez.",
      "Descanso completo entre intentos. Mejor marca."
    ]
  },
  {
    id: "cod", nombre: "Agilidad / COD (505 o lane agility)", icono: "🔄", cat: "Velocidad",
    campos: [{ key: "marca", label: "Tiempo", unidad: "s", paso: "0.01" }],
    mejor: "bajo",
    desc: "Cambio de dirección — clave para tu defensa. Elige UN protocolo (505 o lane agility) y mantenlo.",
    protocolo: [
      "505: 10 m de carrera + freno y giro de 180° + 5 m de vuelta (cronometra solo los 5+5).",
      "Lane agility (NBA): recorrido rectangular de la zona, ida y vuelta.",
      "Registra ambos lados (pierna de pivote) en el 505 si puedes.",
      "2–3 intentos, mejor marca. Sé consistente con el protocolo elegido."
    ]
  },

  /* ---------- FUERZA (desde Heavy) ---------- */
  {
    id: "sq1rm", nombre: "1RM sentadilla (estimado)", icono: "🏋️", cat: "Fuerza",
    campos: [{ key: "marca", label: "1RM", unidad: "kg", paso: "1" }],
    mejor: "alto", fpeso: true,
    desc: "Fuerza máxima del tren inferior. Estímalo desde tus series en Heavy (Epley) o test directo controlado.",
    protocolo: [
      "No hace falta ir a 1RM real: estima con una serie de 3–5 reps cerca del fallo.",
      "1RM ≈ peso × (1 + reps/30) (Epley). La web te lo calcula en Gimnasio.",
      "Mismo rango de profundidad y calzado cada vez para comparar."
    ]
  },
  {
    id: "dl1rm", nombre: "1RM peso muerto hexagonal (estimado)", icono: "🏋️", cat: "Fuerza",
    campos: [{ key: "marca", label: "1RM", unidad: "kg", paso: "1" }],
    mejor: "alto", fpeso: true,
    desc: "Fuerza de cadena posterior con barra hexagonal (menos estrés lumbar, más transferible al salto).",
    protocolo: [
      "Estima desde una serie de 3–5 reps controladas (Epley).",
      "Misma altura de agarres en la barra hexagonal cada vez."
    ]
  },
  {
    id: "ht1rm", nombre: "1RM hip thrust (estimado)", icono: "🏋️", cat: "Fuerza",
    campos: [{ key: "marca", label: "1RM", unidad: "kg", paso: "1" }],
    mejor: "alto",
    desc: "Fuerza de extensión de cadera — muy relacionada con la propulsión del salto.",
    protocolo: [
      "Estima desde una serie de 4–6 reps con pausa arriba (Epley).",
      "Mismo banco/altura y rango cada vez."
    ]
  }
];

window.TEST_CATEGORIAS = ["Salto", "Velocidad", "Fuerza", "Antropometría"];
