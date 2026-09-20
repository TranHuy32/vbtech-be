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
import { QueryFailedError, Repository } from 'typeorm';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
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
      parent_id: category.parent_id,
      children: [],
    };
  }

  async create(dto: CreateCategoryDto) {
    try {
      return await this.categoriesRepository.save(
        this.categoriesRepository.create({
          ...dto,
        }),
      );
    } catch (error) {
      this.throwDbError(error, ErrorCode.CATEGORY_CREATE_FAILED);
    }
  }

  async update(id: string, dto: UpdateCategoryDto) {
    try {
      const category = await this.categoriesRepository.preload({
        id,
        ...dto,
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
