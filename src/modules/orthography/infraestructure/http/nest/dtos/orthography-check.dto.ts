import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class OrthographyDto {
  @IsString()
  prompt: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  maxTokens?: number;
}
