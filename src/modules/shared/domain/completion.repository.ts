import { Readable } from 'node:stream';

export type AIRole = 'system' | 'user' | 'assistant';

export interface AIMessage {
  role: AIRole;
  content: string;
}

export interface CompletionRepository {
  complete(
    messages: AIMessage[],
    meta?: Record<string, unknown>,
  ): Promise<AIMessage | Readable>;
}
