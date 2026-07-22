# Cadence — Landing page

Page vitrine bilingue du **minuteur de cuisine professionnel** *Cadence*.

> ⚠️ **Projet perso Serge Menassa + Henry Obegi — indépendant de Modern Leb Food / Sezam&Co.** Le produit n'appartient pas au restaurant : Sezam&Co n'apparaît que comme **testimonial** (le resto qui l'utilise). Publication **en nom propre**.

## Structure bilingue (depuis le 22/07/2026)

| URL | Langue | Fichier |
|---|---|---|
| https://sergemio.github.io/cadence-landing/ | **Anglais** (défaut monde, `x-default`) | `index.html` |
| https://sergemio.github.io/cadence-landing/fr/ | Français | `fr/index.html` |

- Balises `hreflang` croisées (`en`, `fr`, `x-default` → EN) sur les deux pages + `sitemap.xml` ; switcher FR ↔ EN dans le header et le footer. Pas de redirection automatique par langue (choix délibéré, reco Google).
- 🚨 **RÈGLE : tout changement de copy ou de structure se fait sur LES DEUX pages** (`index.html` ET `fr/index.html`). Elles partagent le même squelette HTML/CSS/JS — seuls les textes diffèrent.
- `terms.html` / `privacy.html` : en français uniquement pour l'instant (à traduire avant la soumission aux stores).

## Notes

- Pré-lancement : l'app n'est pas encore sur les stores. Les boutons App Store / Google Play sont des placeholders (« Bientôt » / "Soon").
- Nom de produit *Cadence* = provisoire (à figer).
- Doctrine copy (Serge) : « rappels »/*reminders* (jamais coaching), « voix »/« annonce vocale »/*voice announcement* (jamais « voix humaine »/*human voice* — c'est une synthèse), « étapes »/*steps*, « paramétrable »/*configurable*, **gratuit/free** = mot-clé pilier.

Mise à jour : éditer les deux `index.html` puis `git commit` + `git push` sur `main` (GitHub Pages redéploie).
