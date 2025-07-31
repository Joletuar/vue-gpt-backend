import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { OrthographyModule } from './modules/orthography/infraestructure/http/nest/orthography.module';
import { AddRequestIdMiddleware } from './modules/shared/infraestructure/http/nest/middlewares/add-request-id.middleware';
import { AppLoggerMiddleware } from './modules/shared/infraestructure/http/nest/middlewares/app-logger.middleware';
import { SharedModule } from './modules/shared/infraestructure/http/nest/shared.module';

@Module({
  imports: [SharedModule, OrthographyModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AddRequestIdMiddleware).forRoutes('/');
    consumer.apply(AppLoggerMiddleware).forRoutes('/');
  }
}
