import { IsString } from 'class-validator';

export class EditImageDto {
  @IsString()
  readonly prompt: string;

  @IsString()
  readonly originalImage: string;

  @IsString()
  readonly maskImage: string;
}
