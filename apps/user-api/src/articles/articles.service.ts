import {
  AppBadRequestException,
  AppException,
  AppNotFoundException,
  ErrorCode,
  PageMetaDto,
} from '@app/core';
import { ArticleEntity } from '@app/core/entities/article.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ArticleQueryDto } from './dto/article-query.dto';
import {
  ArticleResponseDto,
  ArticlesPaginatedDto,
} from './dto/article-response.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articlesRepository: Repository<ArticleEntity>,
  ) {}

  private pgCode(error: unknown) {
    return (error as QueryFailedError & { driverError?: { code?: string } })
      .driverError?.code;
  }

  private throwDbError(error: unknown, fallback: ErrorCode): never {
    if (error instanceof AppException) throw error;
    if (this.pgCode(error) === '23503') {
      throw new AppBadRequestException(ErrorCode.ARTICLE_AUTHOR_NOT_FOUND);
    }
    throw new AppBadRequestException(fallback);
  }

  async findAll(query: ArticleQueryDto): Promise<ArticlesPaginatedDto> {
    try {
      const qb = this.articlesRepository
        .createQueryBuilder('article')
        .orderBy('article.created_at', query.order)
        .skip(query.skip)
        .take(query.take);

      if (query.keyword) {
        qb.andWhere(
          '(article.title ILIKE :keyword OR article.summary ILIKE :keyword)',
          { keyword: `%${query.keyword}%` },
        );
      }

      const [articles, total] = await qb.getManyAndCount();

      return new ArticlesPaginatedDto(
        articles.map((article) => this.toResponseDto(article)),
        new PageMetaDto({ options: query, total }),
      );
    } catch (error) {
      this.throwDbError(error, ErrorCode.ARTICLE_LIST_FAILED);
    }
  }

  async create(dto: CreateArticleDto, authorId: string) {
    try {
      return await this.articlesRepository.save(
        this.articlesRepository.create({
          ...dto,
          author_id: authorId,
          published_at: new Date(),
        }),
      );
    } catch (error) {
      this.throwDbError(error, ErrorCode.ARTICLE_CREATE_FAILED);
    }
  }

  async update(id: string, dto: UpdateArticleDto) {
    try {
      const article = await this.articlesRepository.preload({ id, ...dto });
      if (!article) throw new AppNotFoundException(ErrorCode.ARTICLE_NOT_FOUND);
      return this.articlesRepository.save(article);
    } catch (error) {
      this.throwDbError(error, ErrorCode.ARTICLE_UPDATE_FAILED);
    }
  }

  async remove(id: string) {
    try {
      const article = await this.articlesRepository.findOneBy({ id });
      if (!article) throw new AppNotFoundException(ErrorCode.ARTICLE_NOT_FOUND);
      await this.articlesRepository.softRemove(article);
      return { success: true };
    } catch (error) {
      this.throwDbError(error, ErrorCode.ARTICLE_DELETE_FAILED);
    }
  }

  private toResponseDto(article: ArticleEntity): ArticleResponseDto {
    return {
      id: article.id,
      title: article.title,
      summary: article.summary,
      content: article.content,
      thumbnail_url: article.thumbnail_url,
      author_id: article.author_id,
      published_at: article.published_at,
      created_at: article.created_at,
      updated_at: article.updated_at,
    };
  }
}
