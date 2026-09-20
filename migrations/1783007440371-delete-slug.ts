import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteSlug1783007440371 implements MigrationInterface {
    name = 'DeleteSlug1783007440371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_464f927ae360106b783ed0b4106"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "UQ_1123ff6815c5b8fec0ba9fec370"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "articles" ADD "slug" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "UQ_1123ff6815c5b8fec0ba9fec370" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "products" ADD "slug" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_464f927ae360106b783ed0b4106" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "slug" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug")`);
    }

}
