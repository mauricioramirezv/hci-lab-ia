import { multimodalResources } from './components/multimodal/translations';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const es = {
  nav: { dashboard:'Inicio', lab:'Laboratorio', concepts:'Conceptos', research:'Personas', practices:'Prácticas', devices:'Dispositivos', accessibility:'Accesibilidad', evaluation:'Evaluación', userTesting:'Pruebas UX', metrics:'Métricas', ai:'IA', quality:'Calidad', tests:'Pruebas', course:'Curso' },
  common: { title:'HCI Lab + IA', subtitle:'Laboratorio evolutivo de interacción humano-computador', good:'Buena práctica', bad:'Mala práctica', compare:'Comparar', save:'Guardar', continue:'Continuar', back:'Atrás', reset:'Restablecer', export:'Exportar', language:'Idioma', status:'Estado', close:'Cerrar' },
  lab: { title:'Flujo de reserva de citas', intro:'Complete la tarea y observe cómo cambian la experiencia, las métricas y la accesibilidad.', service:'Servicio', date:'Fecha', time:'Hora', confirm:'Confirmar cita', success:'Cita confirmada correctamente', select:'Seleccione una opción', steps:'Progreso del flujo', badMessage:'Algo salió mal. Código 405.', goodMessage:'Revise la fecha: debe seleccionar una fecha disponible.' },
  concepts: { title:'Mapa integral de IHC y UX', intro:'Cada concepto tiene un ejemplo, una mala práctica, una métrica y una forma de evaluación.' },
  accessibility: { title:'Centro de accesibilidad', theme:'Tema', light:'Claro', dark:'Oscuro', contrast:'Alto contraste', font:'Tamaño del texto', spacing:'Espaciado para lectura', dyslexia:'Modo de lectura accesible', motion:'Reducir movimiento', screen:'Demostración para lector de pantalla', announce:'Anunciar actualización', lsc:'Ejemplo multimedia en LSC', transcript:'Transcripción: esta demostración explica cómo confirmar una cita. El video final debe ser validado por una persona competente en LSC.', upload:'Cargar ejemplo de video LSC' },
  devices: { title:'Laboratorio multiformato', intro:'La información se prioriza de manera diferente en cada dispositivo.', desktop:'Computador', tablet:'Tableta', mobile:'Celular', watch:'Reloj' },
  evaluation: { title:'Evaluación heurística humana + IA', intro:'Registre hallazgos y compárelos con una evaluación asistida por IA.', heuristic:'Heurística', severity:'Severidad', evidence:'Evidencia', problem:'Problema', recommendation:'Recomendación', add:'Agregar hallazgo', runAI:'Ejecutar evaluación IA', noFindings:'Todavía no hay hallazgos.', aiResult:'La IA detectó problemas potenciales que requieren validación humana.' },
  metrics: { title:'Panel de métricas', completed:'Tareas completadas', time:'Tiempo promedio', errors:'Errores', accessibility:'Puntuación de accesibilidad', awareness:'Comprensión del estado', engagement:'Finalización', emotion:'Confianza', performance:'Rendimiento' },
  ai: { title:'AI Studio', intro:'Genere escenarios y evaluaciones mediante un proveedor simulado y revisable.', type:'Tipo de generación', persona:'Protopersona', scenario:'Escenario adverso', interface:'Alternativa de interfaz', prompt:'Instrucción', generate:'Generar', result:'Resultado generado', disclaimer:'La salida de IA debe ser revisada antes de incorporarla.' },
  tests: { title:'Calidad y automatización', intro:'Cobertura prevista para calidad funcional, accesibilidad, rendimiento y multiformato.' },
  course: { title:'Evolución por clases', intro:'El repositorio conserva evidencias y versiones de cada etapa del curso.' }
};

