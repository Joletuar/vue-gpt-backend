export interface AssistantMessage {
  text: string;
  role: string;
  meta?: Record<string, unknown>;
}

export interface AssistantRepository {
  ask(
    question: string,
    threadId: string,
  ): Promise<AssistantMessage[] | NodeJS.ReadableStream>;

  createThread(): Promise<string>;
}
