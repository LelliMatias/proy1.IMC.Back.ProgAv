import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1758489051727 implements MigrationInterface {
    name = 'InitialMigration1758489051727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "imc_result" ("id" SERIAL NOT NULL, "peso" numeric(10,2) NOT NULL, "altura" numeric(4,2) NOT NULL, "imc" numeric(7,2) NOT NULL, "categoria" character varying(32) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bcfc60366864341df52d175f7ea" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "imc_result"`);
    }

}
