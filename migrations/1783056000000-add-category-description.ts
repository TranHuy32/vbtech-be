import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategoryDescription1783056000000
  implements MigrationInterface
{
  name = 'AddCategoryDescription1783056000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "description" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" DROP COLUMN "description"`,
    );
  }
}
