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
