import { Paginate } from '@app/core';

export class ArticleResponseDto {
  id: string;
  title: string;
  summary: string;
  content: string;
  thumbnail_url: string;
  author_id: string;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
}

export class ArticlesPaginatedDto extends Paginate(ArticleResponseDto) {}
