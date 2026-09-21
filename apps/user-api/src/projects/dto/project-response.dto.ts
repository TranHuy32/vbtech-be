import { Paginate } from '@app/core';

export class ProjectResponseDto {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  thumbnail_url: string;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
}

export class ProjectListItemDto {
  id: string;
  title: string;
  slug: string;
  summary: string;
  thumbnail_url: string;
}

export class ProjectsPaginatedDto extends Paginate(ProjectListItemDto) {}
