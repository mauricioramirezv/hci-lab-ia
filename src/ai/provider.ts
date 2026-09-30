export type AiTask = 'persona' | 'scenario' | 'interface' | 'evaluation';
export type AiRequest = { task: AiTask; prompt: string; locale: string };
export type AiResponse = { text: string; provider: string; generatedAt: string; warnings: string[] };

export interface AiProvider {
  generate(request: AiRequest): Promise<AiResponse>;
}

export class LocalTeachingProvider implements AiProvider {
  async generate(request: AiRequest): Promise<AiResponse> {
    return {
      text: `Local proposal for ${request.task}: ${request.prompt}`,
      provider: 'local-teaching-provider',
      generatedAt: new Date().toISOString(),
      warnings: ['Hypothesis only', 'Human validation required'],
    };
  }
}

export class SecureProxyProvider implements AiProvider {
  constructor(private readonly endpoint: string) {}
  async generate(request: AiRequest): Promise<AiResponse> {
    const response = await fetch(this.endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error(`AI proxy returned ${response.status}`);
    return response.json() as Promise<AiResponse>;
  }
}

export function createAiProvider(): AiProvider {
  const endpoint = import.meta.env.VITE_AI_PROXY_URL as string | undefined;
  return endpoint ? new SecureProxyProvider(endpoint) : new LocalTeachingProvider();
}
