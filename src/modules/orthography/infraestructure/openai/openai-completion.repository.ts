import OpenAI from 'openai';

import {
  AIMessage,
  CompletionRepository,
} from '../../domain/completion.repository';
import { OpenAiCompletionServiceUnavailableError } from './openai-service-unavailable.error';

export class OpenAiCompletionRepository implements CompletionRepository {
  private readonly client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
  });

  async complete(messages: AIMessage[]): Promise<AIMessage> {
    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4.1-nano',
        messages,
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
