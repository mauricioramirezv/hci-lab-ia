# Archivos para revisión previa a publicación

Versión preparada: **2.5.0**. Este inventario refleja los cambios respecto a HEAD `8d7412d` e incluye el trabajo recibido previamente. Tras completar la revisión final, se creará el commit local autorizado `feat: preparar HCI Lab IA 2.5.0 para publicación`. No se hará push, merge, release ni despliegue. El hash del commit se informará al terminar.

## Archivos previstos para el commit local: 142 archivos

| Estado | Archivo |
| --- | --- |
| Modificado | `.github/workflows/deploy-pages.yml` |
| Modificado | `.github/workflows/quality.yml` |
| Modificado | `CHANGELOG.md` |
| Modificado | `README.md` |
| Modificado | `docs/README.md` |
| Nuevo | `docs/archivos-publicacion.md` |
| Modificado | `docs/arquitectura.md` |
| Nuevo | `docs/cierre-integral.md` |
| Nuevo | `docs/crud-laboratorio.md` |
| Modificado | `docs/desarrollo.md` |
| Modificado | `docs/estructura.md` |
| Nuevo | `docs/persistencia-privacidad.md` |
| Nuevo | `docs/preferencias-visualizacion.md` |
| Modificado | `docs/pruebas.md` |
| Nuevo | `docs/usuarios.md` |
| Modificado | `package-lock.json` |
| Modificado | `package.json` |
| Modificado | `src/app/App.tsx` |
| Nuevo | `src/app/RouteBoundary.tsx` |
| Modificado | `src/app/activities.css` |
| Modificado | `src/app/i18n.ts` |
| Modificado | `src/app/locales/activities.ts` |
| Nuevo | `src/app/locales/closure.ts` |
| Nuevo | `src/app/locales/crud.ts` |
| Nuevo | `src/app/locales/interface.ts` |
| Modificado | `src/app/locales/projectActivities.ts` |
| Modificado | `src/app/main.tsx` |
| Modificado | `src/app/shell.css` |
| Modificado | `src/features/accessibility/application/index.ts` |
| Nuevo | `src/features/accessibility/application/preferences.ts` |
| Nuevo | `src/features/accessibility/displayPreferences.css` |
| Nuevo | `src/features/accessibility/infrastructure/displayPreferences.ts` |
| Modificado | `src/features/accessibility/infrastructure/index.ts` |
| Modificado | `src/features/accessibility/infrastructure/sensoryFeedback.ts` |
| Nuevo | `src/features/accessibility/interfaceText.json` |
| Nuevo | `src/features/accessibility/locales.ts` |
| Modificado | `src/features/accessibility/presentation/AccessibilityPage.tsx` |
| Nuevo | `src/features/accessibility/presentation/DisplayPreferenceControls.tsx` |
| Nuevo | `src/features/accessibility/presentation/DisplayPreferencesPanel.tsx` |
| Modificado | `src/features/accessibility/presentation/Sensory.tsx` |
| Modificado | `src/features/accessibility/presentation/index.ts` |
| Nuevo | `src/features/accessibility/presentation/useDisplayPreferences.ts` |
| Modificado | `src/features/ai/presentation/AI.tsx` |
| Modificado | `src/features/chatbots/presentation/Chatbots.tsx` |
| Nuevo | `src/features/concepts/interfaceText.json` |
| Modificado | `src/features/concepts/presentation/ConceptDemo.tsx` |
| Modificado | `src/features/concepts/presentation/ConceptsOverview.tsx` |
| Modificado | `src/features/course/CoursePage.tsx` |
| Nuevo | `src/features/course/interfaceText.json` |
| Modificado | `src/features/dashboard/DashboardPage.tsx` |
| Modificado | `src/features/dashboard/Presets.tsx` |
| Nuevo | `src/features/dashboard/interfaceText.json` |
| Modificado | `src/features/devices/DevicesPage.tsx` |
| Nuevo | `src/features/devices/interfaceText.json` |
| Modificado | `src/features/evaluation/application/findings.ts` |
| Modificado | `src/features/evaluation/domain/validation.ts` |
| Modificado | `src/features/evaluation/locales.ts` |
| Modificado | `src/features/evaluation/presentation/Evaluation.tsx` |
| Modificado | `src/features/experiments/application/recordExperiment.ts` |
| Nuevo | `src/features/experiments/domain/displayContext.ts` |
| Modificado | `src/features/experiments/domain/index.ts` |
| Nuevo | `src/features/experiments/infrastructure/index.ts` |
| Modificado | `src/features/experiments/presentation/Experiments.tsx` |
| Modificado | `src/features/metrics/MetricsPage.tsx` |
| Modificado | `src/features/metrics/Summary.tsx` |
| Nuevo | `src/features/metrics/interfaceText.json` |
| Nuevo | `src/features/multimodal/interfaceText.json` |
| Modificado | `src/features/multimodal/presentation/ConceptActivity.tsx` |
| Modificado | `src/features/multimodal/presentation/DeviceComparison.tsx` |
| Modificado | `src/features/multimodal/presentation/MultimodalPage.tsx` |
| Nuevo | `src/features/patterns/interfaceText.json` |
| Modificado | `src/features/patterns/presentation/PracticesOverview.tsx` |
| Modificado | `src/features/project/domain/backup.ts` |
| Modificado | `src/features/project/domain/preferences.ts` |
| Modificado | `src/features/project/domain/state.ts` |
| Modificado | `src/features/project/infrastructure/projectServices.ts` |
| Modificado | `src/features/project/infrastructure/storage.ts` |
| Modificado | `src/features/quality/QualityPage.tsx` |
| Nuevo | `src/features/quality/interfaceText.json` |
| Modificado | `src/features/reports/domain/details.ts` |
| Modificado | `src/features/reports/domain/records.ts` |
| Modificado | `src/features/reports/locales.ts` |
| Modificado | `src/features/reports/presentation/ReportsModule.tsx` |
| Modificado | `src/features/reports/presentation/reportFormat.ts` |
| Modificado | `src/features/reports/styles.css` |
| Modificado | `src/features/research/application/operations.ts` |
| Modificado | `src/features/research/domain/rules.ts` |
| Modificado | `src/features/research/domain/validation.ts` |
| Modificado | `src/features/research/presentation/Research.tsx` |
| Nuevo | `src/features/reservations/interfaceText.json` |
| Modificado | `src/features/reservations/presentation/AppointmentFlow.tsx` |
| Modificado | `src/features/reservations/presentation/Reservations.tsx` |
| Modificado | `src/features/tracking/presentation/Controls.tsx` |
| Modificado | `src/features/tracking/presentation/TrackingProvider.tsx` |
| Nuevo | `src/features/users/application/index.ts` |
| Nuevo | `src/features/users/domain/index.ts` |
| Nuevo | `src/features/users/infrastructure/index.ts` |
| Nuevo | `src/features/users/locales.ts` |
| Nuevo | `src/features/users/presentation/UserExample.tsx` |
| Nuevo | `src/features/users/presentation/UsersPage.tsx` |
| Nuevo | `src/features/users/presentation/index.ts` |
| Nuevo | `src/features/users/styles.css` |
| Modificado | `src/shared/styles/forms.css` |
| Nuevo | `src/shared/ui/FormActions.tsx` |
| Modificado | `src/shared/ui/Forms.tsx` |
| Modificado | `src/shared/ui/Page.tsx` |
| Nuevo | `src/shared/ui/useDraftGuard.tsx` |
| Nuevo | `src/shared/ui/useInterfaceText.ts` |
| Modificado | `tests/e2e/browser-zoom.spec.ts` |
| Modificado | `tests/e2e/concepts.spec.ts` |
| Modificado | `tests/e2e/core-flow.spec.ts` |
| Nuevo | `tests/e2e/crud-consistency.spec.ts` |
| Nuevo | `tests/e2e/display-preferences.spec.ts` |
| Modificado | `tests/e2e/evaluation.spec.ts` |
| Nuevo | `tests/e2e/interface-languages.spec.ts` |
| Nuevo | `tests/e2e/laboratory-journey.spec.ts` |
| Modificado | `tests/e2e/learning-workflows.spec.ts` |
| Modificado | `tests/e2e/module-persistence.spec.ts` |
| Modificado | `tests/e2e/patterns.spec.ts` |
| Modificado | `tests/e2e/project-activities-integrity.spec.ts` |
| Modificado | `tests/e2e/project-activities.spec.ts` |
| Modificado | `tests/e2e/project-management.spec.ts` |
| Modificado | `tests/e2e/reservations-persistence.spec.ts` |
| Nuevo | `tests/e2e/route-loading.spec.ts` |
| Modificado | `tests/e2e/shell.spec.ts` |
| Nuevo | `tests/e2e/users.spec.ts` |
| Nuevo | `tests/fixtures/crudProject.ts` |
| Modificado | `tests/playwright.config.ts` |
| Nuevo | `tests/support/crud.ts` |
| Nuevo | `tests/tools/audit-release.cjs` |
| Nuevo | `tests/tools/check-translations.cjs` |
| Modificado | `tests/unit/app.test.tsx` |
| Nuevo | `tests/unit/crudConsistency.test.ts` |
| Nuevo | `tests/unit/displayPreferenceIntegration.test.tsx` |
| Nuevo | `tests/unit/displayPreferences.test.ts` |
| Nuevo | `tests/unit/interfaceTranslations.test.ts` |
| Modificado | `tests/unit/learning-workflows.test.tsx` |
| Nuevo | `tests/unit/legacyInterface.test.tsx` |
| Modificado | `tests/unit/multimodal.test.tsx` |
| Nuevo | `tests/unit/users.test.ts` |
| Nuevo | `tests/unit/usersProject.test.tsx` |
| Modificado | `vite.config.ts` |

