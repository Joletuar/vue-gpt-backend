import { IsString } from 'class-validator';

export class TranslateTextDto {
  @IsString()
  prompt: string;

  @IsString()
  lang: string;
}
