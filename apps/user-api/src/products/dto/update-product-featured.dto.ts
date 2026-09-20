import { IsBoolean } from 'class-validator';

export class UpdateProductFeaturedDto {
  @IsBoolean()
  is_featured: boolean;
}
