// Site CookOnTime : les fichiers statiques sont servis tels quels ; seules les adresses
// /api/* passent par ce code.
//   /api/signup : enregistre une demande d'accès anticipé (e-mail, appareil, envie de
//                 tester sur Android) dans la base D1 « cookontime-signups », puis prévient
//                 Serge par e-mail à chaque nouvelle inscription.
//   /api/click  : compte un clic sur un bouton « Télécharger » (bouton, langue, pays).
// Lire les données :
//   npx wrangler d1 execute cookontime-signups --remote --command "select * from signups order by id desc"
//   npx wrangler d1 execute cookontime-signups --remote --command "select button, lang, count(*) from clicks group by 1, 2"
import { EmailMessage } from "cloudflare:email";

const DEVICES = { "android-tablet": "Tablette Android", "android-phone": "Téléphone Android", ipad: "iPad", iphone: "iPhone" };
const BUTTONS = new Set(["header", "hero", "middle", "bottom"]);
const FROM = "site@cookontime.app";
const TO = "sergemenassa@gmail.com";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/signup") return signup(request, env, ctx);
    if (url.pathname === "/api/click") return click(request, env);
    return env.ASSETS.fetch(request);
  },
};

async function readJson(request) {
  if (request.method !== "POST") return null;
  try {
    return JSON.parse(await request.text());
  } catch {
    return null;
  }
}

async function click(request, env) {
  const data = await readJson(request);
  if (!data) return json({ ok: false }, 400);
  const button = BUTTONS.has(data.button) ? data.button : "other";
  const lang = data.lang === "fr" ? "fr" : "en";
  await env.DB.prepare("insert into clicks (button, lang, country, created_at) values (?1, ?2, ?3, datetime('now'))")
    .bind(button, lang, request.cf?.country || null).run();
  return json({ ok: true });
}

async function signup(request, env, ctx) {
  const data = await readJson(request);
  if (!data) return json({ ok: false, error: "format" }, 400);

  // Champ piège invisible : un humain le laisse vide, un robot le remplit.
  if (data.website) return json({ ok: true });

  const email = String(data.email || "").trim().toLowerCase().slice(0, 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ ok: false, error: "email" }, 400);
  const device = data.device in DEVICES ? data.device : null;
  const tester = data.tester ? 1 : 0;
  const lang = data.lang === "fr" ? "fr" : "en";
  const country = request.cf?.country || null;

  const existing = await env.DB.prepare("select id from signups where email = ?1").bind(email).first();
  await env.DB.prepare(
    `insert into signups (email, device, tester, lang, country, created_at)
     values (?1, ?2, ?3, ?4, ?5, datetime('now'))
     on conflict(email) do update set device = coalesce(excluded.device, device), tester = max(tester, excluded.tester)`
  ).bind(email, device, tester, lang, country).run();

  // Un e-mail à Serge par nouvelle inscription seulement ; un échec d'envoi ne bloque pas l'inscription.
  if (!existing && env.NOTIFY) ctx.waitUntil(notify(env, { email, device, tester, lang, country }).catch(() => {}));

  return json({ ok: true });
}

async function notify(env, s) {
  const { n } = await env.DB.prepare("select count(*) as n from signups").first();
  const { t } = await env.DB.prepare("select count(*) as t from signups where tester = 1").first();
  const subject = `CookOnTime : nouvelle inscription (${n} au total)`;
  const body = [
    `Nouvelle inscription sur cookontime.app :`,
    ``,
    `E-mail : ${s.email}`,
    `Appareil : ${DEVICES[s.device] || "non indiqué"}`,
    `Testeur Android : ${s.tester ? "oui" : "non"}`,
    `Page : ${s.lang === "fr" ? "française" : "anglaise"}`,
    `Pays : ${s.country || "inconnu"}`,
    ``,
    `Total : ${n} inscrits, dont ${t} testeurs Android (il en faut 12 pour le test fermé).`,
  ].join("\r\n");
  const raw = [
    `From: CookOnTime <${FROM}>`,
    `To: ${TO}`,
    `Subject: =?UTF-8?B?${b64(subject)}?=`,
    `Message-ID: <${crypto.randomUUID()}@cookontime.app>`,
    `Date: ${new Date().toUTCString()}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    b64(body).replace(/.{76}/g, "$&\r\n"),
  ].join("\r\n");
  await env.NOTIFY.send(new EmailMessage(FROM, TO, raw));
}

function b64(text) {
  let bin = "";
  for (const byte of new TextEncoder().encode(text)) bin += String.fromCharCode(byte);
  return btoa(bin);
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8" } });
}
