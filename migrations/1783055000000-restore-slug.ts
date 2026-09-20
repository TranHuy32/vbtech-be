import { MigrationInterface, QueryRunner } from 'typeorm';

export class RestoreSlug1783055000000 implements MigrationInterface {
  name = 'RestoreSlug1783055000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.addSlug(queryRunner, 'categories', 'name', 100, 90);
    await this.addSlug(queryRunner, 'products', 'name', 255, 245);
    await this.addSlug(queryRunner, 'articles', 'title', 255, 245);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "slug"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "slug"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "slug"`);
  }

  private async addSlug(
    queryRunner: QueryRunner,
    table: string,
    sourceColumn: string,
    length: number,
    baseLength: number,
  ): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "${table}" ADD "slug" character varying(${length})`,
    );
    await queryRunner.query(
      `UPDATE "${table}" SET "slug" = COALESCE(NULLIF(LEFT(TRIM(BOTH '-' FROM REGEXP_REPLACE(LOWER("${sourceColumn}"), '[^a-z0-9]+', '-', 'g')), ${baseLength}), ''), 'item') || '-' || SUBSTRING("id"::text, 1, 8)`,
    );
    await queryRunner.query(
      `ALTER TABLE "${table}" ALTER COLUMN "slug" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "${table}" ADD CONSTRAINT "UQ_${table}_slug" UNIQUE ("slug")`,
    );
  }
}
