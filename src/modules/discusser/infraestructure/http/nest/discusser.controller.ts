import { pipeline } from 'node:stream';

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

import { GenerateDiscussionStream } from 'src/modules/discusser/application/generate-discussion-stream/generate-discussion-stream.use-case';
import { GenerateDiscussion } from 'src/modules/discusser/application/generate-discussion/generate-discussion.use-case';

import { DISCUSSER_TOKENS } from './discusser-tokens';
import { ProsConsDiscusserDto } from './dtos/pros-cons-discusser.dto';

@Controller('discusser')
export class DiscusserController {
  private readonly logger = new Logger('DiscusserController');

  constructor(
    @Inject(DISCUSSER_TOKENS.GENERATE_DISCUSSION)
    private readonly generateDiscussion: GenerateDiscussion,
    @Inject(DISCUSSER_TOKENS.GENERATE_DISCUSSION_STREAM)
    private readonly generateDiscussionStream: GenerateDiscussionStream,
  ) {}

  @Post('/')
  async prosConsDiscusser(@Body() payload: ProsConsDiscusserDto) {
    return await this.generateDiscussion.execute(payload);
  }

  @Post('/stream')
  async prosConsDiscusserStream(
    @Body() payload: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const chunks = await this.generateDiscussionStream.execute(payload);

    res.status(HttpStatus.OK).setHeader('Content-Type', 'application/json');

    pipeline(chunks, res, (error) => {
      if (error) {
        if (error.code === 'ERR_STREAM_PREMATURE_CLOSE') {
          return this.logger.warn('Stream cerrado prematuramente');
        }

        return this.logger.error('Error en pipline del stream', error);
      }

      this.logger.debug('Stream finalizado exitosamente');
    });
  }
}
