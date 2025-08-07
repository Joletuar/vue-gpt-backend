import { Readable } from 'node:stream';

export type AIRole = 'system' | 'user' | 'assistant';

export interface AIMessage {
  role: AIRole;
  content: string;
}

export interface AITranscription {
  transcription: string;
}

export interface AudioFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

export interface CompletionRepository {
  complete(
    messages: AIMessage[],
    meta?: Record<string, unknown>,
  ): Promise<AIMessage | Readable>;

  textToAudio(speech: string, meta?: Record<string, unknown>): Promise<Buffer>;

  audioToText(
    audio: AudioFile,
    meta?: Record<string, unknown>,
  ): Promise<AITranscription>;

  generateImage(
    prompt: string,
    meta?: Record<string, unknown>,
  ): Promise<string>;

  editImage(
    prompt: string,
    image: File | string,
    mask: File | string,
    meta?: Record<string, unknown>,
  ): Promise<string>;
}