const en = {
  nav:{ dashboard:'Home', lab:'Lab', concepts:'Concepts', research:'People', practices:'Practices', devices:'Devices', accessibility:'Accessibility', evaluation:'Evaluation', userTesting:'UX tests', metrics:'Metrics', ai:'AI', quality:'Quality', tests:'Tests', course:'Course' },
  common:{ title:'HCI Lab + AI', subtitle:'Evolving human-computer interaction laboratory', good:'Good practice', bad:'Bad practice', compare:'Compare', save:'Save', continue:'Continue', back:'Back', reset:'Reset', export:'Export', language:'Language', status:'Status', close:'Close' },
  lab:{ title:'Appointment booking flow', intro:'Complete the task and observe changes in experience, metrics and accessibility.', service:'Service', date:'Date', time:'Time', confirm:'Confirm appointment', success:'Appointment confirmed successfully', select:'Select an option', steps:'Flow progress', badMessage:'Something went wrong. Code 405.', goodMessage:'Check the date: select an available date.' },
  concepts:{ title:'Integrated HCI and UX map', intro:'Each concept includes an example, an anti-pattern, a metric and an evaluation method.' },
  accessibility:{ title:'Accessibility center', theme:'Theme', light:'Light', dark:'Dark', contrast:'High contrast', font:'Text size', spacing:'Reading spacing', dyslexia:'Accessible reading mode', motion:'Reduce motion', screen:'Screen reader demonstration', announce:'Announce update', lsc:'LSC multimedia example', transcript:'Transcript: this demonstration explains how to confirm an appointment. The final video must be validated by an LSC expert.', upload:'Load LSC sample video' },
  devices:{ title:'Multi-device laboratory', intro:'Information is prioritized differently on each device.', desktop:'Desktop', tablet:'Tablet', mobile:'Mobile', watch:'Watch' },
  evaluation:{ title:'Human + AI heuristic evaluation', intro:'Record findings and compare them with an AI-assisted evaluation.', heuristic:'Heuristic', severity:'Severity', evidence:'Evidence', problem:'Problem', recommendation:'Recommendation', add:'Add finding', runAI:'Run AI evaluation', noFindings:'No findings yet.', aiResult:'AI found potential issues that require human validation.' },
  metrics:{ title:'Metrics dashboard', completed:'Tasks completed', time:'Average time', errors:'Errors', accessibility:'Accessibility score', awareness:'State awareness', engagement:'Completion', emotion:'Confidence', performance:'Performance' },
  ai:{ title:'AI Studio', intro:'Generate scenarios and evaluations through a simulated, reviewable provider.', type:'Generation type', persona:'Proto-persona', scenario:'Adverse scenario', interface:'Interface alternative', prompt:'Instruction', generate:'Generate', result:'Generated result', disclaimer:'AI output must be reviewed before use.' },
  tests:{ title:'Quality and automation', intro:'Planned coverage for functional quality, accessibility, performance and multi-device behavior.' },
  course:{ title:'Course evolution', intro:'The repository preserves evidence and versions for every course stage.' }
};

const pt = {
  nav:{ dashboard:'Início', lab:'Laboratório', concepts:'Conceitos', research:'Pessoas', practices:'Práticas', devices:'Dispositivos', accessibility:'Acessibilidade', evaluation:'Avaliação', userTesting:'Testes UX', metrics:'Métricas', ai:'IA', quality:'Qualidade', tests:'Testes', course:'Curso' },
  common:{ title:'HCI Lab + IA', subtitle:'Laboratório evolutivo de interação humano-computador', good:'Boa prática', bad:'Má prática', compare:'Comparar', save:'Salvar', continue:'Continuar', back:'Voltar', reset:'Redefinir', export:'Exportar', language:'Idioma', status:'Estado', close:'Fechar' },
  lab:{ title:'Fluxo de agendamento', intro:'Conclua a tarefa e observe as mudanças na experiência, métricas e acessibilidade.', service:'Serviço', date:'Data', time:'Hora', confirm:'Confirmar consulta', success:'Consulta confirmada com sucesso', select:'Selecione uma opção', steps:'Progresso do fluxo', badMessage:'Algo deu errado. Código 405.', goodMessage:'Revise a data: selecione uma data disponível.' },
  concepts:{ title:'Mapa integrado de HCI e UX', intro:'Cada conceito possui exemplo, má prática, métrica e método de avaliação.' },
  accessibility:{ title:'Centro de acessibilidade', theme:'Tema', light:'Claro', dark:'Escuro', contrast:'Alto contraste', font:'Tamanho do texto', spacing:'Espaçamento de leitura', dyslexia:'Modo de leitura acessível', motion:'Reduzir movimento', screen:'Demonstração para leitor de tela', announce:'Anunciar atualização', lsc:'Exemplo multimídia em LSC', transcript:'Transcrição: esta demonstração explica como confirmar uma consulta. O vídeo final deve ser validado por especialista em LSC.', upload:'Carregar vídeo de exemplo LSC' },
  devices:{ title:'Laboratório multiformato', intro:'A informação é priorizada de modo diferente em cada dispositivo.', desktop:'Computador', tablet:'Tablet', mobile:'Celular', watch:'Relógio' },
  evaluation:{ title:'Avaliação heurística humana + IA', intro:'Registre achados e compare com uma avaliação assistida por IA.', heuristic:'Heurística', severity:'Severidade', evidence:'Evidência', problem:'Problema', recommendation:'Recomendação', add:'Adicionar achado', runAI:'Executar avaliação IA', noFindings:'Ainda não há achados.', aiResult:'A IA encontrou possíveis problemas que exigem validação humana.' },
  metrics:{ title:'Painel de métricas', completed:'Tarefas concluídas', time:'Tempo médio', errors:'Erros', accessibility:'Pontuação de acessibilidade', awareness:'Compreensão do estado', engagement:'Conclusão', emotion:'Confiança', performance:'Desempenho' },
  ai:{ title:'AI Studio', intro:'Gere cenários e avaliações com um provedor simulado e revisável.', type:'Tipo de geração', persona:'Protopersona', scenario:'Cenário adverso', interface:'Alternativa de interface', prompt:'Instrução', generate:'Gerar', result:'Resultado gerado', disclaimer:'A saída da IA deve ser revisada antes do uso.' },
  tests:{ title:'Qualidade e automação', intro:'Cobertura planejada para qualidade funcional, acessibilidade, desempenho e multiformato.' },
  course:{ title:'Evolução por aulas', intro:'O repositório preserva evidências e versões de cada etapa do curso.' }
};

