import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { GlobalHandlerErrorFilter } from './modules/shared/infraestructure/http/nest/filters/global-handler-error.filter';
import { InfraestructureHandlerErrorFilter } from './modules/shared/infraestructure/http/nest/filters/infraestructure-handler-error.filter';
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
    new GlobalHandlerErrorFilter(),
    new InfraestructureHandlerErrorFilter(),
  );

  app.useGlobalInterceptors(new FormatApiResponse());

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