## Distribución de producción: 42 archivos

Estos archivos de `dist/` son generados e ignorados. El workflow subiría esta distribución mediante el artefacto de Pages, una vez autorizada y verificada la publicación. **No son archivos para versionar en Git.** Sus nombres identifican la compilación revisada; otra compilación puede cambiar los hashes.

| Archivo | Bytes | SHA-256 |
| --- | ---: | --- |
| `dist/assets/check-Boe33hLN.js` | 116 | `9b217991b85a4f5c40fc2d17ca4f12aa2d93677b349c6fa28ae5ef8dd0a1fae8` |
| `dist/assets/chevron-right-D4tBQnvx.js` | 126 | `b187f3b08f8927dde26572a9862b19a999bb0cd0f92bf6850dd61601bc13304e` |
| `dist/assets/CoursePage-D4ry2UyH.js` | 3087 | `2a61c02a9703c857338b99147d6d2160a0c66a34f16b07b52420b82ed5f55707` |
| `dist/assets/DevicesPage-CsVtoXLE.js` | 6620 | `e86d51405dd6e3841f7056e4f5f48833d259b988d8b5a32dba79ed2167485db8` |
| `dist/assets/heuristics-BXbXc-oL.js` | 10067 | `3e28f44727b36caba8505a395c07aa6cd4e332c3b7cf552eb9b26491833bfed6` |
| `dist/assets/i18n-BFsssOkb.js` | 47799 | `de6f2ea9721c994eac02db65f47fd425a4d8852fc0c35fa82ae55bc1eb6f952d` |
| `dist/assets/index-B-rgL51x.js` | 26821 | `2c0eb5729c59410ce29ea39a8ed58a01b752aa838b94ef61714a2fd530ee8335` |
| `dist/assets/index-BaBvbh6Q.js` | 4020 | `62859e04576760d13ec0c49502ea3dd091a376457ac442a06b9193259bcfdcb7` |
| `dist/assets/index-BwhztOZ1.css` | 3887 | `6b14da2595949f7679330e22958665c06ed28909f55c8395080b4a947f994ff0` |
| `dist/assets/index-C8b_0w_8.js` | 7599 | `5b62bdd45ac3f668a1f741a863647716242927fe4f19626e9d7d4705ade36b5d` |
| `dist/assets/index-Cc6VhWRp.js` | 14145 | `b90b243f381a7888b352e553f5e745f02fee54410b85cf575215929348f3de59` |
| `dist/assets/index-CeJTVaHN.css` | 3650 | `81d6e33a40591bb1c7f404973cf4faae4774598c6b21a513e6a8687773d0f344` |
| `dist/assets/index-CeTmn1DG.js` | 20593 | `a8128be6576c799846dc5f30dc2478ff9baa39f58abf3f39c34ddaead4820b60` |
| `dist/assets/index-CfNFgTAn.js` | 7349 | `add76e3cfdb15d33d4546184d97d927de462b75dc5e5d4f802f758453e4e5c90` |
| `dist/assets/index-Cj0q6NzO.css` | 869 | `89ce440f75724d7e1957274cf9895beaf1f0b1714f311c0a161ae70e3134808a` |
| `dist/assets/index-DKGkvtln.js` | 142118 | `718a3f67ce766301fe3a249550f483db7f7d78945ecf2cf12f7169525137a2de` |
| `dist/assets/index-DNN9cwy6.css` | 3298 | `e21c5ede12f49d85b7135e33b5046f693a676ea742b0f83aab3e5b4bea83ee20` |
| `dist/assets/index-DoVZr0Ll.css` | 49580 | `6056cd3c9f8910703f70e6677fd2e1e838e7311858713572ae66090be30f3a29` |
| `dist/assets/index-DrHXdq53.js` | 10506 | `20a005210ac1b3dbb2af40d8562c3686868df87d2a3365076161bc84ee6e84b5` |
| `dist/assets/index-MFugi0WC.js` | 36936 | `e5dcebaab7769be473af9aaf737fa056e832f462b3582b616f24e193f415d6eb` |
| `dist/assets/index-vMtLhWkf.js` | 7716 | `cf437acbfe1662366b9f80585147e4daed7d50cc56b45c9e387437e650edf952` |
| `dist/assets/MetricsPage-DzkHfM7S.js` | 4096 | `8ee95c3b6f3bff953e314542d381862aa1a722bb14d1b7845d46d98e3a831aff` |
| `dist/assets/model-BLH4o7h3.js` | 482 | `25106b77ff920b2934e75871ac0221c4338e71abe63df1e810afd0da91086800` |
| `dist/assets/model-ClOJ6U5t.js` | 290 | `7c80175e141b0592212b5ee6274b052f7551f02cc91554202c256ef7078b0950` |
| `dist/assets/mouse-pointer-2-C8IIL3_F.js` | 246 | `ec6f5d94975dbed114f526d3f653699a72722470483040a21623907e67ea06f2` |
| `dist/assets/QualityPage-CVLi21Jm.js` | 2826 | `75859f6ba0d95a55af03c465a9e6077945ec1db24d00f8e1975005c21e906965` |
| `dist/assets/react-uXWhiKni.js` | 259835 | `04b40e8d3a8a1f53af3c584178676d602f884600a469abab3c9b69c17214a02a` |
| `dist/assets/Records-By1hs92U.js` | 2674 | `7a51f07667653e6b2695e4334f1828ed475716bcc8c8d35452e3ff38753c6c43` |
| `dist/assets/translations-accessibility-CiZGR-5n.js` | 15973 | `26d8320932c52b3eff9fd557a59a0ceacb74f9148fc3ac4ce5fd0d97d69b5490` |
| `dist/assets/translations-concepts-r93edvG5.js` | 104827 | `f1fddd8a57ce63d4461d679def972e8025588a1c4c78545da1414b82de300820` |
| `dist/assets/translations-evaluation-DcGOoRGC.js` | 46040 | `5c23377707c38ddce279f0db06c942113196157cfefd0731aa0fa59708843eea` |
| `dist/assets/translations-multimodal-V5_wARHS.js` | 25923 | `b9ffa2a8573edf44cbc11c0fde85c488d2d26b9872a77b2758d9ac371548baef` |
| `dist/assets/translations-patterns-Cx1Qaqhh.js` | 76268 | `8a9f3517b39b5e3fb3a0dd120ccf80d3dfe3b6d40048337f82a3239be6300151` |
| `dist/assets/translations-project-ChvrkPa_.js` | 17405 | `e3cf6c78b54aa0fd65752ae5eb0c1d1b92ae55ab9573308ccd505a45df96492a` |
| `dist/assets/translations-reports-CSebt-l_.js` | 40680 | `a665375edcd0e8cc9f03b96af6ad273574a40baa1a201807a76f0f0b13185c76` |
| `dist/assets/translations-shared-Co7eBcKn.js` | 183163 | `c0a67eeef1a50308bbdf625d2e3cb9361eb0ae74ae24e7888b9a7cff430b2a8c` |
| `dist/assets/translations-tracking-xCO7D-_z.js` | 38088 | `f75dd5debad2d5611493bf07babbc5b616213ef3f65de3d6830cdf9171d060b9` |
| `dist/assets/translations-users-DLt8prGB.js` | 13151 | `ed7534e03b57255d870d352e037b74841c7c3095a346b19fe2d1aca5e3ea1768` |
| `dist/assets/workload-8LVzdbnb.js` | 519 | `d369b03de77b8f595e2efeda0a47e2acf0e9f13ecb74d8845f9326d1bd7bc532` |
| `dist/favicon.svg` | 229 | `3c765528ebb3038c028cf41d559e013bdf0d866353561801ed0cef052256c4f7` |
| `dist/index.html` | 1770 | `da1a287ec23354cdd7751b49d2ec3bed9c84e12c7be2c7d38b0f569eeea3649e` |
| `dist/sign-language/README.md` | 307 | `7e9ecc312b443892e0969ef6c2b65832ade9a869906d6c58ca2596aea879785d` |

Los resultados, reportes, herramientas locales, temporales y cachés están excluidos del commit. La tabla enumera los 142 archivos de código, pruebas, configuración y documentación previstos para el commit local; la lista de `dist/` es un inventario de los recursos de producción generados y comprobados, no una solicitud para versionarlos. El [cierre integral](cierre-integral.md) contiene los pendientes y la revisión manual necesaria.
