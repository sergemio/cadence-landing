-- Demandes d'accès anticipé à CookOnTime (formulaire du bas de page).
-- Appliquer : npx wrangler d1 execute cookontime-signups --remote --file schema.sql
create table if not exists signups (
  id integer primary key autoincrement,
  email text not null unique,
  device text,            -- android-tablet, android-phone, ipad, iphone
  tester integer not null default 0,  -- 1 = veut tester la version Android avant la sortie
  lang text,              -- fr ou en : page d'où vient l'inscription
  country text,           -- pays donné par Cloudflare (pas d'adresse IP stockée)
  created_at text not null
);
