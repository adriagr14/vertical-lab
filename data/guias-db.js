/* ============================================================
   guias-db.js — Guías y consejos (§8)
   Nivel: alguien con formación en Ciencias del Deporte.
   Cada guía: bloques con subtítulo (h) y párrafo (p) o lista (items).
   ============================================================ */
window.GUIAS = [
  {
    id: "tecnica-salto", titulo: "Técnica de salto", icono: "🆙",
    resumen: "A dos pies vs. una pierna, penúltimo paso, uso de brazos y postura de bloqueo.",
    bloques: [
      { h: "Dos pies vs. una pierna", p: "Como juegas de 3/4, necesitas ambos. El salto a DOS pies (rebote, mate de poste) genera más fuerza vertical y equilibrio, depende más de fuerza y de un SSC más lento. El salto a UNA pierna (bandeja, mate con carrera) convierte velocidad horizontal en vertical en un contacto muy rápido: depende de la reactividad (RSI) y de la rigidez del tobillo/Aquiles." },
      { h: "El penúltimo paso es la clave", p: "En el salto con carrera, el penúltimo paso es de FRENO: largo y bajo, para 'plantar' y convertir tu velocidad horizontal en impulso vertical. El último paso es corto y vertical. Si el penúltimo paso es flojo, pierdes casi toda la energía elástica." },
      { h: "Uso de brazos", items: [
        "Brazea hacia atrás durante el contramovimiento y lanza los brazos arriba con fuerza en el despegue.",
        "Un buen brazeo puede sumar varios centímetros: el bloqueo de los brazos arriba transmite fuerza al cuerpo.",
        "Tima el brazeo con la extensión de cadera-rodilla-tobillo (triple extensión)."
      ]},
      { h: "Postura de bloqueo y triple extensión", p: "Busca una extensión completa y simultánea de cadera, rodilla y tobillo en el despegue ('triple extensión'). Tronco firme (core apretado) para no fugar energía. En el aire, mantén el cuerpo alineado y proyecta la mano al punto más alto." },
      { h: "Para tu objetivo (tocar aro → mate)", p: "Trabaja las dos modalidades, pero prioriza la que más se acerque a tu objetivo. El salto con carrera a una pierna suele ser el más alto para la mayoría; el de dos pies, el más consistente. Mídelos por separado en Tests." }
    ]
  },
  {
    id: "progresion-plio", titulo: "Progresión pliométrica", icono: "⚡",
    resumen: "De extensiva/baja intensidad a reactiva/alta intensidad; cómo gestionar el volumen de contactos.",
    bloques: [
      { h: "El continuo de intensidad", p: "La pliometría va de menos a más: extensiva (muchos contactos, baja intensidad) → intensiva/reactiva (pocos contactos, máxima intensidad). No empieces por arriba. Tus tendones y tu técnica de aterrizaje necesitan una base antes de los depth jumps." },
      { h: "Progresión por bloques (tu plan)", items: [
        "Bloque 1: pogos, line hops, drop lands estables, cajón bajo enfatizando la recepción.",
        "Bloque 2: depth jumps moderados, saltos de valla, bounding, hops a una pierna.",
        "Bloque 3: depth/drop jumps a altura óptima, reactivos a una pierna, mínimo tiempo de contacto."
      ]},
      { h: "Gestiona el volumen de contactos", p: "Cuenta los apoyos por sesión. Como orientación: pliometría extensiva de iniciación ~60–100 contactos; intensiva/reactiva ~20–40 contactos de alta calidad. Menos es más cuando la intensidad es máxima: si baja la altura o se alarga el tiempo de contacto, PARA." },
      { h: "Calidad > cantidad", p: "Un depth jump bien hecho con contacto corto vale más que diez mediocres. La pliometría reactiva entrena el sistema nervioso: hazla fresco, no fatigado, y nunca al final de una sesión agotadora." },
      { h: "Regla de oro", p: "No añadas intensidad Y volumen a la vez. Sube una variable cada vez y observa cómo responden tus tendones en las 24–48 h siguientes." }
    ]
  },
  {
    id: "aterrizaje", titulo: "Mecánica de aterrizaje", icono: "🛬",
    resumen: "Absorción, rigidez de tobillo y prevención de lesiones.",
    bloques: [
      { h: "Por qué importa", p: "Aterrizar bien protege rodillas y tobillos, y además te hace saltar más: un aterrizaje rígido y bien alineado almacena energía elástica para el siguiente salto. La mayoría de lesiones sin contacto (LCA, tobillo) ocurren en aterrizajes mal controlados." },
      { h: "Técnica", items: [
        "Contacta con el metatarso (parte delantera) y deja bajar el talón de forma controlada.",
        "Rodillas alineadas SOBRE los pies, nunca hacia dentro (valgo).",
        "Absorbe con tobillo, rodilla y cadera repartiendo la carga (cadera atrás).",
        "Silencioso = bien amortiguado. Si haces ruido, estás absorbiendo mal."
      ]},
      { h: "Rigidez de tobillo (no es lo contrario de absorber)", p: "Para saltos reactivos buscas un tobillo RÍGIDO que devuelva energía rápido (pogos, depth jumps). Para aterrizajes de frenado buscas ABSORBER. Entrena los dos: rigidez con pliometría reactiva, absorción con drop lands controlados." },
      { h: "Progresión", p: "Domina el aterrizaje estable (drop land y 'aguanta 1 s') antes de subir alturas o pasar a saltos reactivos. Es el cimiento de toda la pliometría." }
    ]
  },
  {
    id: "tendones", titulo: "Salud de tendones", icono: "🦵",
    resumen: "Isométricos para rotuliano, reverse Nordics para cuádriceps, tibialis raises; regla de no añadir nada de golpe.",
    bloques: [
      { h: "El tendón es lento", p: "El tendón rotuliano y el Aquiles se adaptan más despacio que el músculo. Por eso saltar más de lo que tus tendones toleran (subir volumen de golpe) es la vía rápida a la tendinopatía del saltador. Carga progresiva y paciencia." },
      { h: "Herramientas clave", items: [
        "Isométricos (Spanish squat, sentadilla en isometría): cargan el tendón rotuliano con poca compresión; útiles para gestionar molestias y para potenciar.",
        "Reverse Nordics: fuerza excéntrica y flexibilidad del cuádriceps; protegen rodilla.",
        "Tibialis raises: tibial anterior fuerte = mejor desaceleración y menos periostitis/molestias.",
        "Gemelo y sóleo pesados + isométricos: salud del Aquiles, base del salto."
      ]},
      { h: "Señales de alarma", p: "Dolor en el tendón que empeora sesión a sesión, rigidez matinal en la rodilla o molestia que sigue subiendo durante el salto. Una molestia leve y estable (≤3/10) que no empeora suele ser tolerable; un dolor creciente, no. Ante la duda, baja volumen y consulta." },
      { h: "Regla de oro", p: "No añadas nada de golpe. Introduce un ejercicio o una intensidad nueva poco a poco y observa la respuesta en 24–48 h. Los tendones avisan tarde." }
    ]
  },
  {
    id: "ramp", titulo: "Calentamiento RAMP", icono: "🔥",
    resumen: "Rutina previa estandarizada antes de entrenar.",
    bloques: [
      { h: "Qué es RAMP", p: "Un protocolo de calentamiento en 4 fases (Raise, Activate, Mobilise, Potentiate). Te prepara para producir fuerza y reduce el riesgo de lesión. Hazlo siempre antes de fuerza, pliometría o pista." },
      { h: "R — Raise (elevar)", p: "5' de elevación de pulso y temperatura: bici, comba, trote suave, skipping. Sales algo sudado, no cansado." },
      { h: "A — Activate (activar)", items: [
        "Glúteo: monster walks, puentes.",
        "Core: dead bug, plancha breve.",
        "Tobillo/tendón: tibialis raises + isométrico de sóleo 30\" (clave para el salto)."
      ]},
      { h: "M — Mobilise (movilizar)", p: "Movilidad dinámica de cadera, tobillo y dorsal: zancadas con rotación, sentadilla profunda, balanceos de pierna. Específico de lo que vas a hacer." },
      { h: "P — Potentiate (potenciar)", p: "Sube intensidad hacia la tarea: para fuerza, series de aproximación; para pliometría/sprint, unos pogos y 2–3 saltos o aceleraciones progresivas. Llegas al primer ejercicio ya 'encendido'." }
    ]
  },
  {
    id: "recuperacion", titulo: "Recuperación, sueño y nutrición", icono: "😴",
    resumen: "Proteína 1,6–2,2 g/kg, ligero superávit cuidando el ratio potencia-peso; el sueño como palanca nº1.",
    bloques: [
      { h: "El sueño es la palanca nº1", p: "Ninguna recuperación supera a dormir bien. 7–9 h reales mejoran la producción de fuerza, la reactividad, el aprendizaje motor (técnica de salto) y reducen el riesgo de lesión. Si tienes que elegir una sola cosa, elige dormir." },
      { h: "Proteína", p: "Apunta a ~1,6–2,2 g/kg/día (en ti, 82 kg → ~130–180 g). Repártela en 3–5 tomas de 0,3–0,4 g/kg. Suficiente proteína permite ganar fuerza sin acumular grasa innecesaria." },
      { h: "Energía y ratio potencia-peso", p: "Para ganar fuerza, un superávit LIGERO (~+150–300 kcal) basta. A 82 kg y buscando saltar más, cuida el equilibrio: ganar músculo útil sí, ganar peso que no aporte potencia penaliza tu relación potencia-peso. Vigila el peso corporal en Tests y ajusta." },
      { h: "Carbohidratos y entrenamiento", p: "Los carbohidratos alimentan el trabajo explosivo y de alta intensidad (pliometría, sprint, partido). No los recortes en exceso en bloques de mucha intensidad: comprometen la calidad del salto." },
      { h: "Gestiona la carga", items: [
        "Hidratación y algo de proteína+carbohidrato tras entrenar.",
        "Días fáciles de verdad fáciles; respeta las descargas del plan.",
        "Si el RPE de las sesiones sube sin razón o el salto baja, probablemente necesitas dormir/comer más, no entrenar más."
      ]}
    ]
  },
  {
    id: "leer-datos", titulo: "Cómo testear y leer tus datos", icono: "📊",
    resumen: "Interpretar CMJ, SJ, RSI y el déficit hasta aro.",
    bloques: [
      { h: "Consistencia ante todo", p: "Un test solo sirve si lo repites igual: mismo calzado, misma superficie, mismo protocolo y, a poder ser, momento del día parecido. Mide línea base (pre-semana 1), control (semana 4) y retest (semana 8)." },
      { h: "CMJ — tu termómetro general", p: "El salto con contramovimiento es tu marca de progreso global. Subidas sostenidas = el plan funciona. Caídas puntuales pueden indicar fatiga acumulada (útil también para auto-regular)." },
      { h: "CMJ − SJ — uso del ciclo estiramiento-acortamiento", p: "El squat jump (sin contramovimiento) mide fuerza 'pura' de salida. La diferencia CMJ − SJ refleja cuánto aprovechas el rebote elástico (SSC). Si la diferencia es pequeña (<2 cm), te falta reactividad → prioriza pliometría. Si es grande, tu margen está en ganar fuerza/SJ." },
      { h: "RSI — reactividad", p: "Reactive Strength Index = altura del salto ÷ tiempo de contacto (drop jump). Mide cómo de 'muelle' eres. RSI alto = contactos cortos y potentes (clave para el salto a una pierna). Mídelo con My Jump 2 y entrénalo con pliometría reactiva." },
      { h: "Déficit hasta aro", p: "Déficit = altura de aro (305 cm) − (tu alcance de pie + tu mejor salto). Es tu distancia real al objetivo. La web lo calcula solo en Tests. Úsalo como tu KPI principal: cuando llegue a 0, tocas aro." },
      { h: "Lee la tendencia, no el dato suelto", p: "Un mal día no significa nada; tres semanas de estancamiento, sí. Cruza tus tests con tu sueño, tu RPE y tu peso para entender qué está pasando y ajustar." }
    ]
  }
];
