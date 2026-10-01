// Site CookOnTime : les fichiers statiques sont servis tels quels ; seule l'adresse
// /api/signup passe par ce code. Elle enregistre une demande d'accès anticipé
// (e-mail, appareil, envie de tester sur Android) dans la base D1 « cookontime-signups ».
// Lire les inscriptions :
//   npx wrangler d1 execute cookontime-signups --remote --command "select * from signups order by id desc"

const DEVICES = new Set(["android-tablet", "android-phone", "ipad", "iphone"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/signup") return env.ASSETS.fetch(request);
    if (request.method !== "POST") return json({ ok: false, error: "method" }, 405);

    let data;
    try {
      data = await request.json();
    } catch {
      return json({ ok: false, error: "format" }, 400);
    }

    // Champ piège invisible : un humain le laisse vide, un robot le remplit.
    if (data.website) return json({ ok: true });

    const email = String(data.email || "").trim().toLowerCase().slice(0, 254);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ ok: false, error: "email" }, 400);
    const device = DEVICES.has(data.device) ? data.device : null;
    const tester = data.tester ? 1 : 0;
    const lang = data.lang === "fr" ? "fr" : "en";

    await env.DB.prepare(
      `insert into signups (email, device, tester, lang, country, created_at)
       values (?1, ?2, ?3, ?4, ?5, datetime('now'))
       on conflict(email) do update set device = excluded.device, tester = max(tester, excluded.tester)`
    ).bind(email, device, tester, lang, request.cf?.country || null).run();

    return json({ ok: true });
  },
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8" } });
}
