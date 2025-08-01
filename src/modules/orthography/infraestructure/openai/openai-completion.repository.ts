import OpenAI from 'openai';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';

import {
  AIMessage,
  CompletionRepository,
} from '../../domain/completion.repository';
import { OpenAiCompletionServiceUnavailableError } from './openai-service-unavailable.error';

export class OpenAiCompletionRepository implements CompletionRepository {
  private readonly client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
  });

  async complete(
    messages: AIMessage[],
    meta: Record<string, any> = {},
  ): Promise<AIMessage> {
    const { model = 'gpt-4.1-nano', temperature = 0 } = meta as {
      model?: ChatCompletionCreateParamsBase['model'];
      temperature?: number;
    };

    try {
      const completion = await this.client.chat.completions.create({
        messages,
        model,
        temperature,
      });

      const choice = completion.choices[0];

      return {
        role: choice.message.role,
        content: choice.message.content || '',
      };
    } catch (error) {
      throw new OpenAiCompletionServiceUnavailableError(error);
    }
  }
}
