import type { AiRequest, AiResponse } from '../domain/types';
export interface AiProvider {
  generate(request: AiRequest): Promise<AiResponse>;
}
