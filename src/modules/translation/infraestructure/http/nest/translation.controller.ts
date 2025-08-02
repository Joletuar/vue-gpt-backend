import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';

import { TranslateText } from 'src/modules/translation/application/translate-text.use-case';

import { TranslateTextDto } from './dtos/translate-text.dto';
import { TRANSLATION_TOKENS } from './translation-tokens';

@Controller({
  path: 'translation',
})
export class TranslationController {
  constructor(
    @Inject(TRANSLATION_TOKENS.TRANSLATE_TEXT)
    private readonly translateText: TranslateText,
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  async translation(@Body() payload: TranslateTextDto) {
    return await this.translateText.execute(payload);
  }
}
