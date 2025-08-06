import { Body, Controller, Inject, Post } from '@nestjs/common';

import { GenerateImage } from 'src/modules/image/application/generate-image/generate-image.use-case';

import { GenerateImageDto } from './dtos/generate-image.dto';
import { IMAGE_TOKENS } from './image-tokens';

@Controller({
  path: 'image',
})
export class ImageController {
  constructor(
    @Inject(IMAGE_TOKENS.GENERATE_IMAGE)
    private readonly _generateImage: GenerateImage,
  ) {}

  @Post('/generate')
  async generateImage(@Body() payload: GenerateImageDto) {
    return await this._generateImage.execute(payload);
  }
}
