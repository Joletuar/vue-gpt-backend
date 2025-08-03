import {
  Controller,
  FileTypeValidator,
  Inject,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ConvertAudioToText } from '../../../application/convert-audio-to-text.use-case';
import { AUDIO_TO_TEXT_TOKENS } from './audio-to-text-tokens';

@Controller('audio-to-text')
export class AudioToTextController {
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
  ) {
    const { buffer, originalname, mimetype } = audio;

    const result = await this.convertAudioToText.execute({
      audioBuffer: buffer,
      name: originalname,
      type: mimetype,
    });

    return result;
  }
}
