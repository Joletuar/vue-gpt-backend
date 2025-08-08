import { InfraestructureError } from 'src/modules/shared/domain/errors/infraestructure.error';

export class OpenAiAssistantServiceUnavailableError extends InfraestructureError {
  constructor(originalError: unknown) {
    super({
      message: `El servicio de Agentes de OpenAi no está disponible`,
      originalError,
      isCritical: true,
    });

    this.name = 'OpenAiAssistantServiceUnavailableError';
  }
}
