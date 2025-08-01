import { Readable } from 'node:stream';

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
    meta: Record<string, unknown> = {},
  ): Promise<AIMessage | Readable> {
    const {
      model = 'gpt-4o-mini',
      temperature = 0,
      stream = false,
    } = meta as {
      model?: ChatCompletionCreateParamsBase['model'];
      temperature?: number;
      stream?: boolean;
    };

    try {
      if (stream) {
        return this.generateStream(messages, { model, temperature });
      }

      return this.generateSync(messages, { model, temperature });
    } catch (error) {
      throw new OpenAiCompletionServiceUnavailableError(error);
    }
  }

  private async generateSync(
    messages: AIMessage[],
    props: {
      model: ChatCompletionCreateParamsBase['model'];
      temperature: number;
    },
  ): Promise<AIMessage> {
    const { model, temperature } = props;

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
  }

  private async generateStream(
    messages: AIMessage[],
    props: {
      model: ChatCompletionCreateParamsBase['model'];
      temperature: number;
    },
  ): Promise<Readable> {
    const { model, temperature } = props;

    const streamResponse = await this.client.chat.completions.create({
      messages,
      model,
      temperature,
      stream: true,
    });

    const readableStream = new Readable({
      read() {},
    });

    void (async () => {
      try {
        for await (const chunk of streamResponse) {
          const content = chunk.choices[0]?.delta?.content || '';

          if (content) readableStream.push(content);
        }

        readableStream.push(null);
      } catch (error) {
        readableStream.destroy(error as Error);
      }
    })();

    return readableStream;
  }
}
