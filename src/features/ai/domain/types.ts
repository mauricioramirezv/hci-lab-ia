export type AiTask = 'persona' | 'scenario' | 'interface' | 'evaluation';
export type AiRequest = { task: AiTask; prompt: string; locale: string };
export type AiResponse = { text: string; provider: string; generatedAt: string; warnings: string[] };

export type AiDraft={name:string;goal:string;barrier:string;device:string;context:string;personaId:string;scenarioTitle:string;scenarioTask:string;constraint:string;success:string;problem:string;evidence:string;recommendation:string;heuristicId:string;severity:string};
