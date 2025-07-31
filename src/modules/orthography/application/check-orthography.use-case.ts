import type { CompletionRepository } from '../domain/completion.repository';
import type { CheckOrthographyDto } from './check-orthography.dto';

export class CheckOrthography {
  constructor(private readonly completionRepository: CompletionRepository) {}

  async execute(checkOrthographyDto: CheckOrthographyDto) {
    const completion = await this.completionRepository.complete([
      {
        content: checkOrthographyDto.prompt,
        role: 'system',
      },
    ]);

    return completion;
  }
}
