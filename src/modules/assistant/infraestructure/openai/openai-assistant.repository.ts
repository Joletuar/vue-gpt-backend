import { Readable } from 'node:stream';

import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import { AssistantRepository } from '../../domain/assistant.repository';
import { OpenAiAssistantServiceUnavailableError } from './openai-assistant-service-unavailable.error';

@Injectable()
export class OpenAiAssistantRepository implements AssistantRepository {
  private readonly client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
  });
  private readonly ASSISTANT_ID = process.env['ASSISTANT_ID']!;

  async ask(
    question: string,
    threadId: string,
  ): Promise<NodeJS.ReadableStream> {
    await this.createMessage(threadId, question);

    try {
      const openaiStream = this.client.beta.threads.runs.stream(threadId, {
        assistant_id: this.ASSISTANT_ID,
      });

      const adaptedStream = new Readable({
        read() {},
      });

      openaiStream.on('textDelta', (delta) => {
        if (delta.value) {
          adaptedStream.push(delta.value);
        }
      });

      openaiStream.on('end', () => {
        adaptedStream.push(null);
      });

      openaiStream.on('error', (error) => {
        adaptedStream.destroy(error);
      });

      return adaptedStream;
    } catch (error) {
      throw new OpenAiAssistantServiceUnavailableError(error);
    }
  }

  async createThread() {
    try {
      const thread = await this.client.beta.threads.create();

      return thread.id;
    } catch (error) {
      throw new OpenAiAssistantServiceUnavailableError(error);
    }
  }

  private async createMessage(threadId: string, content: string) {
    try {
      return await this.client.beta.threads.messages.create(threadId, {
        role: 'user',
        content,
      });
    } catch (error) {
      throw new OpenAiAssistantServiceUnavailableError(error);
    }
  }
}
