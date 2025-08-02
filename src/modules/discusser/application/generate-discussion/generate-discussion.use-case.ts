import { CompletionRepository } from 'src/modules/shared/domain/completion.repository';

import { GenerateDiscussionDto } from './generate-discussion.dto';

export class GenerateDiscussion {
  constructor(private readonly completionRepository: CompletionRepository) {}
  async execute(payload: GenerateDiscussionDto) {
    const completion = await this.completionRepository.complete([
      {
        role: 'system',
        content: `Recibirás una pregunta del usuario. Tu tarea es analizarla y generar una respuesta equilibrada en formato markdown, presentando tanto los pros como los contras de manera clara y objetiva.

        - Utiliza títulos y subtítulos para organizar la información.
        - Enumera los pros y los contras en listas separadas.
        - Sé imparcial y proporciona argumentos sólidos para cada punto.
        - Finaliza con una breve conclusión que resuma el análisis.
      `,
      },
      {
        role: 'user',
        content: payload.prompt,
      },
    ]);

    return completion;
  }
}
