export class CategoryResponseDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id: string;
  children: CategoryResponseDto[];
}
