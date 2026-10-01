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

-- Clics sur les boutons « Télécharger » (aucune donnée personnelle).
create table if not exists clicks (
  id integer primary key autoincrement,
  button text not null,   -- header, hero, middle, bottom
  lang text,              -- fr ou en
  country text,           -- pays donné par Cloudflare
  created_at text not null
);
