export const heuristics = [
  'Visibilidad del estado del sistema', 'Correspondencia con el mundo real', 'Control y libertad del usuario',
  'Consistencia y estándares', 'Prevención de errores', 'Reconocimiento antes que recuerdo',
  'Flexibilidad y eficiencia de uso', 'Diseño estético y minimalista',
  'Reconocer, diagnosticar y recuperarse de errores', 'Ayuda y documentación',
];

export const concepts = [
  ['UX', 'Experiencia completa antes, durante y después de la interacción.', 'SUS, SEQ y satisfacción', 'Un flujo coherente conserva el contexto entre dispositivos.'],
  ['Usabilidad', 'Efectividad, eficiencia, aprendizaje y recuperación.', 'Éxito, tiempo y errores', 'La reserva guía, valida y permite corregir.'],
  ['Accesibilidad', 'Contenido perceptible, operable, comprensible y robusto.', 'WCAG, teclado y lector', 'Foco visible, etiquetas, contraste y zoom.'],
  ['Awareness', 'Comprensión del estado, ubicación, cambios y siguiente acción.', 'Reconocimiento del estado', 'Paso actual, guardado y confirmación visibles.'],
  ['Engagement ético', 'Participación sostenida sin presión ni patrones oscuros.', 'Finalización y abandono', 'Valor y progreso claros; cancelación disponible.'],
  ['Emoción positiva', 'Confianza, tranquilidad, control y satisfacción.', 'Valencia y confianza', 'Mensajes específicos y reversibilidad.'],
  ['Ergonomía', 'Alcance, tamaño táctil, postura y densidad por contexto.', 'Esfuerzo y precisión', 'Objetivos táctiles amplios y acciones alcanzables.'],
  ['Cognición', 'Atención, memoria de trabajo, percepción y modelos mentales.', 'Carga y recuerdo', 'Tres pasos, lenguaje familiar y reconocimiento.'],
  ['Arquitectura de información', 'Organización, etiquetado, navegación y búsqueda.', 'Éxito de localización', 'Tareas agrupadas por intención del usuario.'],
  ['Diseño universal', 'Soluciones útiles para la mayor diversidad posible.', 'Cobertura de contextos', 'Múltiples formas de percibir y operar.'],
  ['IA responsable', 'Control humano, transparencia, privacidad y trazabilidad.', 'Acuerdo humano–IA', 'La IA propone; la persona valida o rechaza.'],
] as const;

export const antiPatterns = [
  { id: 'form', title: 'Formulario', good: 'Etiqueta persistente, ayuda concreta y validación junto al campo.', bad: 'Placeholder como etiqueta y mensaje “Error 405”.', principle: 'Prevención y recuperación' },
  { id: 'navigation', title: 'Navegación', good: 'Ubicación actual visible y nombres orientados a tareas.', bad: 'Iconos ambiguos, enlaces duplicados y cambios de posición.', principle: 'Consistencia y awareness' },
  { id: 'feedback', title: 'Retroalimentación', good: 'Estado, progreso y resultado comunicados visual y programáticamente.', bad: 'Carga silenciosa y confirmación que desaparece.', principle: 'Visibilidad del estado' },
  { id: 'choice', title: 'Decisiones', good: 'Opciones comparables, recomendación explicada y salida disponible.', bad: 'Opción preseleccionada, urgencia falsa y cancelación escondida.', principle: 'Control y ética' },
  { id: 'content', title: 'Contenido', good: 'Lenguaje directo, jerarquía clara y bloques breves.', bad: 'Texto denso, tecnicismos y mayúsculas sostenidas.', principle: 'Cognición y legibilidad' },
  { id: 'privacy', title: 'Privacidad', good: 'Solicita solo datos necesarios y explica su uso.', bad: 'Consentimiento acoplado y recolección excesiva.', principle: 'Confianza y transparencia' },
];

export const course = [
  ['01', 'Fundamentos de IHC', 'Diagnóstico de dos funcionalidades por estudiante.', 'Taller 1'],
  ['02', 'Usuarios y contextos', 'Personas, empatía, escenarios y recorridos.', 'Taller 2 · Entrega 1'],
  ['03', 'Cognición y multiformato', 'Modelos mentales, arquitectura, flujos y wireframes.', 'Taller 3'],
  ['04', 'Prototipado', 'Diseño visual, navegación y prototipo con apoyo de IA.', 'Taller 4 · Entrega 2'],
  ['05', 'Accesibilidad', 'Diseño universal, WCAG y tecnologías de asistencia.', 'Evidencia A11y'],
  ['06', 'Evaluación', 'Heurísticas, usabilidad, emociones y awareness.', 'Informe comparativo'],
  ['07', 'Automatización', 'E2E, métricas, accesibilidad y rendimiento.', 'Pipeline de calidad'],
  ['08', 'IA aplicada', 'Generación, evaluación, comparación y corrección humana.', 'Proyecto final'],
] as const;

export const a11yChecks = [
  ['keyboard', 'Recorrido completo solo con teclado'],
  ['labels', 'Campos y botones tienen nombre accesible'],
  ['contrast', 'Texto e interfaz cumplen contraste mínimo'],
  ['zoom', 'Contenido funciona con zoom del 200%'],
  ['screenReader', 'Orden y anuncios verificados con lector de pantalla'],
  ['motion', 'Movimiento puede reducirse sin perder información'],
] as const;
