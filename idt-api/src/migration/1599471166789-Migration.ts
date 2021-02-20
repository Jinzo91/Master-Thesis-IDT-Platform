import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1599471166789 implements MigrationInterface {
    name = 'Migration1599471166789'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "comment" ("id" int NOT NULL IDENTITY(1,1), "comment" nvarchar(4000) NOT NULL, "createdAt" nvarchar(255) NOT NULL, "createdById" int, "caseId" int, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_63ac916757350d28f05c5a6a4ba" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_6c37ac5b602a495d0d3dd5cd7b5" FOREIGN KEY ("caseId") REFERENCES "case"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_6c37ac5b602a495d0d3dd5cd7b5"`, undefined);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_63ac916757350d28f05c5a6a4ba"`, undefined);
        await queryRunner.query(`DROP TABLE "comment"`, undefined);
    }

}