const fr = {
  nav:{ dashboard:'Accueil', lab:'Laboratoire', concepts:'Concepts', research:'Personnes', practices:'Pratiques', devices:'Appareils', accessibility:'Accessibilité', evaluation:'Évaluation', userTesting:'Tests UX', metrics:'Métriques', ai:'IA', quality:'Qualité', tests:'Tests', course:'Cours' },
  common:{ title:'HCI Lab + IA', subtitle:'Laboratoire évolutif d’interaction humain-machine', good:'Bonne pratique', bad:'Mauvaise pratique', compare:'Comparer', save:'Enregistrer', continue:'Continuer', back:'Retour', reset:'Réinitialiser', export:'Exporter', language:'Langue', status:'État', close:'Fermer' },
  lab:{ title:'Parcours de prise de rendez-vous', intro:'Réalisez la tâche et observez les changements d’expérience, de métriques et d’accessibilité.', service:'Service', date:'Date', time:'Heure', confirm:'Confirmer le rendez-vous', success:'Rendez-vous confirmé', select:'Sélectionnez une option', steps:'Progression', badMessage:'Une erreur est survenue. Code 405.', goodMessage:'Vérifiez la date : sélectionnez une date disponible.' },
  concepts:{ title:'Carte intégrée IHM et UX', intro:'Chaque concept comporte un exemple, une mauvaise pratique, une métrique et une méthode d’évaluation.' },
  accessibility:{ title:'Centre d’accessibilité', theme:'Thème', light:'Clair', dark:'Sombre', contrast:'Contraste élevé', font:'Taille du texte', spacing:'Espacement de lecture', dyslexia:'Mode de lecture accessible', motion:'Réduire les animations', screen:'Démonstration lecteur d’écran', announce:'Annoncer la mise à jour', lsc:'Exemple multimédia en LSC', transcript:'Transcription : cette démonstration explique comment confirmer un rendez-vous. La vidéo finale doit être validée par une personne compétente en LSC.', upload:'Charger une vidéo LSC' },
  devices:{ title:'Laboratoire multiformat', intro:'Les informations sont priorisées différemment selon l’appareil.', desktop:'Ordinateur', tablet:'Tablette', mobile:'Téléphone', watch:'Montre' },
  evaluation:{ title:'Évaluation heuristique humaine + IA', intro:'Consignez les constats et comparez-les à une évaluation assistée par IA.', heuristic:'Heuristique', severity:'Sévérité', evidence:'Preuve', problem:'Problème', recommendation:'Recommandation', add:'Ajouter un constat', runAI:'Lancer l’évaluation IA', noFindings:'Aucun constat pour le moment.', aiResult:'L’IA a détecté des problèmes potentiels nécessitant une validation humaine.' },
  metrics:{ title:'Tableau des métriques', completed:'Tâches terminées', time:'Temps moyen', errors:'Erreurs', accessibility:'Score d’accessibilité', awareness:'Compréhension de l’état', engagement:'Achèvement', emotion:'Confiance', performance:'Performance' },
  ai:{ title:'AI Studio', intro:'Générez des scénarios et évaluations grâce à un fournisseur simulé et vérifiable.', type:'Type de génération', persona:'Proto-persona', scenario:'Scénario défavorable', interface:'Alternative d’interface', prompt:'Instruction', generate:'Générer', result:'Résultat généré', disclaimer:'La sortie IA doit être vérifiée avant utilisation.' },
  tests:{ title:'Qualité et automatisation', intro:'Couverture prévue pour la qualité fonctionnelle, l’accessibilité, la performance et le multiformat.' },
  course:{ title:'Évolution du cours', intro:'Le dépôt conserve les preuves et versions de chaque étape du cours.' }
};

i18n.use(initReactI18next).init({
  resources: { 'es-CO': { translation: { ...es, multimodal: multimodalResources['es-CO'] } }, 'en-US': { translation: { ...en, multimodal: multimodalResources['en-US'] } }, 'pt-BR': { translation: { ...pt, multimodal: multimodalResources['pt-BR'] } }, 'fr-FR': { translation: { ...fr, multimodal: multimodalResources['fr-FR'] } } },
  lng: localStorage.getItem('hci-language') || 'es-CO',
  fallbackLng: 'es-CO',
  interpolation: { escapeValue: false },
});

export default i18n;
