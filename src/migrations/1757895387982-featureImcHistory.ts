import { MigrationInterface, QueryRunner } from "typeorm";

export class FeatureImcHistory1757895387982 implements MigrationInterface {
    name = 'FeatureImcHistory1757895387982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`imc_result\` (\`id\` int NOT NULL AUTO_INCREMENT, \`peso\` decimal(10,2) NOT NULL, \`altura\` decimal(4,2) NOT NULL, \`imc\` decimal(5,2) NOT NULL, \`categoria\` varchar(32) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`imc_result\``);
    }

}
