import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { pipeline } from 'stream';

import { ConvertTextToAudio } from '../../../application/convert-text-to-audio.use-case';
import { TextToAudioDto } from './dtos/text-to-audio.dto';
import { TEXT_TO_AUDIO_TOKENS } from './text-to-audio-tokens';

@Controller('text-to-audio')
export class TextToAudioController {
  private readonly logger = new Logger('TextToAudioController');

  constructor(
    @Inject(TEXT_TO_AUDIO_TOKENS.CONVERT_TEXT_TO_AUDIO)
    private readonly _convertTextToAudio: ConvertTextToAudio,
  ) {}

  @Post()
  async convertTextToAudio(@Body() dto: TextToAudioDto, @Res() res: Response) {
    const chunks = await this._convertTextToAudio.execute(dto);

    res.status(HttpStatus.OK).set({
      'Content-Type': 'audio/mp3',
      'Content-Disposition': 'inline; filename="audio.mp3"',
    });

    return pipeline(chunks, res, (err) => {
      if (err) {
        return this.logger.error('Error en pipline del stream', err);
      }

      this.logger.debug('Stream finalizado exitosamente');
    });
  }
}
