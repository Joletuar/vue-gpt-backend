import { Module } from '@nestjs/common';

import { CheckOrthography } from 'src/modules/orthography/application/check-orthography.use-case';
import { CompletionRepository } from 'src/modules/shared/domain/completion.repository';
import { SHARED_TOKENS } from 'src/modules/shared/infraestructure/http/nest/shared-tokens';
import { SharedModule } from 'src/modules/shared/infraestructure/http/nest/shared.module';

import { ORTHOGRAPHY_TOKENS } from './orthography-tokens';
import { OrthographyController } from './orthography.controller';

@Module({
  imports: [SharedModule],
  controllers: [OrthographyController],
  providers: [
    {
      provide: ORTHOGRAPHY_TOKENS.CHECK_ORTHOGRAPHY,
      useFactory: (completionRepository: CompletionRepository) => {
        return new CheckOrthography(completionRepository);
      },
      inject: [SHARED_TOKENS.COMPLETION_REPOSITORY],
    },
  ],
})
export class OrthographyModule {}
