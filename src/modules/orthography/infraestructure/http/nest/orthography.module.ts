import { Module } from '@nestjs/common';
import { CheckOrthography } from 'src/modules/orthography/application/check-orthography.use-case';
import { CompletionRepository } from 'src/modules/orthography/domain/completion.repository';

import { OpenAiCompletionRepository } from '../../openai/openai-completion.repository';
import { OrthographyController } from './orthography.controller';
import { TOKENS } from './tokens';

@Module({
  controllers: [OrthographyController],
  providers: [
    {
      provide: TOKENS.COMPLETION_REPOSITORY,
      useClass: OpenAiCompletionRepository,
    },
    {
      provide: TOKENS.CHECK_ORTHOGRAPHY,
      useFactory: (completionRepository: CompletionRepository) => {
        return new CheckOrthography(completionRepository);
      },
      inject: [TOKENS.COMPLETION_REPOSITORY],
    },
  ],
})
export class OrthographyModule {}
