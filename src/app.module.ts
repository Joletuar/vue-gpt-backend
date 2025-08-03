import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AudioToTextModule } from './modules/audio-to-text/infraestructure/http/nest/audio-to-text.module';
import { DiscusserModule } from './modules/discusser/infraestructure/http/nest/discusser.module';
import { OrthographyModule } from './modules/orthography/infraestructure/http/nest/orthography.module';
import { AddRequestIdMiddleware } from './modules/shared/infraestructure/http/nest/middlewares/add-request-id.middleware';
import { AppLoggerMiddleware } from './modules/shared/infraestructure/http/nest/middlewares/app-logger.middleware';
import { SharedModule } from './modules/shared/infraestructure/http/nest/shared.module';
import { TextToAudioModule } from './modules/text-to-audio/infraestructure/http/nest/text-to-audio.module';
import { TranslationModule } from './modules/translation/infraestructure/http/nest/translation.module';

@Module({
  imports: [
    SharedModule,
    OrthographyModule,
    DiscusserModule,
    TranslationModule,
    TextToAudioModule,
    AudioToTextModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AddRequestIdMiddleware).forRoutes('/');
    consumer.apply(AppLoggerMiddleware).forRoutes('/');
  }
}
