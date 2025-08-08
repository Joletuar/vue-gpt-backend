import { AssistantRepository } from '../../domain/assistant.repository';

export class CreateThread {
  constructor(private readonly assistantRespository: AssistantRepository) {}

  async execute() {
    return await this.assistantRespository.createThread();
  }
}
