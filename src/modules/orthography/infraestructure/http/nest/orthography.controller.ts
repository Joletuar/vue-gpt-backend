import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';

import { CheckOrthography } from 'src/modules/orthography/application/check-orthography.use-case';

import { OrthographyCheckDto } from './dtos/orthography-check.dto';
import { ORTHOGRAPHY_TOKENS } from './orthography-tokens';

@Controller({
  path: 'orthography',
})
export class OrthographyController {
  constructor(
    @Inject(ORTHOGRAPHY_TOKENS.CHECK_ORTHOGRAPHY)
    private readonly checkOrthography: CheckOrthography,
  ) {}

  @Post('check')
  @HttpCode(HttpStatus.OK)
  orthographyCheck(@Body() payload: OrthographyCheckDto) {
    return this.checkOrthography.execute(payload);
  }
}
