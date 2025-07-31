import { InfraestructureError } from 'src/modules/shared/domain/errors/infraestructure.error';

export class OpenAiCompletionServiceUnavailableError extends InfraestructureError {
  constructor(originalError: unknown) {
    super({
      message: `El servicio de OpenAi no está disponible`,
      originalError,
      isCritical: true,
    });

    this.name = 'OpenAiCompletionServiceUnavailableError';
  }
}
