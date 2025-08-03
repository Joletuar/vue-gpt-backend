import { Module } from '@nestjs/common';

import { CompletionRepository } from 'src/modules/shared/domain/completion.repository';
import { SHARED_TOKENS } from 'src/modules/shared/infraestructure/http/nest/shared-tokens';
import { SharedModule } from 'src/modules/shared/infraestructure/http/nest/shared.module';

import { ConvertTextToAudio } from '../../../application/convert-text-to-audio.use-case';
import { TEXT_TO_AUDIO_TOKENS } from './text-to-audio-tokens';
import { TextToAudioController } from './text-to-audio.controller';

@Module({
  imports: [SharedModule],
  controllers: [TextToAudioController],
  providers: [
    {
      provide: TEXT_TO_AUDIO_TOKENS.CONVERT_TEXT_TO_AUDIO,
      useFactory: (completionRepository: CompletionRepository) => {
        return new ConvertTextToAudio(completionRepository);
      },
      inject: [SHARED_TOKENS.COMPLETION_REPOSITORY],
    },
  ],
})
export class TextToAudioModule {}
