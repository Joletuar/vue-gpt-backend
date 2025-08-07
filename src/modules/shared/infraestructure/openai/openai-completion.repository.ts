import { Readable } from 'node:stream';

import OpenAI, { toFile } from 'openai';
import { SpeechCreateParams } from 'openai/resources/audio/speech';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';
import { ImageGenerateParamsBase } from 'openai/resources/images';

import {
  AIMessage,
  AITranscription,
  AudioFile,
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

  async textToAudio(
    speech: string,
    meta: Record<string, unknown> = {},
  ): Promise<Buffer> {
    const {
      model = 'gpt-4o-mini-tts',
      voice = 'alloy',
      responseFormat = 'mp3',
    } = meta as {
      model?: SpeechCreateParams['model'];
      voice?: SpeechCreateParams['voice'];
      responseFormat?: SpeechCreateParams['response_format'];
    };

    try {
      const res = await this.client.audio.speech.create({
        model,
        input: speech,
        response_format: responseFormat,
        stream_format: 'audio',
        voice,
      });

      return Buffer.from(await res.arrayBuffer());
    } catch (error) {
      throw new OpenAiCompletionServiceUnavailableError(error);
    }
  }

  async audioToText(audio: AudioFile): Promise<AITranscription> {
    try {
      const transcription = await this.client.audio.transcriptions.create({
        model: 'whisper-1',
        temperature: 0,
        file: await toFile(audio.buffer, audio.originalname, {
          type: audio.mimetype,
        }),
        response_format: 'vtt',
      });

      return {
        transcription,
      };
    } catch (error) {
      throw new OpenAiCompletionServiceUnavailableError(error);
    }
  }

  async generateImage(
    prompt: string,
    meta: Record<string, unknown> = {},
  ): Promise<string> {
    const { style = 'natural' } = meta as {
      outputFormat: ImageGenerateParamsBase['output_format'];
      style: ImageGenerateParamsBase['style'];
    };

    try {
      const res = await this.client.images.generate({
        model: 'dall-e-3',
        response_format: 'b64_json',
        quality: 'hd',
        n: 1,
        size: '1024x1024',
        style,
        prompt,
      });

      const image = res.data ? res.data[0] : null;

      if (!image) return '';

      return image.b64_json!;
    } catch (error) {
      throw new OpenAiCompletionServiceUnavailableError(error);
    }
  }

  async editImage(
    prompt: string,
    image: File | string,
    mask: File | string,
  ): Promise<string> {
    try {
      let file: File;

      if (typeof image === 'string') {
        const buffer = Buffer.from(image, 'base64');
        file = await toFile(buffer, 'image.png', { type: 'image/png' });
      } else {
        file = await toFile(image);
      }

      let maskFile: File;
      if (typeof mask === 'string') {
        const buffer = Buffer.from(mask, 'base64');
        maskFile = await toFile(buffer, 'image.png', { type: 'image/png' });
      } else {
        maskFile = await toFile(mask);
      }

      const res = await this.client.images.edit({
        model: 'dall-e-2',
        prompt,
        size: '1024x1024',
        response_format: 'b64_json',
        n: 1,
        image: file,
        mask: maskFile,
      });

      const editedImage = res.data ? res.data[0] : null;

      if (!editedImage) return '';

      return editedImage.b64_json!;
    } catch (error) {
      throw new OpenAiCompletionServiceUnavailableError(error);
    }
  }
}
