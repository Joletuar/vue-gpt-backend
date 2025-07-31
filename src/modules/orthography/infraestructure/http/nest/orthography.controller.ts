import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CheckOrthography } from 'src/modules/orthography/application/check-orthography.use-case';

import { OrthographyDto } from './dtos/orthography-check.dto';
import { TOKENS } from './tokens';

@Controller({
  path: 'orthography',
})
export class OrthographyController {
  constructor(
    @Inject(TOKENS.CHECK_ORTHOGRAPHY)
    private readonly checkOrthography: CheckOrthography,
  ) {}

  @Post('check')
  orthographyCheck(@Body() payload: OrthographyDto) {
    return this.checkOrthography.execute(payload);
  }
}
