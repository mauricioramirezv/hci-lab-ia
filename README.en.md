# HCI Lab + AI

[Español](README.es.md) · [English](README.en.md) · [Português](README.pt-BR.md) · [Français](README.fr.md)

A front-end, multi-device and multilingual laboratory for teaching, applying and evaluating HCI, UX, accessibility and artificial intelligence.

## Features

- Persistent appointment CRUD: create, reschedule and cancel.
- JSON project import/export, persona and empathy-map builder, and scenario builder.
- Good-practice, anti-pattern and comparison modes.
- Desktop, tablet, mobile and watch views.
- Runtime Spanish, English, Portuguese and French.
- Accessibility center with light/dark themes, high contrast, 100–200% text, reading spacing, accessible reading and reduced motion.
- Screen-reader demonstration and a component for a short expert-reviewed LSC video.
- Human and AI Nielsen evaluation with severity, evidence and review status.
- SUS, SEQ, task success, time, errors and emotion per participant.
- Evidence-based metrics with CSV export.
- Extensible AI provider contract; a real provider must use a secure server proxy.
- Vitest, Playwright, Selenium, axe-core and Katalon guidance.
- Automated GitHub Pages deployment.

## Install and run

```bash
git clone https://github.com/mauricioramirezv/hci-lab-ia.git
cd hci-lab-ia
npm install
npm run dev
```

## Verify

```bash
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

## Accessibility and AI

The teaching target is WCAG 2.2 AA. Automated checks must be complemented by keyboard, zoom, screen-reader and inclusive user tests. Never store AI keys in front-end code; remote providers require a secure proxy. AI output always requires human review.

## License

MIT.
