import { Type } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type as TransformType } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { OrderBy } from '../constants';

export class PageQueryDto {
  @ApiPropertyOptional({
    enum: OrderBy,
    default: OrderBy.DESC,
  })
  @IsEnum(OrderBy)
  @IsOptional()
  readonly order: OrderBy = OrderBy.DESC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Transform(({ value }) => +value)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @Transform(({ value }) => +value)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly take: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(200)
  readonly keyword?: string;
}

export class PageWithDateQueryDto extends PageQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @TransformType(() => Date)
  from: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @TransformType(() => Date)
  to: Date;
}

interface IPageMetaDto {
  options: PageQueryDto;
  total: number;
}

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly totalPage: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ options, total }: IPageMetaDto) {
    this.page = options.page;
    this.take = options.take;
    this.total = total;
    this.totalPage = Math.ceil(this.total / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.totalPage;
  }
}

export interface IPaginated<T> {
  docs: T[];
  meta: PageMetaDto;
}

export function Paginate<T>(classRef: Type<T>): Type<IPaginated<T>> {
  class Pagination implements IPaginated<T> {
    @ApiProperty({ type: classRef, isArray: true })
    docs: T[];

    @ApiProperty({ type: () => PageMetaDto })
    meta: PageMetaDto;

    constructor(data: T[], meta: PageMetaDto) {
      this.docs = data;
      this.meta = meta;
    }
  }

  return Pagination;
}
