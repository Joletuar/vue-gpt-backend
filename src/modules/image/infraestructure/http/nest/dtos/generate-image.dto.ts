import { IsString } from 'class-validator';

export class GenerateImageDto {
  @IsString()
  readonly prompt: string;
}
