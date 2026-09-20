import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  thumbnail_url?: string;
}
