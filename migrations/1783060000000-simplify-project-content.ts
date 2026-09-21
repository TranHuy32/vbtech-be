import { MigrationInterface, QueryRunner } from 'typeorm';

export class SimplifyProjectContent1783060000000 implements MigrationInterface {
  name = 'SimplifyProjectContent1783060000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects" ADD "content" text`);
    await queryRunner.query(`
      UPDATE "projects"
      SET "content" = concat(
        '<h2>Thách thức</h2><p>', coalesce("challenge", ''), '</p>',
        '<h2>Giải pháp</h2><p>', coalesce("solution", ''), '</p>',
        CASE WHEN "implementation" IS NOT NULL AND "implementation" <> ''
          THEN concat('<h2>Triển khai</h2><p>', "implementation", '</p>')
          ELSE ''
        END
      )
    `);
    await queryRunner.query(
      `ALTER TABLE "projects" ALTER COLUMN "content" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "results"`);
    await queryRunner.query(
      `ALTER TABLE "projects" DROP COLUMN "implementation"`,
    );
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "solution"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "challenge"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects" ADD "challenge" text`);
    await queryRunner.query(`ALTER TABLE "projects" ADD "solution" text`);
    await queryRunner.query(`ALTER TABLE "projects" ADD "implementation" text`);
    await queryRunner.query(
      `ALTER TABLE "projects" ADD "results" jsonb NOT NULL DEFAULT '[]'::jsonb`,
    );
    await queryRunner.query(`
      UPDATE "projects"
      SET "challenge" = "content", "solution" = "content"
    `);
    await queryRunner.query(
      `ALTER TABLE "projects" ALTER COLUMN "challenge" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ALTER COLUMN "solution" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "content"`);
  }
}
