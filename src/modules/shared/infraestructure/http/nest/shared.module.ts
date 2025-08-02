import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { OpenAiCompletionRepository } from '../../openai/openai-completion.repository';
import { HealthCheckController } from './health-check.controller';
import { SHARED_TOKENS } from './shared-tokens';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [HealthCheckController],
  providers: [
    {
      provide: SHARED_TOKENS.COMPLETION_REPOSITORY,
      useClass: OpenAiCompletionRepository,
    },
  ],
  exports: [SHARED_TOKENS.COMPLETION_REPOSITORY],
})
export class SharedModule {}
