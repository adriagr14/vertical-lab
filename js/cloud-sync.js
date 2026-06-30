/* ============================================================
   cloud-sync.js — Sincronización de datos entre dispositivos (Supabase)
   Guarda todo tu JSON en una fila de Supabase y lo comparte entre PC y móvil.
   Estrategia: "gana la última edición" (por marca de tiempo meta.updatedAt).

   Claves LOCALES (no se sincronizan, se quedan en cada dispositivo):
   Hevy API key y la propia configuración de Supabase.

   Config (en Datos): Supabase URL + anon key + un "código de sync" (tu secreto,
   = id de la fila). Tabla esperada: vl_state(id text pk, data jsonb, updated_at int8).
   ============================================================ */
(function () {
  "use strict";

  const TABLE = "vl_state";
  const LOCAL_ONLY = ["hevyApiKey", "hevyLastSync", "supabaseUrl", "supabaseKey", "syncCode", "cloudLastSync", "cloudAuto"];

  function cfg() {
    return {
      url: (VL.get("settings.supabaseUrl") || "").replace(/\/+$/, ""),
      key: VL.get("settings.supabaseKey") || "",
      code: VL.get("settings.syncCode") || ""
    };
  }
  function configured() { const c = cfg(); return !!(c.url && c.key && c.code); }
  function headers(c) {
    return { "apikey": c.key, "Authorization": "Bearer " + c.key, "Content-Type": "application/json", "Accept": "application/json" };
  }
  function setLocalOnly(key, val) { VL.suppressTouch(() => VL.set("settings." + key, val)); }

  async function pull(c) {
    const r = await fetch(`${c.url}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(c.code)}&select=data,updated_at`, { headers: headers(c) });
    if (r.status === 401 || r.status === 403) throw new Error("Clave/permiso de Supabase no válido (" + r.status + ").");
    if (!r.ok) { let d = ""; try { d = await r.text(); } catch (e) {} throw new Error("Supabase " + r.status + (d ? ": " + d.slice(0, 160) : "")); }
    const arr = await r.json();
    if (!arr || !arr.length) return null;
    return { data: arr[0].data || {}, updated_at: Number(arr[0].updated_at) || 0 };
  }

  async function push(c, local, updatedAt) {
    const data = JSON.parse(JSON.stringify(local));
    if (data.settings) LOCAL_ONLY.forEach(k => delete data.settings[k]);
    const body = [{ id: c.code, data, updated_at: updatedAt || Date.now() }];
    const r = await fetch(`${c.url}/rest/v1/${TABLE}?on_conflict=id`, {
      method: "POST",
      headers: Object.assign(headers(c), { "Prefer": "resolution=merge-duplicates,return=minimal" }),
      body: JSON.stringify(body)
    });
    if (!r.ok) { let d = ""; try { d = await r.text(); } catch (e) {} throw new Error("Supabase " + r.status + (d ? ": " + d.slice(0, 160) : "")); }
  }

  function adopt(remote) {
    const local = VL.load();
    const data = remote.data || {};
    data.settings = data.settings || {};
    LOCAL_ONLY.forEach(k => { const v = local.settings ? local.settings[k] : undefined; if (v !== undefined) data.settings[k] = v; });
    VL.replaceAll(data, remote.updated_at);
  }

  async function sync() {
    const c = cfg();
    if (!c.url || !c.key || !c.code) return { ok: false, action: "not-configured" };
    const remote = await pull(c);
    const local = VL.load();
    const localUpdated = (local.meta && local.meta.updatedAt) || 0;
    if (remote && remote.updated_at > localUpdated) {
      adopt(remote);
      setLocalOnly("cloudLastSync", Date.now());
      return { ok: true, action: "pulled" };
    }
    if (!remote || localUpdated > (remote ? remote.updated_at : 0)) {
      await push(c, local, localUpdated || Date.now());
      setLocalOnly("cloudLastSync", Date.now());
      return { ok: true, action: "pushed" };
    }
    return { ok: true, action: "in-sync" };
  }

  // Empuje automático con debounce tras cada cambio
  let _t = null;
  function scheduleSync() {
    if (!configured() || !VL.get("settings.cloudAuto")) return;
    clearTimeout(_t);
    _t = setTimeout(() => { sync().catch(e => console.warn("cloud push:", e.message)); }, 2500);
  }

  function init() {
    VL.onChange(scheduleSync);
    if (configured() && VL.get("settings.cloudAuto")) {
      sync().then(res => {
        if (res.action === "pulled" && window.App && window.App.current) {
          window.App.render(window.App.current()); window.App.updateContext();
        }
      }).catch(e => console.warn("cloud init:", e.message));
    }
  }

  window.VLCloud = { sync, configured, init, setLocalOnly, cfg };
})();
