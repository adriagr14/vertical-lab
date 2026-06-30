# Vertical Lab 🏀▲

Web personal de entrenamiento para una **pretemporada de 8 semanas** orientada a salto vertical, fuerza y capacidad de trabajo para baloncesto (posición 3/4).

Estática, sin backend, sin paso de build. Todo se guarda en tu navegador (`localStorage`).

## Cómo usarla

- **En local:** abre `index.html` con doble clic. Funciona offline (las gráficas usan Chart.js por CDN, así que necesitan internet la primera vez; el resto funciona sin conexión).
- **Móvil:** diseñada mobile-first para consultarla en el gimnasio.

## Desplegar en GitHub Pages

1. Crea un repositorio en GitHub y sube esta carpeta:
   ```bash
   git add .
   git commit -m "Vertical Lab"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```
2. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Branch: `main` · carpeta `/ (root)` · **Save**.
4. En 1-2 min estará en `https://TU_USUARIO.github.io/TU_REPO/`.

> Si subes solo el contenido de `entrenamiento-salto/` a la raíz del repo, el sitio se sirve directo. Si subes la carpeta entera, la URL incluirá `/entrenamiento-salto/`.

## Estructura

```
index.html            Shell + navegación
css/styles.css        Tema oscuro, mobile-first
js/                   Lógica por sección + storage, charts, export
data/                 Contenido editable: plan, ejercicios, tests, guías
```

## Estado de construcción (por fases)

- [x] **Fase 2** — Esqueleto navegable (tema oscuro, responsive, secciones)
- [x] **Fase 3** — Plan de 8 semanas (3 bloques · 5 días/sem · copiar a Heavy)
- [x] **Fase 4** — Batería de tests + métricas derivadas + gráficas
- [x] **Fase 5** — Biblioteca de 31 ejercicios (vídeos verificados)
- [x] **Fase 6** — Cargas de gimnasio + sugerencias de progresión por bloque
- [x] **Fase 7** — Baloncesto específico (finalizaciones, salto, defensa, acond.)
- [x] **Fase 8** — Guías (7 guías con criterio técnico)
- [x] **Fase 9** — Registro/progreso + gráficas + export JSON / Heavy

✅ **Proyecto completo.**

## Traer entrenos desde Hevy (dos vías)

En **Gimnasio & cargas** tienes dos formas de importar tus entrenos de la app Hevy. Ambas:
- Mapean los ejercicios de Hevy a tus levantamientos clave (sentadilla, peso muerto, RDL, press, dominadas, gemelo…), en **español o inglés**.
- Toman la **mejor serie de trabajo** de cada ejercicio por sesión (ignoran calentamientos).
- **Deduplican**: puedes reimportar todo el historial cada semana y solo añade lo nuevo.

**1. 🔗 Sincronizar con Hevy (API) — recomendado.** Pega tu clave API (Hevy → Ajustes → Desarrollador; requiere Hevy Pro) y pulsa *Sincronizar*. Trae los entrenos directamente, sin exportar nada. La clave se guarda **solo en tu dispositivo** (localStorage); nunca se sube al repo. *(Nota: los webhooks de Hevy no se pueden usar en una web estática porque requieren un servidor que reciba la notificación.)*

**2. 📥 Importar CSV.** Exporta el CSV desde Hevy (Ajustes → Exportar datos) y súbelo. Útil sin Hevy Pro o como alternativa offline.

El mapeo es editable en `js/heavy-import.js` (función `matchLift`).

## Datos y privacidad

Tus registros viven solo en tu dispositivo. Usa **Datos → Exportar JSON** para guardar un respaldo.
