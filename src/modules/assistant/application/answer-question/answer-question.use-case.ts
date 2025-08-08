import { AssistantRepository } from '../../domain/assistant.repository';
import { AnswerQuestionDto } from './answer-question.dto';

export class AnswerQuestion {
  constructor(private readonly assistantRespository: AssistantRepository) {}

  async execute(dto: AnswerQuestionDto) {
    return await this.assistantRespository.ask(dto.question, dto.threadId);
  }
}
