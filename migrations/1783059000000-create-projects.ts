import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProjects1783059000000 implements MigrationInterface {
  name = 'CreateProjects1783059000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "additional_data" jsonb,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying(255) NOT NULL,
        "slug" character varying(255) NOT NULL,
        "category" character varying(150),
        "summary" character varying(500),
        "challenge" text NOT NULL,
        "solution" text NOT NULL,
        "implementation" text,
        "results" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "thumbnail_url" character varying(512),
        "published_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "UQ_projects_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_projects_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "projects"`);
  }
}
