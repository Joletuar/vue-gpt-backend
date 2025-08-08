import { pipeline } from 'node:stream';

import { Body, Controller, Inject, Logger, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { AnswerQuestion } from 'src/modules/assistant/application/answer-question/answer-question.use-case';
import { CreateThread } from 'src/modules/assistant/application/create-thread/create-thread.use-case';

import { ASSISTANT_TOKEN } from './assistant-tokens';
import { QuestionDto } from './dtos/question.dto';

@Controller({
  path: 'assistant',
})
export class AssistantController {
  private readonly logger = new Logger('AssistantController');

  constructor(
    @Inject(ASSISTANT_TOKEN.CREATE_THREAD)
    private readonly _createThread: CreateThread,

    @Inject(ASSISTANT_TOKEN.ANSWER_QUESTION)
    private readonly answerQuestion: AnswerQuestion,
  ) {}

  @Post('create-thread')
  async createThread() {
    return await this._createThread.execute();
  }

  @Post('user-question')
  async userQuestion(@Body() payload: QuestionDto, @Res() res: Response) {
    const chunks = await this.answerQuestion.execute({
      question: payload.question,
      threadId: payload.threadId,
    });

    pipeline(chunks, res, (err) => {
      if (err) return this.logger.error('Error en el envio de stream', err);

      this.logger.debug('Stream enviado exitosamente');
    });
  }
}
