export class InfraestructureError extends Error {
  isCritical: boolean;
  originalError?: unknown;

  constructor(props: {
    message: string;
    originalError?: unknown;
    isCritical?: boolean;
  }) {
    const { message, originalError = null, isCritical = false } = props;

    super(message);

    this.isCritical = isCritical;
    this.originalError = originalError;

    this.name = 'InfraestructureError';
  }
}
