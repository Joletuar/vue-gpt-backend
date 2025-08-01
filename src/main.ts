import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './modules/shared/infraestructure/http/nest/filters/global-exception.filter';
import { InfraestructurerExceptionFilter } from './modules/shared/infraestructure/http/nest/filters/infraestructure-exception.filter';
import { ValidationExceptionFilter } from './modules/shared/infraestructure/http/nest/filters/validation-handler-error.filter';
import { FormatApiResponse } from './modules/shared/infraestructure/http/nest/interceptors/format-api-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('/api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.useGlobalFilters(
    new GlobalExceptionFilter(),
    new InfraestructurerExceptionFilter(),
    new ValidationExceptionFilter(),
  );

  app.useGlobalInterceptors(new FormatApiResponse());

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
