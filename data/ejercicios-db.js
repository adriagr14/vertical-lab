/* ============================================================
   ejercicios-db.js — biblioteca de ejercicios (§4.5 / §7)
   Cada ficha: objetivo, claves técnicas (cues), errores comunes,
   progresión/regresión y vídeo de demostración.
   VÍDEOS: cada URL procede de búsquedas en vivo (junio 2026) y se ha
   comprobado que la página de YouTube carga (título resuelto). Si en el
   futuro alguno cae, cámbialo: video.verificado = false → "pendiente de verificar".
   ============================================================ */
window.EJERCICIOS_CATS = [
  "Fuerza tren inferior",
  "Cadena posterior",
  "Tobillo y tendón",
  "Pliometría",
  "Potencia y halterofilia",
  "Tren superior y core",
  "Velocidad y agilidad"
];

function _v(url, titulo) { return { url, titulo, verificado: true }; }

window.EJERCICIOS = [
  /* ===== FUERZA TREN INFERIOR ===== */
  {
    id: "back-squat", nombre: "Sentadilla trasera", cat: "Fuerza tren inferior", icono: "🏋️",
    objetivo: "Fuerza máxima de cuádriceps, glúteo y extensores de cadera. Base de la producción de fuerza para el salto.",
    cues: ["Pecho alto y mirada al frente", "Rodillas siguen la línea de los pies", "Empuja el suelo con todo el pie", "Baja controlado (~2 s), sube con intención"],
    errores: ["Valgo de rodilla (se van hacia dentro)", "Talones que se levantan", "Perder la curvatura lumbar abajo (butt wink) por falta de profundidad controlada"],
    progresion: "Regresión: goblet squat o caja. Progresión: añadir carga / pausa abajo.",
    video: _v("https://www.youtube.com/watch?v=7v_V6xiA_AA", "How to Perform A Back Squat")
  },
  {
    id: "front-squat", nombre: "Sentadilla frontal", cat: "Fuerza tren inferior", icono: "🏋️",
    objetivo: "Más énfasis en cuádriceps y posición vertical del tronco. Buena alternativa si la espalda baja se carga con la trasera.",
    cues: ["Codos altos, paralelos al suelo", "Tronco vertical, costillas abajo", "El peso descansa en los hombros, no en las manos"],
    errores: ["Codos que caen (la barra rueda)", "Tronco que se inclina adelante", "Muñecas en hiperextensión por falta de movilidad"],
    progresion: "Regresión: agarre cruzado o goblet. Progresión: añadir carga / tempo.",
    video: _v("https://www.youtube.com/watch?v=wyDbagKS7Rg", "How To Front Squat With Proper Form")
  },
  {
    id: "bulgaras", nombre: "Búlgara (split squat)", cat: "Fuerza tren inferior", icono: "🦵",
    objetivo: "Fuerza unilateral de pierna y estabilidad de cadera. Corrige asimetrías, muy transferible al salto a una pierna.",
    cues: ["Tronco ligeramente adelantado", "Rodilla trasera baja hacia el suelo", "Empuje del talón de la pierna delantera", "Cadera estable, sin bascular"],
    errores: ["Paso demasiado corto (rodilla delantera muy adelantada)", "Inestabilidad por base estrecha", "Rebotar con la rodilla trasera en el suelo"],
    progresion: "Regresión: split squat sin elevar pie trasero. Progresión: mancuernas / barra / déficit.",
    video: _v("https://www.youtube.com/watch?v=yewlXtRs3K4", "HOW TO do a BULGARIAN SPLIT SQUAT | proper form + common mistakes")
  },

  /* ===== CADENA POSTERIOR ===== */
  {
    id: "trap-bar-dl", nombre: "Peso muerto con barra hexagonal", cat: "Cadena posterior", icono: "🏋️",
    objetivo: "Fuerza de cadera y piernas con menos estrés lumbar que la barra recta. Muy transferible a la triple extensión del salto.",
    cues: ["Pecho alto, espalda neutra", "Empuja con las piernas como en una prensa", "Caderas y hombros suben a la vez", "Bloqueo de glúteo arriba sin hiperextender"],
    errores: ["Redondear la espalda baja", "Tirar primero con la espalda en vez de empujar con piernas", "Caderas que se disparan antes que el pecho"],
    progresion: "Regresión: agarres altos / menos carga. Progresión: agarres bajos, carga, o versión a velocidad.",
    video: _v("https://www.youtube.com/watch?v=vX0QDhjexzI", "Trap Bar Deadlift: How, Why & When to Use It | Juggernaut")
  },
  {
    id: "hip-thrust", nombre: "Hip thrust", cat: "Cadena posterior", icono: "🍑",
    objetivo: "Fuerza máxima de extensión de cadera (glúteo). Directamente ligada a la propulsión vertical.",
    cues: ["Mentón metido, mirada adelante", "Pausa 1 s arriba apretando glúteo", "Tibias verticales arriba", "Recorrido por extensión de cadera, no por arqueo lumbar"],
    errores: ["Hiperextender la lumbar en vez de extender la cadera", "Rango incompleto", "Empujar con las puntas en vez de con el talón"],
    progresion: "Regresión: glute bridge en suelo. Progresión: añadir carga / pausa / una pierna.",
    video: _v("https://www.youtube.com/watch?v=Zp26q4BY5HE", "How To Do a Barbell Hip Thrust")
  },
  {
    id: "rdl", nombre: "Peso muerto rumano (RDL)", cat: "Cadena posterior", icono: "🦵",
    objetivo: "Fuerza e hipertrofia de isquios y glúteo en bisagra de cadera. Salud y potencia de la cadena posterior.",
    cues: ["Bisagra de cadera: lleva el culo atrás", "Barra pegada a las piernas", "Rodillas poco flexionadas y fijas", "Estírate hasta sentir los isquios, no más"],
    errores: ["Convertirlo en sentadilla (flexionar rodillas de más)", "Redondear la espalda", "Bajar demasiado perdiendo tensión lumbar"],
    progresion: "Regresión: rango parcial / mancuernas. Progresión: carga, tempo excéntrico, una pierna.",
    video: _v("https://www.youtube.com/watch?v=uhghy9pFIPY", "How To Perform PERFECT Romanian Deadlifts | RDLs")
  },
  {
    id: "nordic", nombre: "Nordic hamstring curl", cat: "Cadena posterior", icono: "🦵",
    objetivo: "Fuerza excéntrica de isquios. Clave para prevención de lesiones y para frenar (penúltimo paso).",
    cues: ["Cuerpo recto de rodillas a hombros", "Baja lo más lento que puedas (excéntrica)", "Frena con los isquios hasta el final", "Empuja con las manos para volver"],
    errores: ["Romper la cadera (sacar el culo)", "Caer sin control", "Rango demasiado grande antes de tener fuerza"],
    progresion: "Regresión: con bandas / rango corto. Progresión: más rango, sin asistencia, lastrado.",
    video: _v("https://www.youtube.com/watch?v=Yn7aqLkeF0U", "How To Do Nordic Hamstring Curls | Exercise Tutorial")
  },

  /* ===== TOBILLO Y TENDÓN ===== */
  {
    id: "calf-pie", nombre: "Gemelo de pie (standing calf raise)", cat: "Tobillo y tendón", icono: "🦶",
    objetivo: "Fuerza del gastrocnemio y rigidez del tobillo. El tobillo devuelve gran parte de la energía en el salto.",
    cues: ["Rango completo: estira abajo, sube hasta la punta", "Pausa arriba 1 s", "Rodilla extendida (enfatiza gastrocnemio)", "Controla la bajada"],
    errores: ["Rebotar con el tendón sin control", "Rango corto", "Doblar la rodilla (pasa a trabajar el sóleo)"],
    progresion: "Progresión: carga pesada + isométricos. Variante reactiva: pogos (ver Pliometría).",
    video: _v("https://www.youtube.com/watch?v=SVtg-1loH4c", "How to PROPERLY Standing Calf Raise | Tips & Common Mistakes")
  },
  {
    id: "calf-soleo", nombre: "Sóleo (gemelo sentado)", cat: "Tobillo y tendón", icono: "🦶",
    objetivo: "Fuerza del sóleo (con rodilla flexionada). Muy importante para aterrizajes y aceleración, suele estar infraentrenado.",
    cues: ["Rodilla a ~90°", "Rango completo y pausa arriba", "Carga progresiva y pesada", "Controla la fase de bajada"],
    errores: ["Rango corto", "Ir demasiado rápido sin tensión", "Olvidarlo (entrenar solo gemelo de pie)"],
    progresion: "Progresión: carga + isométricos largos (30–45 s). Útil para salud del Aquiles.",
    video: _v("https://www.youtube.com/watch?v=CmAEHLla14I", "How To Build Bigger Calves With Seated Calf Raises - Soleus Focused")
  },
  {
    id: "tib-raise", nombre: "Tibial anterior (tibialis raise)", cat: "Tobillo y tendón", icono: "🦶",
    objetivo: "Fuerza del tibial anterior: salud del tobillo/rodilla, desaceleración y prevención de periostitis.",
    cues: ["Espalda contra la pared, talones algo adelantados", "Sube las puntas hacia las espinillas a tope", "Controla la bajada", "Rango completo"],
    errores: ["Rango corto", "Usar impulso", "Saltarse la fase excéntrica"],
    progresion: "Progresión: con lastre / cable. Empieza con poco volumen (regla de no añadir todo de golpe).",
    video: _v("https://www.youtube.com/watch?v=RXC7tE6IQcc", "Tibialis Raise | How to do it and why it is important")
  },
  {
    id: "reverse-nordic", nombre: "Reverse Nordic", cat: "Tobillo y tendón", icono: "🦵",
    objetivo: "Fuerza excéntrica y flexibilidad del cuádriceps y tendón rotuliano. Salud de rodilla para saltar.",
    cues: ["De rodillas, cuerpo recto", "Inclínate atrás controlando con el cuádriceps", "No arquees la lumbar", "Vuelve apretando cuádriceps"],
    errores: ["Romper la cadera para hacer trampa", "Rango demasiado grande al principio", "Caer sin control"],
    progresion: "Regresión: rango corto / con bandas. Progresión: más rango, lastrado. Introduce volumen poco a poco.",
    video: _v("https://www.youtube.com/watch?v=LL05lqaD0RU", "Reverse Nordic Exercise for Eccentric Quad Strength")
  },
  {
    id: "spanish-squat", nombre: "Spanish squat (isométrico rotuliano)", cat: "Tobillo y tendón", icono: "🦵",
    objetivo: "Isométrico de cuádriceps que carga el tendón rotuliano minimizando compresión. Manejo del dolor de rodilla de saltador.",
    cues: ["Banda elástica detrás de las rodillas, anclada delante", "Siéntate atrás como en una silla (tibias verticales)", "Aguanta el isométrico (p. ej. 5×30–45 s)", "Tronco bastante vertical"],
    errores: ["Dejar que las rodillas pasen mucho la punta del pie", "Aguantar la respiración", "Usarlo con dolor agudo sin guía"],
    progresion: "Progresión: añadir carga (barra/mancuerna) al isométrico. Útil en mantenimiento de tendón.",
    video: _v("https://www.youtube.com/watch?v=mik90mAS6fU", "Spanish Squats - Isometric Exercise for Patellar Tendinopathy")
  },

  /* ===== PLIOMETRÍA ===== */
  {
    id: "pogos", nombre: "Pogos (saltos de tobillo)", cat: "Pliometría", icono: "⚡",
    objetivo: "Rigidez reactiva del tobillo y ciclo estiramiento-acortamiento rápido. Pliometría extensiva de entrada.",
    cues: ["Rodillas casi rectas, rebota con el tobillo", "Contacto con el suelo corto y rápido", "Cuerpo rígido como un muelle", "Mira al frente, brazos ayudan"],
    errores: ["Flexionar mucho la rodilla (pierde reactividad)", "Contactos largos y blandos", "Aterrizar con talones"],
    progresion: "Progresión: pogos en sitio → en desplazamiento → a una pierna.",
    video: _v("https://www.youtube.com/watch?v=jj-0qlVuM3w", "Plyometric Progression: Stationary Pogo Jumps")
  },
  {
    id: "box-jump", nombre: "Salto a cajón (box jump)", cat: "Pliometría", icono: "📦",
    objetivo: "Producción de fuerza concéntrica explosiva con aterrizaje seguro (baja altura de caída). Enseña recepción.",
    cues: ["Contramovimiento con brazos", "Aterriza suave y estable arriba", "Cadera y rodilla absorben en silencio", "Baja escalonado, no saltes hacia atrás"],
    errores: ["Cajón demasiado alto (mide capacidad de encoger piernas, no de saltar)", "Aterrizajes ruidosos/duros", "Saltar hacia abajo desde el cajón repetidamente"],
    progresion: "Progresión: más altura razonable, a una pierna, o salto-stick. Prioriza calidad de recepción.",
    video: _v("https://www.youtube.com/watch?v=jrl0de5jSsg", "Box Jumps Simplicity - Proper Set-up, Execution, and Landing")
  },
  {
    id: "depth-jump", nombre: "Depth jump", cat: "Pliometría", icono: "🔥",
    objetivo: "Pliometría de alta intensidad: caída + rebote máximo. Desarrolla potencia reactiva y SSC rápido.",
    cues: ["Déjate caer del cajón (no saltes hacia arriba al salir)", "Al tocar el suelo, rebota YA y arriba", "Tiempo de contacto mínimo", "Rígido en tobillo y rodilla"],
    errores: ["Tiempo de contacto largo (altura del cajón excesiva)", "Hundirse al aterrizar", "Volumen alto (es de bajo volumen)"],
    progresion: "Empieza 30 cm. Sube altura solo si mantienes contacto corto. Avanzado: a una pierna.",
    video: _v("https://www.youtube.com/watch?v=AzPJZHOmGEg", "Max Effort Plyometrics: Depth Jumps")
  },
  {
    id: "drop-jump", nombre: "Drop jump (RSI)", cat: "Pliometría", icono: "⚡",
    objetivo: "Medir y entrenar la reactividad (RSI = altura ÷ tiempo de contacto). Rebote rápido tras caída.",
    cues: ["Caída controlada desde el cajón", "Rebota como un muelle, mínimo contacto", "Brazos coordinados arriba", "Busca altura Y rapidez a la vez"],
    errores: ["Priorizar solo altura (contacto largo)", "Altura de cajón inadecuada", "Aterrizar con talones"],
    progresion: "Mide con My Jump 2. Si el contacto sube de ~250 ms, baja el cajón.",
    video: _v("https://www.youtube.com/shorts/ZDyFrqtASMY", "How to Use Drop Jump RSI for Plyometric Training")
  },
  {
    id: "hurdle-hops", nombre: "Saltos de valla (hurdle hops)", cat: "Pliometría", icono: "🚧",
    objetivo: "Saltos reactivos repetidos verticales sobre obstáculos. Rigidez y potencia con control de aterrizaje.",
    cues: ["Rodillas arriba", "Contactos cortos y reactivos", "Aterriza equilibrado entre vallas", "Brazos acompañan"],
    errores: ["Contactos largos y blandos", "Vallas demasiado altas (pierdes reactividad)", "Aterrizar descontrolado"],
    progresion: "Regresión: line hops sin altura. Progresión: vallas más altas, a una pierna, depth-to-hurdle.",
    video: _v("https://www.youtube.com/watch?v=r47D5ITtVf0", "How to Do a Hurdle Hop | Plyometric Exercises")
  },
  {
    id: "bounding", nombre: "Bounding (zancadas saltadas)", cat: "Pliometría", icono: "🦌",
    objetivo: "Potencia horizontal y aplicación de fuerza al sprint y al penúltimo paso. Amplitud y proyección.",
    cues: ["Zancadas largas y aéreas", "Proyecta hacia delante", "Brazos potentes y coordinados", "Aterriza activo bajo el centro de masas"],
    errores: ["Correr en vez de saltar", "Falta de amplitud", "Aterrizajes pasivos"],
    progresion: "Regresión: alternando suave por distancia. Progresión: máxima intención, a una pierna.",
    video: _v("https://www.youtube.com/watch?v=oNKXelqRGoM", "Learn The Bounding Drill Progression Beginners to Advanced")
  },
  {
    id: "single-leg-bound", nombre: "Hops / bound a una pierna", cat: "Pliometría", icono: "🦵",
    objetivo: "Reactividad unilateral. Específico de tu salto a una pierna (bandeja, penúltimo paso).",
    cues: ["Despega y aterriza con la misma pierna", "Rígido en el tobillo, contacto corto", "Rodilla libre arriba", "Controla el aterrizaje"],
    errores: ["Aterrizajes en valgo (rodilla adentro)", "Contactos largos", "Demasiado volumen sin base de fuerza"],
    progresion: "Regresión: en sitio. Progresión: lineal → lateral → por distancia/altura.",
    video: _v("https://www.youtube.com/watch?v=I7ChaipZVM4", "Single Leg Bounds for Speed Training - 3 Step Progression")
  },
  {
    id: "skater-bound", nombre: "Salto lateral (skater bound)", cat: "Pliometría", icono: "⛸️",
    objetivo: "Potencia y estabilidad lateral. Transferencia a cambios de dirección y defensa.",
    cues: ["Empuje lateral potente con una pierna", "Aterriza y estabiliza (stick) en la otra", "Cadera, rodilla y tobillo alineados", "Absorbe antes de reproyectar"],
    errores: ["Valgo de rodilla al aterrizar", "No estabilizar (descontrol)", "Poco rango lateral"],
    progresion: "Regresión: con pausa (stick). Progresión: continuo y reactivo, por distancia.",
    video: _v("https://www.youtube.com/watch?v=gS4F_YrwZVs", "Lateral Skater Hops (Plyometric)")
  },
  {
    id: "broad-jump", nombre: "Salto horizontal (broad jump)", cat: "Pliometría", icono: "↔️",
    objetivo: "Potencia horizontal máxima a dos pies. Test y entrenamiento de impulso explosivo.",
    cues: ["Contramovimiento con brazos atrás", "Proyecta lejos y algo arriba", "Extensión completa de cadera, rodilla y tobillo", "Aterriza estable y absorbe"],
    errores: ["Caer hacia atrás con las manos", "Poca extensión de tobillo", "Aterrizaje rígido sin absorber"],
    progresion: "Progresión: repetidos enlazados, o a una pierna. Mide la distancia como test.",
    video: _v("https://www.youtube.com/watch?v=x9qlFXfQaZU", "How to do Broad Jumps (Standing Long Jumps)")
  },
  {
    id: "landing", nombre: "Mecánica de aterrizaje", cat: "Pliometría", icono: "🛬",
    objetivo: "Aprender a absorber fuerzas: rigidez de tobillo, alineación de rodilla y absorción de cadera. Base de toda la pliometría.",
    cues: ["Aterriza con el metatarso y deja bajar el talón", "Rodillas sobre los pies (no adentro)", "Cadera atrás absorbiendo", "Silencioso = bien amortiguado"],
    errores: ["Valgo de rodilla", "Aterrizar rígido (piernas extendidas)", "Ruido fuerte (impacto sin absorber)"],
    progresion: "Drop land estable → con perturbación → reactivo. Domina esto antes de subir intensidad.",
    video: _v("https://www.youtube.com/watch?v=oDjZnUvSzyo", "Jumping & Landing Mechanics to Improve Vertical Jump")
  },

  /* ===== POTENCIA Y HALTEROFILIA ===== */
  {
    id: "trap-bar-jump", nombre: "Salto con barra hexagonal (jump squat)", cat: "Potencia y halterofilia", icono: "⚡",
    objetivo: "Potencia con carga (zona de máxima potencia). Despegue real del suelo, más seguro que con barra a la espalda.",
    cues: ["Carga ligera-moderada (~20–30%)", "Explota y despega del suelo", "Intención máxima en cada repe", "Aterriza suave y reinicia"],
    errores: ["Carga excesiva (deja de ser balístico)", "Aterrizajes duros", "Series largas que acumulan fatiga"],
    progresion: "Busca la carga que maximiza tu potencia. Pocas reps, máxima calidad.",
    video: _v("https://www.youtube.com/watch?v=52-P8hlrKqg", "How To Do Trap Bar Jump Squat | Exercise Demo")
  },
  {
    id: "hang-power-clean", nombre: "Cargada de fuerza desde colgado", cat: "Potencia y halterofilia", icono: "🏋️",
    objetivo: "Triple extensión explosiva (tobillo-rodilla-cadera) bajo carga. Gran desarrollo de potencia si la técnica es sólida.",
    cues: ["Barra desde colgado (por encima de la rodilla)", "Explosión de cadera ('jump')", "Codos altos y rápidos para recibir", "Recibe en cuarto de sentadilla"],
    errores: ["Tirar con los brazos en vez de extender la cadera", "Técnica pobre con mucha carga", "Recibir con la espalda redondeada"],
    progresion: "Si no dominas la técnica, usa el HIGH PULL (sin recibir). Aprende con barra vacía.",
    video: _v("https://www.youtube.com/watch?v=efHjodEVf9w", "Hang Power Clean | Olympic Weightlifting Exercise Library")
  },

  /* ===== TREN SUPERIOR Y CORE ===== */
  {
    id: "bench", nombre: "Press de banca", cat: "Tren superior y core", icono: "💪",
    objetivo: "Fuerza de empuje horizontal (pecho, hombro, tríceps). Físico para aguantar contacto.",
    cues: ["Escápulas retraídas y deprimidas", "Pies firmes en el suelo", "Barra al esternón, codos ~45°", "Recorrido controlado y completo"],
    errores: ["Despegar los glúteos", "Codos demasiado abiertos (90°)", "Rebotar la barra en el pecho"],
    progresion: "Regresión: mancuernas / máquina. Progresión: carga, pausa en el pecho.",
    video: _v("https://www.youtube.com/watch?v=gRVjAtPip0Y", "How to Perform Bench Press - Tutorial & Proper Form")
  },
  {
    id: "ohp", nombre: "Press militar (overhead press)", cat: "Tren superior y core", icono: "💪",
    objetivo: "Fuerza de empuje vertical y estabilidad de tronco. Hombros fuertes y core anti-extensión.",
    cues: ["Core y glúteos apretados", "Barra sube en línea recta (mete la cabeza al pasar)", "Bloqueo arriba con la barra sobre la cabeza", "Costillas abajo, sin arquear la lumbar"],
    errores: ["Arquear mucho la espalda baja", "Empujar la barra hacia delante", "Rango incompleto"],
    progresion: "Regresión: mancuernas / sentado. Progresión: carga, push press para fase explosiva.",
    video: _v("https://www.youtube.com/watch?v=a81SaIpjGlA", "Overhead Press (Barbell) - Proper Form & Technique [4K]")
  },
  {
    id: "pullup", nombre: "Dominadas (lastradas)", cat: "Tren superior y core", icono: "💪",
    objetivo: "Fuerza de tracción (dorsal, bíceps, escápula). Equilibrio del tren superior y agarre.",
    cues: ["Empieza desde extensión completa", "Lleva el pecho a la barra", "Escápulas que descienden y se juntan", "Sin balanceo (kipping) si buscas fuerza"],
    errores: ["Rango parcial", "Usar impulso", "Hombros 'colgados' sin activar la escápula"],
    progresion: "Regresión: asistidas con banda / isométricos. Progresión: añadir lastre (cinturón).",
    video: _v("https://www.youtube.com/watch?v=HuuyDNGrCI8", "How To: Weighted Pull-Up")
  },
  {
    id: "pallof", nombre: "Pallof press (anti-rotación)", cat: "Tren superior y core", icono: "🧱",
    objetivo: "Estabilidad anti-rotación del core. Transferencia de fuerza entre tren inferior y superior.",
    cues: ["Polea/banda a la altura del pecho, de lado", "Extiende los brazos sin dejar que el tronco gire", "Aprieta abdomen y glúteo", "Respira sin perder tensión"],
    errores: ["Dejar que el tronco rote", "Usar los brazos en vez del core", "Aguantar la respiración"],
    progresion: "Progresión: más resistencia, de rodillas, o dinámico con paso.",
    video: _v("https://www.youtube.com/watch?v=dBAmQ9bx3JA", "Pallof Press Tutorial | Best Anti-Rotation Core Exercise")
  },
  {
    id: "ab-wheel", nombre: "Rueda abdominal (ab rollout)", cat: "Tren superior y core", icono: "🧱",
    objetivo: "Fuerza anti-extensión del core. Tronco rígido para transmitir fuerza en el salto y el contacto.",
    cues: ["Pelvis retrovertida (mete el culo)", "No dejes que la lumbar se arquee", "Rueda hasta donde mantengas la posición", "Abdomen apretado todo el rango"],
    errores: ["Arquear la lumbar (duele la espalda)", "Rango demasiado grande al inicio", "Tirar con los brazos"],
    progresion: "Regresión: de rodillas con rango corto. Progresión: más rango, de pie.",
    video: _v("https://www.youtube.com/watch?v=NbudTqiwguk", "Ab Wheel Rollout - Proper Form & Technique")
  },

  /* ===== VELOCIDAD Y AGILIDAD ===== */
  {
    id: "sprint-accel", nombre: "Aceleración (sprint)", cat: "Velocidad y agilidad", icono: "🚀",
    objetivo: "Mecánica de aceleración: proyección hacia delante y aplicación de fuerza horizontal. Primer paso explosivo.",
    cues: ["Proyección del cuerpo adelante (no te incorpores pronto)", "Zancadas potentes empujando atrás", "Brazos amplios y coordinados", "Sube progresivamente, sin tensión en hombros"],
    errores: ["Incorporarse demasiado pronto", "Zancada de más (overstriding)", "Tensión en cuello y hombros"],
    progresion: "Regresión: arranques 10 m. Progresión: 20–30 m, salidas variadas, con trineo.",
    video: _v("https://www.youtube.com/watch?v=MHyM1uuMIwc", "Top 2 Acceleration Drills Every Athlete Needs for Speed")
  },
  {
    id: "def-slide", nombre: "Desplazamiento defensivo (slides)", cat: "Velocidad y agilidad", icono: "🛡️",
    objetivo: "Postura y desplazamiento lateral defensivo. Mantener intensidad sin perder agilidad ni fatigarte.",
    cues: ["Cadera baja, base ancha", "No juntes los pies (no cruces)", "Empuje lateral del pie de fuera", "Pecho arriba, manos activas"],
    errores: ["Ponerse alto (subir la cadera)", "Juntar/cruzar los pies", "Dar pasos cortos sin cubrir terreno"],
    progresion: "Progresión: slides + close-out + recovery, con reacción a estímulo.",
    video: _v("https://www.youtube.com/watch?v=QaYwcS00vSA", "Basketball Defense: Stance and Slides")
  }
];
