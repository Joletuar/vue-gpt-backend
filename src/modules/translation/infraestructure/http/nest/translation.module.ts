import { Module } from '@nestjs/common';

import { CompletionRepository } from 'src/modules/shared/domain/completion.repository';
import { SHARED_TOKENS } from 'src/modules/shared/infraestructure/http/nest/shared-tokens';
import { SharedModule } from 'src/modules/shared/infraestructure/http/nest/shared.module';
import { TranslateText } from 'src/modules/translation/application/translate-text.use-case';

import { TRANSLATION_TOKENS } from './translation-tokens';
import { TranslationController } from './translation.controller';

@Module({
  imports: [SharedModule],
  controllers: [TranslationController],
  providers: [
    {
      provide: TRANSLATION_TOKENS.TRANSLATE_TEXT,
      useFactory: (completionRepository: CompletionRepository) => {
        return new TranslateText(completionRepository);
      },
      inject: [SHARED_TOKENS.COMPLETION_REPOSITORY],
    },
  ],
})
export class TranslationModule {}
