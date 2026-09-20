import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductTable1783054012033 implements MigrationInterface {
    name = 'UpdateProductTable1783054012033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "is_featured" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "is_featured"`);
    }

}
