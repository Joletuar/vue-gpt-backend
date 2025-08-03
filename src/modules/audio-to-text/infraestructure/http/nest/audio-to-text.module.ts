import { Module } from '@nestjs/common';

import { CompletionRepository } from 'src/modules/shared/domain/completion.repository';
import { SHARED_TOKENS } from 'src/modules/shared/infraestructure/http/nest/shared-tokens';
import { SharedModule } from 'src/modules/shared/infraestructure/http/nest/shared.module';

import { ConvertAudioToText } from '../../../application/convert-audio-to-text.use-case';
import { AUDIO_TO_TEXT_TOKENS } from './audio-to-text-tokens';
import { AudioToTextController } from './audio-to-text.controller';

@Module({
  imports: [SharedModule],
  controllers: [AudioToTextController],
  providers: [
    {
      provide: AUDIO_TO_TEXT_TOKENS.CONVERT_AUDIO_TO_TEXT,
      useFactory: (completionRepository: CompletionRepository) => {
        return new ConvertAudioToText(completionRepository);
      },
      inject: [SHARED_TOKENS.COMPLETION_REPOSITORY],
    },
  ],
})
export class AudioToTextModule {}
