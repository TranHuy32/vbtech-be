export class CategoryResponseDto {
  id: string;
  name: string;
  parent_id: string;
  children: CategoryResponseDto[];
}
