import {
  AppBadRequestException,
  AppConflictException,
  AppException,
  AppNotFoundException,
  ErrorCode,
  PageMetaDto,
  slugify,
} from '@app/core';
import { ProjectEntity } from '@app/core/entities/project.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, QueryFailedError, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import {
  ProjectListItemDto,
  ProjectResponseDto,
  ProjectsPaginatedDto,
} from './dto/project-response.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly repository: Repository<ProjectEntity>,
  ) {}

  private pgCode(error: unknown) {
    return (error as QueryFailedError & { driverError?: { code?: string } })
      .driverError?.code;
  }

  private throwDbError(error: unknown, fallback: ErrorCode): never {
    if (error instanceof AppException) throw error;
    if (this.pgCode(error) === '23505')
      throw new AppConflictException(ErrorCode.PROJECT_ALREADY_EXISTS);
    throw new AppBadRequestException(fallback);
  }

  private async uniqueSlug(title: string, excludeId?: string) {
    const base = slugify(title) || 'project';
    let slug = base;
    let suffix = 2;
    while (
      await this.repository.exists({
        where: excludeId ? { slug, id: Not(excludeId) } : { slug },
      })
    ) {
      const ending = `-${suffix++}`;
      slug = `${base.slice(0, 255 - ending.length)}${ending}`;
    }
    return slug;
  }

  async findAll(query: ProjectQueryDto): Promise<ProjectsPaginatedDto> {
    try {
      const qb = this.repository
        .createQueryBuilder('project')
        .select([
          'project.id',
          'project.title',
          'project.slug',
          'project.summary',
          'project.thumbnail_url',
        ])
        .orderBy('project.created_at', query.order)
        .skip(query.skip)
        .take(query.take);
      if (query.keyword) {
        qb.andWhere(
          '(project.title ILIKE :keyword OR project.summary ILIKE :keyword OR project.category ILIKE :keyword OR project.slug ILIKE :keyword)',
          { keyword: `%${query.keyword}%` },
        );
      }
      const [projects, total] = await qb.getManyAndCount();
      return new ProjectsPaginatedDto(
        projects.map((project) => this.toListDto(project)),
        new PageMetaDto({ options: query, total }),
      );
    } catch (error) {
      this.throwDbError(error, ErrorCode.PROJECT_LIST_FAILED);
    }
  }

  async findBySlug(slug: string): Promise<ProjectResponseDto> {
    try {
      const project = await this.repository.findOneBy({ slug });
      if (!project) throw new AppNotFoundException(ErrorCode.PROJECT_NOT_FOUND);
      return this.toDto(project);
    } catch (error) {
      this.throwDbError(error, ErrorCode.PROJECT_LIST_FAILED);
    }
  }

  async create(dto: CreateProjectDto) {
    try {
      return await this.repository.save(
        this.repository.create({
          ...dto,
          slug: await this.uniqueSlug(dto.title),
          published_at: new Date(),
        }),
      );
    } catch (error) {
      this.throwDbError(error, ErrorCode.PROJECT_CREATE_FAILED);
    }
  }

  async update(id: string, dto: UpdateProjectDto) {
    try {
      const project = await this.repository.preload({
        id,
        ...dto,
        ...(dto.title ? { slug: await this.uniqueSlug(dto.title, id) } : {}),
      });
      if (!project) throw new AppNotFoundException(ErrorCode.PROJECT_NOT_FOUND);
      return this.repository.save(project);
    } catch (error) {
      this.throwDbError(error, ErrorCode.PROJECT_UPDATE_FAILED);
    }
  }

  async remove(id: string) {
    try {
      const project = await this.repository.findOneBy({ id });
      if (!project) throw new AppNotFoundException(ErrorCode.PROJECT_NOT_FOUND);
      await this.repository.softRemove(project);
      return { success: true };
    } catch (error) {
      this.throwDbError(error, ErrorCode.PROJECT_DELETE_FAILED);
    }
  }

  private toDto(project: ProjectEntity): ProjectResponseDto {
    return {
      id: project.id,
      title: project.title,
      slug: project.slug,
      category: project.category,
      summary: project.summary,
      content: project.content,
      thumbnail_url: project.thumbnail_url,
      published_at: project.published_at,
      created_at: project.created_at,
      updated_at: project.updated_at,
    };
  }

  private toListDto(project: ProjectEntity): ProjectListItemDto {
    return {
      id: project.id,
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      thumbnail_url: project.thumbnail_url,
    };
  }
}
