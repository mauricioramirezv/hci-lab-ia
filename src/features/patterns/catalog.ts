

export const antiPatterns = [
  { id: 'form', title: 'Formulario', good: 'Etiqueta persistente, ayuda concreta y validación junto al campo.', bad: 'Placeholder como etiqueta y mensaje “Error 405”.', principle: 'Prevención y recuperación' },
  { id: 'navigation', title: 'Navegación', good: 'Ubicación actual visible y nombres orientados a tareas.', bad: 'Iconos ambiguos, enlaces duplicados y cambios de posición.', principle: 'Consistencia y awareness' },
  { id: 'feedback', title: 'Retroalimentación', good: 'Estado, progreso y resultado comunicados visual y programáticamente.', bad: 'Carga silenciosa y confirmación que desaparece.', principle: 'Visibilidad del estado' },
  { id: 'choice', title: 'Decisiones', good: 'Opciones comparables, recomendación explicada y salida disponible.', bad: 'Opción preseleccionada, urgencia falsa y cancelación escondida.', principle: 'Control y ética' },
  { id: 'content', title: 'Contenido', good: 'Lenguaje directo, jerarquía clara y bloques breves.', bad: 'Texto denso, tecnicismos y mayúsculas sostenidas.', principle: 'Cognición y legibilidad' },
  { id: 'privacy', title: 'Privacidad', good: 'Solicita solo datos necesarios y explica su uso.', bad: 'Consentimiento acoplado y recolección excesiva.', principle: 'Confianza y transparencia' },
];
