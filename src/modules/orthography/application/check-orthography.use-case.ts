import type {
  AIMessage,
  CompletionRepository,
} from '../../shared/domain/completion.repository';
import type { CheckOrthographyDto } from './check-orthography.dto';

export class CheckOrthography {
  constructor(private readonly completionRepository: CompletionRepository) {}

  async execute(checkOrthographyDto: CheckOrthographyDto) {
    const completion = (await this.completionRepository.complete([
      {
        role: 'system',
        content: `Eres un corrector ortográfico y gramatical. Valida el siguiente texto y proporciona un análisis en formato JSON. El análisis debe incluir:
      - Una lista de errores ortográficos y gramaticales encontrados.
      - El texto corregido.
      - Información detallada de las soluciones aplicadas.
      - Un porcentaje de acierto del usuario basado en el número de errores encontrados.
        
        El formato de salida debe ser el siguiente:
        {
          errors -> un array de los errores con este formato: {type: string, description: string},
          corrected_text -> texto corregido: string,
          solutions -> un array de los soluciones con este formato: {error: string, correction: string},
          accuracy_percentage -> porcentaje de acierto -> number
        }
      `,
      },
      {
        role: 'user',
        content: checkOrthographyDto.prompt,
      },
    ])) as AIMessage;

    const parsedData = this.parseMessage(completion.content);

    return parsedData;
  }

  private parseMessage(message: string) {
    try {
      return JSON.parse(message) as unknown;
    } catch {
      return '';
    }
  }
}
