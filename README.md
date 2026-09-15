# CookOnTime — Landing page

Page vitrine bilingue du **minuteur de cuisine professionnel** *CookOnTime*.

> ⚠️ **Projet perso Serge Menassa + Henry Obegi — indépendant de Modern Leb Food / Sezam&Co.** Le produit n'appartient pas au restaurant : Sezam&Co n'apparaît que comme **testimonial** (le resto qui l'utilise). Publication **en nom propre**.

## Structure bilingue (depuis le 22/07/2026)

| URL | Langue | Fichier |
|---|---|---|
| https://cookontime.app/ | **Anglais** (défaut monde, `x-default`) | `index.html` |
| https://cookontime.app/fr/ | Français | `fr/index.html` |

- Balises `hreflang` croisées (`en`, `fr`, `x-default` → EN) sur les deux pages + `sitemap.xml` ; switcher FR ↔ EN dans le header et le footer. Pas de redirection automatique par langue (choix délibéré, reco Google).
- 🚨 **RÈGLE : tout changement de copy ou de structure se fait sur LES DEUX pages** (`index.html` ET `fr/index.html`). Elles partagent le même squelette HTML/CSS/JS — seuls les textes diffèrent.
- **Politique de confidentialité** (réécrite le 15/09/2026, à jour de v0.4.27 : journal, export/import, bande de statistiques qui n'envoie encore rien) : `privacy.html` en **anglais** (URL à déclarer aux stores : https://cookontime.app/privacy.html) et `fr/privacy.html` en français. **À mettre à jour AVANT que la télémétrie envoie quoi que ce soit** (étape 4, Firebase).
- `terms.html` : en français uniquement pour l'instant.

## Notes

- Pré-lancement : l'app n'est pas encore sur les stores. Les boutons App Store / Google Play sont des placeholders (« Bientôt » / "Soon").
- Nom de produit *CookOnTime* retenu le 15/09/2026 (ex-Cadence) ; domaine cookontime.app.
- Doctrine copy (Serge) : « rappels »/*reminders* (jamais coaching), « voix »/« annonce vocale »/*voice announcement* (jamais « voix humaine »/*human voice* — c'est une synthèse), « étapes »/*steps*, « paramétrable »/*configurable*, **gratuit/free** = mot-clé pilier.

Mise à jour : éditer les deux `index.html` puis `git commit` + `git push` sur `main` (GitHub Pages redéploie).
