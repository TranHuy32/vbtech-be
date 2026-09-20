import {
  AppBadRequestException,
  AppConflictException,
  AppException,
  AppNotFoundException,
  ErrorCode,
} from '@app/core';
import { CategoryEntity } from '@app/core/entities/category.entity';
import { slugify } from '@app/core/utils';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, QueryFailedError, Repository } from 'typeorm';
import sanitizeHtml = require('sanitize-html');
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  private readonly maxDepth = 3;

  constructor(
    @InjectRepository(CategoryEntity)
    private categoriesRepository: Repository<CategoryEntity>,
  ) {}

  private pgCode(error: unknown) {
    return (error as QueryFailedError & { driverError?: { code?: string } })
      .driverError?.code;
  }

  private throwDbError(error: unknown, fallback: ErrorCode): never {
    if (error instanceof AppException) throw error;
    if (this.pgCode(error) === '23505') {
      throw new AppConflictException(ErrorCode.CATEGORY_ALREADY_EXISTS);
    }
    if (this.pgCode(error) === '23503') {
      throw new AppBadRequestException(ErrorCode.CATEGORY_PARENT_NOT_FOUND);
    }
    throw new AppBadRequestException(fallback);
  }

  private async createUniqueSlug(name: string, excludeId?: string) {
    const base = slugify(name) || 'category';
    let slug = base;
    let suffix = 2;

    while (
      await this.categoriesRepository.exists({
        where: excludeId ? { slug, id: Not(excludeId) } : { slug },
      })
    ) {
      const ending = `-${suffix++}`;
      slug = `${base.slice(0, 100 - ending.length)}${ending}`;
    }

    return slug;
  }

  private sanitizeDescription(description?: string) {
    if (!description) return description;
    return sanitizeHtml(description, {
      allowedTags: [
        'p',
        'div',
        'br',
        'h1',
        'h2',
        'h3',
        'strong',
        'em',
        'u',
        'hr',
        'img',
        'blockquote',
        'ul',
        'ol',
        'li',
        'a',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
      ],
      allowedAttributes: {
        a: ['href', 'target', 'rel', 'title'],
        img: ['src', 'alt', 'title', 'style'],
        p: ['style'],
        div: ['style'],
        h1: ['style'],
        h2: ['style'],
        h3: ['style'],
        th: ['style'],
        td: ['style'],
      },
      allowedStyles: {
        '*': { 'text-align': [/^(left|center|right|justify)$/] },
        img: { width: [/^(25|50|75|100)%$/] },
      },
      allowedSchemes: ['http', 'https', 'mailto', 'tel'],
      transformTags: {
        a: (tagName, attributes) => ({
          tagName,
          attribs: {
            ...attributes,
            target: '_blank',
            rel: 'noopener noreferrer',
            ...(attributes.href ? { title: attributes.href } : {}),
          },
        }),
      },
    });
  }

  private async validateParent(parentId?: string | null, categoryId?: string) {
    const categories = await this.categoriesRepository.find({
      select: { id: true, parent_id: true },
    });
    const byId = new Map(categories.map((category) => [category.id, category]));

    if (parentId && !byId.has(parentId)) {
      throw new AppBadRequestException(ErrorCode.CATEGORY_PARENT_NOT_FOUND);
    }

    let parentDepth = 0;
    let currentId = parentId;
    const ancestors = new Set<string>();
    while (currentId) {
      if (currentId === categoryId || ancestors.has(currentId)) {
        throw new AppBadRequestException(ErrorCode.CATEGORY_CIRCULAR_REFERENCE);
      }
      ancestors.add(currentId);
      parentDepth += 1;
      currentId = byId.get(currentId)?.parent_id;
    }

    const subtreeHeight = categoryId
      ? this.getSubtreeHeight(categoryId, categories)
      : 1;
    if (parentDepth + subtreeHeight > this.maxDepth) {
      throw new AppBadRequestException(ErrorCode.CATEGORY_MAX_DEPTH_EXCEEDED);
    }
  }

  private getSubtreeHeight(
    categoryId: string,
    categories: Pick<CategoryEntity, 'id' | 'parent_id'>[],
  ): number {
    const childrenByParent = new Map<string, string[]>();
    for (const category of categories) {
      if (!category.parent_id) continue;
      const children = childrenByParent.get(category.parent_id) ?? [];
      children.push(category.id);
      childrenByParent.set(category.parent_id, children);
    }

    const visit = (id: string, path: Set<string>): number => {
      if (path.has(id)) {
        throw new AppBadRequestException(ErrorCode.CATEGORY_CIRCULAR_REFERENCE);
      }
      const nextPath = new Set(path).add(id);
      const children = childrenByParent.get(id) ?? [];
      return (
        1 + Math.max(0, ...children.map((child) => visit(child, nextPath)))
      );
    };

    return visit(categoryId, new Set());
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    try {
      const categories = await this.categoriesRepository.find({
        order: { created_at: 'ASC' },
      });
      const byId = new Map(
        categories.map((category) => [
          category.id,
          this.toResponseDto(category),
        ]),
      );

      return [...byId.values()].filter((category) => {
        if (!category.parent_id) return true;
        const parent = byId.get(category.parent_id);
        if (!parent) return true;
        parent.children.push(category);
        return false;
      });
    } catch (error) {
      this.throwDbError(error, ErrorCode.CATEGORY_LIST_FAILED);
    }
  }

  private toResponseDto(category: CategoryEntity): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parent_id: category.parent_id,
      children: [],
    };
  }

  async create(dto: CreateCategoryDto) {
    try {
      await this.validateParent(dto.parent_id);
      const slug = await this.createUniqueSlug(dto.name);
      return await this.categoriesRepository.save(
        this.categoriesRepository.create({
          ...dto,
          description: this.sanitizeDescription(dto.description),
          slug,
        }),
      );
    } catch (error) {
      this.throwDbError(error, ErrorCode.CATEGORY_CREATE_FAILED);
    }
  }

  async update(id: string, dto: UpdateCategoryDto) {
    try {
      if (Object.prototype.hasOwnProperty.call(dto, 'parent_id')) {
        await this.validateParent(dto.parent_id, id);
      }
      const slug = dto.name
        ? await this.createUniqueSlug(dto.name, id)
        : undefined;
      const category = await this.categoriesRepository.preload({
        id,
        ...dto,
        ...(dto.description !== undefined
          ? { description: this.sanitizeDescription(dto.description) }
          : {}),
        ...(slug ? { slug } : {}),
      });
      if (!category)
        throw new AppNotFoundException(ErrorCode.CATEGORY_NOT_FOUND);
      return this.categoriesRepository.save(category);
    } catch (error) {
      this.throwDbError(error, ErrorCode.CATEGORY_UPDATE_FAILED);
    }
  }

  async remove(id: string) {
    try {
      const category = await this.categoriesRepository.findOneBy({ id });
      if (!category)
        throw new AppNotFoundException(ErrorCode.CATEGORY_NOT_FOUND);
      const hasChildren = await this.categoriesRepository.exist({
        where: { parent_id: id },
      });
      if (hasChildren) {
        throw new AppBadRequestException(ErrorCode.CATEGORY_HAS_CHILDREN);
      }
      await this.categoriesRepository.softRemove(category);
      return { success: true };
    } catch (error) {
      this.throwDbError(error, ErrorCode.CATEGORY_DELETE_FAILED);
    }
  }
}
