import * as fs from 'node:fs';
import * as path from 'node:path';
import { Readable } from 'node:stream';

import type { CompletionRepository } from 'src/modules/shared/domain/completion.repository';

import type { ConvertTextToAudioDto } from './convert-text-to-audio.dto';

export class ConvertTextToAudio {
  private readonly VOICES = { nova: 'nova', alloy: 'alloy' } as const;

  constructor(private readonly completionRepository: CompletionRepository) {}

  async execute(payload: ConvertTextToAudioDto) {
    const { prompt, voice } = payload;

    const selectedVoice = voice
      ? this.VOICES[voice as keyof typeof this.VOICES]
      : this.VOICES['alloy'];

    const bufferAudio = await this.completionRepository.textToAudio(prompt, {
      voice: selectedVoice,
    });

    await this.saveInFileSystem(bufferAudio);

    return Readable.from(bufferAudio);
  }

  private async saveInFileSystem(buffer: Buffer): Promise<void> {
    const BASE_PATH = path.resolve(__dirname, '../../../../generated');
    const AUDIOS_PATH = path.resolve(BASE_PATH, 'audios');

    await fs.promises.mkdir(AUDIOS_PATH, { recursive: true });

    const FILE_PATH = path.resolve(
      BASE_PATH,
      `audios/${new Date().getTime()}.mp3`,
    );

    const readable = Readable.from(buffer);
    const writable = fs.createWriteStream(FILE_PATH);

    await new Promise<void>((resolve, reject) => {
      readable.pipe(writable);
      writable.on('finish', resolve);
      writable.on('error', reject);
    });
  }
}
