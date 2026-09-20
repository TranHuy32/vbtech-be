import { PageQueryDto } from '@app/core';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';

export enum ProductSortBy {
  NAME = 'name',
  PRICE = 'price',
  STOCK = 'stock',
  CREATED_AT = 'created_at',
}

export class ProductQueryDto extends PageQueryDto {
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  @IsEnum(ProductSortBy)
  sort_by: ProductSortBy = ProductSortBy.CREATED_AT;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  is_featured?: boolean;
}
