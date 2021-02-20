import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1570621499035 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "CK__user__role__37C5420D"`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "CK__company__industr__3E723F9C"`);
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "CK__case__caseType__46136164"`);
        await queryRunner.query(`ALTER TABLE "log" DROP CONSTRAINT "CK__log__logType__4BCC3ABA"`);
        await queryRunner.query(`ALTER TABLE "log" DROP CONSTRAINT "CK__log__httpMethod__4CC05EF3"`);
        await queryRunner.query(`ALTER TABLE "log" DROP CONSTRAINT "CK__log__event__4DB4832C"`);
        await queryRunner.query(`ALTER TABLE "mail_log" DROP CONSTRAINT "CK__mail_log__mailTy__5090EFD7"`);
        await queryRunner.query(`ALTER TABLE "case" ADD "hasSources" bit NOT NULL CONSTRAINT "DF_a3175e4530c45e1a669b8385a11" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "DF_a3175e4530c45e1a669b8385a11"`);
        await queryRunner.query(`ALTER TABLE "case" DROP COLUMN "hasSources"`);
        await queryRunner.query(`ALTER TABLE "mail_log" ADD CONSTRAINT "CK__mail_log__mailTy__5090EFD7" CHECK (([mailType]='2' OR [mailType]='1' OR [mailType]='0'))`);
        await queryRunner.query(`ALTER TABLE "log" ADD CONSTRAINT "CK__log__event__4DB4832C" CHECK (([event]='7' OR [event]='6' OR [event]='5' OR [event]='4' OR [event]='3' OR [event]='2' OR [event]='1' OR [event]='0'))`);
        await queryRunner.query(`ALTER TABLE "log" ADD CONSTRAINT "CK__log__httpMethod__4CC05EF3" CHECK (([httpMethod]='5' OR [httpMethod]='4' OR [httpMethod]='3' OR [httpMethod]='2' OR [httpMethod]='1' OR [httpMethod]='0'))`);
        await queryRunner.query(`ALTER TABLE "log" ADD CONSTRAINT "CK__log__logType__4BCC3ABA" CHECK (([logType]='0'))`);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "CK__case__caseType__46136164" CHECK (([caseType]='4' OR [caseType]='3' OR [caseType]='2' OR [caseType]='1' OR [caseType]='0'))`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "CK__company__industr__3E723F9C" CHECK (([industry]='25' OR [industry]='24' OR [industry]='23' OR [industry]='22' OR [industry]='21' OR [industry]='20' OR [industry]='19' OR [industry]='18' OR [industry]='17' OR [industry]='16' OR [industry]='15' OR [industry]='14' OR [industry]='13' OR [industry]='12' OR [industry]='11' OR [industry]='10' OR [industry]='9' OR [industry]='8' OR [industry]='7' OR [industry]='6' OR [industry]='5' OR [industry]='4' OR [industry]='3' OR [industry]='2' OR [industry]='1' OR [industry]='0'))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "CK__user__role__37C5420D" CHECK (([role]='1' OR [role]='0'))`);
    }

}
