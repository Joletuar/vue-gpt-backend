import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class OrthographyCheckDto {
  @IsString()
  prompt: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  maxTokens?: number;
}
