import { pipeline } from 'node:stream';

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { GenerateImage } from 'src/modules/image/application/generate-image/generate-image.use-case';
import { GetImage } from 'src/modules/image/application/get-image/get-image.use-case';

import { GenerateImageDto } from './dtos/generate-image.dto';
import { IMAGE_TOKENS } from './image-tokens';

@Controller({
  path: 'image',
})
export class ImageController {
  private readonly logger = new Logger('ImageController');

  constructor(
    @Inject(IMAGE_TOKENS.GENERATE_IMAGE)
    private readonly _generateImage: GenerateImage,
    @Inject(IMAGE_TOKENS.GET_IMAGE)
    private readonly _getImage: GetImage,
  ) {}

  @Post('/generate')
  async generateImage(@Body() payload: GenerateImageDto) {
    return await this._generateImage.execute(payload);
  }

  @Get('/:imageId')
  getImage(@Param('imageId') imageId: string, @Res() res: Response) {
    const chunks = this._getImage.execute({ imageId });

    res.status(HttpStatus.OK).setHeader('Content-type', 'image/png');

    pipeline(chunks, res, (err) => {
      if (err) {
        return this.logger.error('Error en el envío del stream', err);
      }

      this.logger.debug('Stream enviado exitosamente');
    });
  }
}
