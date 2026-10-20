# Katalon companion

Open `tests/katalon/HCI-Lab-IA.prj` in Katalon Studio. Run application commands from the repository root; all companion project resources remain together under `tests/katalon/`.

Use Katalon Studio to reproduce the same critical flows automated with Playwright:

1. Start the application with `npm run dev`.
2. Create a Web UI project.
3. Record the appointment, accessibility preference and responsive navigation flows.
4. Save objects by semantic attributes (`role`, accessible name and stable identifiers).
5. Create a suite named `HCI Lab Regression` and run it in Chrome and Firefox.

The canonical executable tests remain under `tests/e2e/`; the companion project documents the external low-code alternative. See the [test guide](pruebas.md).
