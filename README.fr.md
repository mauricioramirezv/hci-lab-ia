# HCI Lab + IA

[Español](README.es.md) · [English](README.en.md) · [Português](README.pt-BR.md) · [Français](README.fr.md)

Laboratoire front-end, multiformat et multilingue pour enseigner, appliquer et évaluer l’IHM, l’UX, l’accessibilité et l’intelligence artificielle.

## Fonctionnalités

- CRUD persistant des rendez-vous : créer, reprogrammer et annuler.
- Import/export JSON, création de personas, carte d’empathie et scénarios.
- Modes bonne pratique, mauvaise pratique et comparaison.
- Vues ordinateur, tablette, téléphone et montre.
- Espagnol, anglais, portugais et français à l’exécution.
- Centre d’accessibilité : thèmes clair/sombre, contraste élevé, texte 100–200 %, espacement, lecture accessible et réduction des animations.
- Démonstration lecteur d’écran et composant destiné à une courte vidéo LSC validée par un expert.
- Évaluation de Nielsen humaine et par IA avec sévérité, preuve et validation.
- SUS, SEQ, réussite, temps, erreurs et émotion par participant.
- Métriques calculées à partir des preuves et export CSV.
- Contrat IA extensible ; un fournisseur réel exige un proxy serveur sécurisé.
- Vitest, Playwright, Selenium, axe-core et guide Katalon.
- Publication automatique sur GitHub Pages.

## Installation et exécution

```bash
git clone https://github.com/mauricioramirezv/hci-lab-ia.git
cd hci-lab-ia
npm install
npm run dev
```

## Vérification

```bash
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

## Accessibilité et IA

L’objectif pédagogique est WCAG 2.2 AA. Les tests automatiques doivent être complétés par des essais au clavier, avec zoom, lecteur d’écran et utilisateurs divers. Les clés IA ne doivent jamais être stockées dans le front-end.

## Licence

MIT.


## Mise à jour multimodale 2.2.0

Nouvelle route `#/multimodal` : huit contextes simulés ; filtres approximatifs de perception des couleurs ; reconnaissance et synthèse vocales facultatives ; son et vibration avec retour visuel ; observations persistantes dans le JSON du projet. Les commandes et le tableau du module sont traduits. Certaines pages existantes et activités conceptuelles restent en espagnol. Les API dépendent du navigateur ; le matériel réel doit être vérifié séparément.

See [README.md](README.md) and [ACTUALIZAR_WINDOWS.md](ACTUALIZAR_WINDOWS.md).
