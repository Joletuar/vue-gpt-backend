import { pipeline } from 'node:stream';

import {
  Controller,
  FileTypeValidator,
  HttpStatus,
  Inject,
  Logger,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { ConvertAudioToText } from '../../../application/convert-audio-to-text.use-case';
import { AUDIO_TO_TEXT_TOKENS } from './audio-to-text-tokens';

@Controller('audio-to-text')
export class AudioToTextController {
  private readonly logger = new Logger('AudioToTextController');

  constructor(
    @Inject(AUDIO_TO_TEXT_TOKENS.CONVERT_AUDIO_TO_TEXT)
    private readonly convertAudioToText: ConvertAudioToText,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('audio'))
  async convert(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            message: 'File is bigger than 5 MB',
          }),
          new FileTypeValidator({
            fileType: 'audio/*',
          }),
        ],
      }),
    )
    audio: Express.Multer.File,
    @Res() res: Response,
  ) {
    const { buffer, originalname, mimetype } = audio;

    const chunks = await this.convertAudioToText.execute({
      audioBuffer: buffer,
      name: originalname,
      type: mimetype,
    });

    res.status(HttpStatus.OK).setHeader('Content-type', 'text/plain');

    pipeline(chunks, res, (err) => {
      if (err) {
        this.logger.error('Error en pipeline de stream');

        return;
      }

      this.logger.debug('Stream finalizado existosamente');
    });
  }
}
