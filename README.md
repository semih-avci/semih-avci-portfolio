# Portfolio — Semih Avci

Site personnel en HTML, CSS et JavaScript, publié sur GitHub Pages.

https://semih-avci.github.io/semih-avci-portfolio/

## Présentation

La refonte du 11 octobre 2026 conserve le noir et le doré, ajoute un accueil présentant les projets, un style commun en verre dépoli, une navigation accessible et des animations qui respectent la préférence de réduction des mouvements. Tous les contenus détaillés, certifications et ressources restent disponibles.

- `themes/atelier.css` : identité visuelle commune et adaptations mobiles.
- `scripts/atelier.js` : menu, apparitions, reflets, fenêtres de détail et particules.
- Les feuilles CSS existantes conservent les mises en page propres à chaque rubrique.

## Sauvegarde de l'ancienne version

La branche `backup/portfolio-before-redesign-2026-10-11` conserve l'intégralité du site avant la refonte, au commit `a3cd236c0668d43fb25c066a21456953ae5a8323`.

Pour restaurer les fichiers de cette version avec un nouveau commit, à partir d'une copie de travail propre :

```sh
git switch main
git pull --ff-only
git fetch origin backup/portfolio-before-redesign-2026-10-11
git restore --source=origin/backup/portfolio-before-redesign-2026-10-11 -- .
git add -A
git commit -m "Restore portfolio before October 2026 redesign"
git push origin main
```

Cette opération remplace les fichiers de la version actuelle par ceux de la sauvegarde. Sauvegarder d'abord tout travail local non validé.

## V2 cybersécurité — 14 octobre 2026

Reprise de la refonte noir et doré, avec un réseau de particules et des impulsions, des orbites autour du portrait, des reflets, des cartes inclinables, des apparitions progressives et un indicateur de lecture. Le bouton du pied de page mémorise le choix d'animations. La préférence système de réduction des mouvements reste prioritaire ; le canvas est arrêté sur écran tactile et en onglet masqué.

La navigation partage ses dimensions, sa typographie et ses neuf colonnes sur toutes les pages actives. Le dossier historique `Portfolio/` reste archivé et n'est pas utilisé par la navigation publiée.

Ajouts éditoriaux : fiches SAE 2.01 (segmentation, DMZ, ACL) et OSPF/MPLS (GNS3, LDP, LIB/LFIB), liens entre compétences et réalisations, orientation cybersécurité et situation BUT 2. Les travaux sont présentés comme des expériences de formation ; les objectifs de progression restent distincts des réalisations.

La branche `backup/portfolio-before-cyber-motion-2026-10-14` conserve exactement le site précédemment publié, au commit `d631bbc3af0aeb0b48ecc24043e74ee8642ade95`. La branche `design/portfolio-glass-gold` conserve la première refonte.

Vérifications reproductibles :

```sh
python checks/verify_site.py
node --check scripts/atelier.js
node checks/motion-smoke.cjs
git diff --check
```

Le contrôle statique vérifie les ressources et ancres locales, les identifiants et la navigation des 27 pages actives. Le test JavaScript vérifie les états du menu et des animations dans un environnement DOM simulé. Aucun contrôle visuel dans un navigateur n'a été réalisé pour cette mise à jour.

### Ajustement après retour visuel

Le soulignement de navigation est placé sous la ligne de texte, à une distance indépendante de la hauteur des liens. Les cartes restent fixes : aucun effet d’inclinaison, de flottement ou de déplacement au survol. Les reflets et le fond animé sont conservés. Les deux nouvelles fiches suivent désormais le plan Contexte, Travail fourni, Difficultés rencontrées, Résultats, avec un sommaire à ancres. Les récits des autres projets sont conservés.
