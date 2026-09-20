import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveProductCodeUnique1783057000000
  implements MigrationInterface
{
  name = 'RemoveProductCodeUnique1783057000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "UQ_7cfc24d6c24f0ec91294003d6b8"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "UQ_7cfc24d6c24f0ec91294003d6b8" UNIQUE ("code")`,
    );
  }
}
