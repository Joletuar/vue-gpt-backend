import { Module } from '@nestjs/common';

import { GenerateImage } from 'src/modules/image/application/generate-image.use-case';
import { CompletionRepository } from 'src/modules/shared/domain/completion.repository';
import { SHARED_TOKENS } from 'src/modules/shared/infraestructure/http/nest/shared-tokens';
import { SharedModule } from 'src/modules/shared/infraestructure/http/nest/shared.module';

import { IMAGE_TOKENS } from './image-tokens';
import { ImageController } from './image.controller';

@Module({
  imports: [SharedModule],
  controllers: [ImageController],
  providers: [
    {
      provide: IMAGE_TOKENS.GENERATE_IMAGE,
      useFactory: (completionRepository: CompletionRepository) => {
        return new GenerateImage(completionRepository);
      },
      inject: [SHARED_TOKENS.COMPLETION_REPOSITORY],
    },
  ],
})
export class ImageModule {}
