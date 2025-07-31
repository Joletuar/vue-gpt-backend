export type AIRole = 'system' | 'user' | 'assistant';

export interface AIMessage {
  role: AIRole;
  content: string;
}

export interface CompletionRepository {
  complete(messages: AIMessage[]): Promise<AIMessage>;
}
