import {
  AIMessage,
  CompletionRepository,
} from 'src/modules/shared/domain/completion.repository';

import { TranslateTextDto } from './translate-text.dto';

export class TranslateText {
  constructor(private readonly completionRepository: CompletionRepository) {}

  async execute(payload: TranslateTextDto) {
    const completion = (await this.completionRepository.complete([
      {
        role: 'system',
        content: `Eres un traductor de idiomas experto. Tu tarea es traducir el texto proporcionado al idioma especificado. La respuesta debe estar en formato markdown.

        El texto a traducir es: "${payload.prompt}". El idioma de destino es: "${payload.lang}".`,
      },
    ])) as AIMessage;

    return {
      text: completion.content,
    };
  }
}
