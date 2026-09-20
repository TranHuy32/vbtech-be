import { Paginate } from '@app/core';

export class ProductResponseDto {
  id: string;
  code: string;
  name: string;
  slug: string;
  category_id: string;
  price: number;
  stock: number;
  status: string;
  is_featured: boolean;
  image_url: string;
  specifications: unknown;
  short_description: string;
  description: string;
}

export class ProductsPaginatedDto extends Paginate(ProductResponseDto) {}
