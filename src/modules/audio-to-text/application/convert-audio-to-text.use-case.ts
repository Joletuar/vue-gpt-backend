import { Readable } from 'node:stream';

import { CompletionRepository } from 'src/modules/shared/domain/completion.repository';

import { ConvertAudioToTextDto } from './convert-audio-to-text.dto';

export class ConvertAudioToText {
  constructor(private readonly completionRepository: CompletionRepository) {}

  async execute(payload: ConvertAudioToTextDto) {
    const { transcription } = await this.completionRepository.audioToText({
      buffer: payload.audioBuffer,
      mimetype: payload.type,
      originalname: payload.name,
    });

    const stream = Readable.from(transcription);

    return stream;
  }
}
