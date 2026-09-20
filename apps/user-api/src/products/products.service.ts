import {
  AppBadRequestException,
  AppConflictException,
  AppException,
  AppNotFoundException,
  ErrorCode,
} from '@app/core';
import { ProductEntity } from '@app/core/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto, ProductSortBy } from './dto/product-query.dto';
import {
  ProductResponseDto,
  ProductsPaginatedDto,
} from './dto/product-response.dto';
import { UpdateProductFeaturedDto } from './dto/update-product-featured.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PageMetaDto } from '@app/core';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
  ) {}

  private pgCode(error: unknown) {
    return (error as QueryFailedError & { driverError?: { code?: string } })
      .driverError?.code;
  }

  private throwDbError(error: unknown, fallback: ErrorCode): never {
    if (error instanceof AppException) throw error;
    if (this.pgCode(error) === '23505') {
      throw new AppConflictException(ErrorCode.PRODUCT_ALREADY_EXISTS);
    }
    if (this.pgCode(error) === '23503') {
      throw new AppBadRequestException(ErrorCode.PRODUCT_CATEGORY_NOT_FOUND);
    }
    throw new AppBadRequestException(fallback);
  }

  async findAll(query: ProductQueryDto): Promise<ProductsPaginatedDto> {
    try {
      const sortColumns: Record<ProductSortBy, string> = {
        [ProductSortBy.NAME]: 'product.name',
        [ProductSortBy.PRICE]: 'product.price',
        [ProductSortBy.STOCK]: 'product.stock',
        [ProductSortBy.CREATED_AT]: 'product.created_at',
      };
      const qb = this.productsRepository
        .createQueryBuilder('product')
        .orderBy(sortColumns[query.sort_by], query.order)
        .skip(query.skip)
        .take(query.take);

      if (query.category_id) {
        qb.andWhere(
          `
          product.category_id IN (
            WITH RECURSIVE category_tree AS (
              SELECT id FROM categories WHERE id = :categoryId AND deleted_at IS NULL
              UNION ALL
              SELECT c.id
              FROM categories c
              JOIN category_tree ct ON c.parent_id = ct.id
              WHERE c.deleted_at IS NULL
            )
            SELECT id FROM category_tree
          )
          `,
          { categoryId: query.category_id },
        );
      }

      if (query.keyword) {
        qb.andWhere(
          '(product.name ILIKE :keyword OR product.code ILIKE :keyword)',
          { keyword: `%${query.keyword}%` },
        );
      }

      if (query.is_featured !== undefined) {
        qb.andWhere('product.is_featured = :isFeatured', {
          isFeatured: query.is_featured,
        });
      }

      const [products, total] = await qb.getManyAndCount();

      return new ProductsPaginatedDto(
        products.map((product) => this.toResponseDto(product)),
        new PageMetaDto({ options: query, total }),
      );
    } catch (error) {
      this.throwDbError(error, ErrorCode.PRODUCT_LIST_FAILED);
    }
  }

  private toResponseDto(product: ProductEntity): ProductResponseDto {
    return {
      id: product.id,
      code: product.code,
      name: product.name,
      category_id: product.category_id,
      price: product.price,
      stock: product.stock,
      status: product.status,
      is_featured: product.is_featured,
      image_url: product.image_url,
      specifications: product.specifications,
      description: product.description,
    };
  }

  async create(dto: CreateProductDto) {
    try {
      return await this.productsRepository.save(
        this.productsRepository.create({
          ...dto,
        }),
      );
    } catch (error) {
      this.throwDbError(error, ErrorCode.PRODUCT_CREATE_FAILED);
    }
  }

  async update(id: string, dto: UpdateProductDto) {
    try {
      const product = await this.productsRepository.preload({
        id,
        ...dto,
      });
      if (!product) throw new AppNotFoundException(ErrorCode.PRODUCT_NOT_FOUND);
      return this.productsRepository.save(product);
    } catch (error) {
      this.throwDbError(error, ErrorCode.PRODUCT_UPDATE_FAILED);
    }
  }

  async updateFeatured(id: string, dto: UpdateProductFeaturedDto) {
    try {
      const product = await this.productsRepository.preload({
        id,
        is_featured: dto.is_featured,
      });
      if (!product) throw new AppNotFoundException(ErrorCode.PRODUCT_NOT_FOUND);
      return this.productsRepository.save(product);
    } catch (error) {
      this.throwDbError(error, ErrorCode.PRODUCT_UPDATE_FAILED);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.productsRepository.findOneBy({ id });
      if (!product) throw new AppNotFoundException(ErrorCode.PRODUCT_NOT_FOUND);
      await this.productsRepository.softRemove(product);
      return { success: true };
    } catch (error) {
      this.throwDbError(error, ErrorCode.PRODUCT_DELETE_FAILED);
    }
  }
}
