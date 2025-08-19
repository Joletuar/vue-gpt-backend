import { Module } from '@nestjs/common';

import { AnswerQuestion } from 'src/modules/assistant/application/answer-question/answer-question.use-case';
import { CreateThread } from 'src/modules/assistant/application/create-thread/create-thread.use-case';
import { AssistantRepository } from 'src/modules/assistant/domain/assistant.repository';

import { OpenAiAssistantRepository } from '../../openai/openai-assistant.repository';
import { ASSISTANT_TOKEN } from './assistant-tokens';
import { AssistantController } from './assistant.controller';

@Module({
  controllers: [AssistantController],
  providers: [
    OpenAiAssistantRepository,
    {
      provide: ASSISTANT_TOKEN.CREATE_THREAD,
      useFactory: (assistantRepository: AssistantRepository) => {
        return new CreateThread(assistantRepository);
      },
      inject: [OpenAiAssistantRepository],
    },
    {
      provide: ASSISTANT_TOKEN.ANSWER_QUESTION,
      useFactory: (assistantRepository: AssistantRepository) => {
        return new AnswerQuestion(assistantRepository);
      },
      inject: [OpenAiAssistantRepository],
    },
  ],
})
export class AssistantModule {}
