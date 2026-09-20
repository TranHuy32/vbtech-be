import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductShortDescription1783058000000
  implements MigrationInterface
{
  name = 'AddProductShortDescription1783058000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD "short_description" character varying(500)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "short_description"`,
    );
  }
}
