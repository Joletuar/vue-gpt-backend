import { Module } from '@nestjs/common';

import { GenerateDiscussionStream } from 'src/modules/discusser/application/generate-discussion-stream/generate-discussion-stream.use-case';
import { GenerateDiscussion } from 'src/modules/discusser/application/generate-discussion/generate-discussion.use-case';
import { CompletionRepository } from 'src/modules/shared/domain/completion.repository';
import { SHARED_TOKENS } from 'src/modules/shared/infraestructure/http/nest/shared-tokens';
import { SharedModule } from 'src/modules/shared/infraestructure/http/nest/shared.module';

import { DISCUSSER_TOKENS } from './discusser-tokens';
import { DiscusserController } from './discusser.controller';

@Module({
  imports: [SharedModule],
  controllers: [DiscusserController],
  providers: [
    {
      provide: DISCUSSER_TOKENS.GENERATE_DISCUSSION,
      useFactory: (completionRepository: CompletionRepository) => {
        return new GenerateDiscussion(completionRepository);
      },
      inject: [SHARED_TOKENS.COMPLETION_REPOSITORY],
    },
    {
      provide: DISCUSSER_TOKENS.GENERATE_DISCUSSION_STREAM,
      useFactory: (completionRepository: CompletionRepository) => {
        return new GenerateDiscussionStream(completionRepository);
      },
      inject: [SHARED_TOKENS.COMPLETION_REPOSITORY],
    },
  ],
})
export class DiscusserModule {}
