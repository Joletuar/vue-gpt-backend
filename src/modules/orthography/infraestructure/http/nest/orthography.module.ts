import { Module } from '@nestjs/common';
import { CheckOrthography } from 'src/modules/orthography/application/check-orthography.use-case';

import { OrthographyController } from './orthography.controller';
import { TOKENS } from './tokens';

@Module({
  controllers: [OrthographyController],
  providers: [
    {
      useClass: CheckOrthography,
      provide: TOKENS.CHECK_ORTHOGRAPHY,
    },
  ],
})
export class OrthographyModule {}
