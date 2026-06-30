/* ============================================================
   baloncesto-db.js — Baloncesto específico (§4.10)
   Drills coordinados con el plan: Martes (finalizaciones + defensa) y
   Jueves (salto aplicado + acondicionamiento). Vídeos verificados (junio 2026).
   ============================================================ */
function _bv(url, titulo) { return { url, titulo, verificado: true }; }

window.BALONCESTO = {
  nota: "El trabajo de pista está coordinado con el gimnasio: las finalizaciones explosivas y el salto aplicado a máxima intención NO coinciden el mismo día que la pliometría/sprint de máxima intención. En los bloques 2 y 3 sube la intención y los intentos a máxima altura.",
  categorias: [
    {
      id: "finalizaciones", nombre: "Finalizaciones atacando el aro", icono: "🏀",
      dia: "Martes", descripcion: "Entradas a una y dos piernas, contacto, ambas manos, euro-step y recogida del penúltimo paso.",
      drills: [
        {
          nombre: "Entrada a 2 pies (rebote-step)", objetivo: "Finalizar con salto a dos pies: más equilibrio, potencia y opciones tras el contacto.",
          claves: ["Recoge el balón en el penúltimo paso", "Doble apoyo simultáneo y bajo control", "Sube vertical, protege el balón", "Finaliza con ambas manos según la ayuda"],
          bloque: "1–3", video: _bv("https://www.youtube.com/watch?v=YzSXr6uNNVQ", "Basketball Drill for Better Layups - Play Off Two Feet")
        },
        {
          nombre: "Entrada a 1 pie (footwork)", objetivo: "Entrada clásica a una pierna a máxima velocidad y altura (tu despegue de bandeja).",
          claves: ["Penúltimo paso largo y bajo (freno)", "Último paso corto y vertical", "Rodilla libre arriba para ganar altura", "Coordina el brazeo"],
          bloque: "1–3", video: _bv("https://www.youtube.com/watch?v=aJm-dKpJYXo", "Creating Proper Footwork for a Standard Layup")
        },
        {
          nombre: "Euro-step", objetivo: "Cambiar de dirección en el aire para evitar al defensor y finalizar.",
          claves: ["Primer paso ancho para fijar, segundo para esquivar", "Mantén el balón protegido", "Lee al defensor antes de decidir el lado", "Finaliza con la mano de fuera"],
          bloque: "2–3", video: _bv("https://www.youtube.com/watch?v=xCK_7ydyj9M", "How to do a Euro-Step Layup: Basketball Finishing Drill")
        },
        {
          nombre: "Finalización con contacto (and-one)", objetivo: "Aguantar el contacto y finalizar fuerte con ambas manos.",
          claves: ["Busca el contacto, no lo evites", "Núcleo firme al recibir", "Finaliza alto y protegido", "Practica ambas manos"],
          bloque: "2–3", video: _bv("https://www.youtube.com/watch?v=RZNRsrpNGdk", "Finish Through Contact | Basketball Finishing Drills")
        }
      ]
    },
    {
      id: "salto-aplicado", nombre: "Salto aplicado al juego", icono: "🆙",
      dia: "Jueves", descripcion: "Rebote a dos pies, mate/tocar aro con carrera y transferencia del salto del gimnasio a la cancha.",
      drills: [
        {
          nombre: "Rebote ofensivo a 2 pies", objetivo: "Segundo salto rápido y alto para capturar el rebote por encima del rival.",
          claves: ["Doble apoyo rápido tras el primer salto", "Brazos arriba y activos", "Busca el punto más alto", "Aterriza estable y protege"],
          bloque: "1–3", video: _bv("https://www.youtube.com/watch?v=gbb9CoEMF7s", "3 Best Rebounding Drills To Own The Glass | Boxout Drills")
        },
        {
          nombre: "Salto con carrera a tocar aro / mate", objetivo: "Transferir tu salto de gimnasio a un salto real con carrera de aproximación.",
          claves: ["2–3 pasos de aproximación", "Penúltimo paso de freno potente", "Todo el impulso hacia ARRIBA", "Pocos intentos, todos al 100%"],
          bloque: "2–3", video: null
        },
        {
          nombre: "Intentos máximos al aro (sesión de récord)", objetivo: "En bloque 3, muchos intentos frescos a máxima altura para llegar al aro/mate.",
          claves: ["Solo cuando estás fresco (SNC descansado)", "Descansa entre intentos", "Para cuando baje la altura", "Mide tu mejor salto (My Jump 2)"],
          bloque: "3", video: null
        }
      ]
    },
    {
      id: "defensa", nombre: "Defensa", icono: "🛡️",
      dia: "Martes", descripcion: "Desplazamientos laterales, cambios de dirección (COD), close-outs y postura — mantener intensidad sin fatiga.",
      drills: [
        {
          nombre: "Desplazamiento defensivo (slides)", objetivo: "Cubrir terreno lateral en postura baja sin cruzar los pies.",
          claves: ["Cadera baja, base ancha", "Empuje del pie de fuera", "No juntes ni cruces los pies", "Pecho arriba, manos activas"],
          bloque: "1–3", video: _bv("https://www.youtube.com/watch?v=QaYwcS00vSA", "Basketball Defense: Stance and Slides")
        },
        {
          nombre: "Close-out", objetivo: "Cerrar al tirador controlando, sin pasarte ni picar al primer finteo.",
          claves: ["Sprint y frena con pasos cortos (choppy)", "Mano alta al balón", "Base ancha para reaccionar", "No saltes al primer amago"],
          bloque: "1–3", video: _bv("https://www.youtube.com/watch?v=eXgB-4ZKLGI", "Defensive Close Out Basketball Drills")
        },
        {
          nombre: "Cambios de dirección (COD)", objetivo: "Reaccionar y reorientar el cuerpo rápido para no perder al atacante.",
          claves: ["Frena con el centro de masas bajo", "Reorienta cadera y pies juntos", "Primer paso explosivo de salida", "Mantén la postura entre cambios"],
          bloque: "2–3", video: null
        }
      ]
    },
    {
      id: "acondicionamiento", nombre: "Acondicionamiento específico", icono: "🔋",
      dia: "Jueves", descripcion: "Repeat-sprint y esfuerzos intermitentes que imitan las demandas del partido para jugar sin fatiga.",
      drills: [
        {
          nombre: "Repeat-sprint (líneas / suicidios)", objetivo: "Capacidad de repetir esfuerzos máximos cortos con poca recuperación (como en partido).",
          claves: ["Esfuerzos de 5–10 s a máxima intensidad", "Descanso incompleto (ratio ~1:2–1:3)", "Cuida la técnica de freno", "Sube volumen en bloque 2"],
          bloque: "2–3", video: null
        },
        {
          nombre: "Esfuerzos intermitentes (transición-defensa)", objetivo: "Tolerar el ida y vuelta del partido manteniendo intensidad defensiva.",
          claves: ["Bloques de 30 s trabajo / 60 s descanso", "Combina sprint, slides y saltos", "Mantén la calidad de movimiento", "Simula situaciones reales de juego"],
          bloque: "1–3", video: null
        }
      ]
    }
  ]
};
