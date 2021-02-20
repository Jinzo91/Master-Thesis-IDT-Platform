import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1570567697166 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" int NOT NULL IDENTITY(1,1), "mail" nvarchar(250) NOT NULL, "firstName" nvarchar(255) NOT NULL, "lastName" nvarchar(255) NOT NULL, "role" int CHECK( role IN ('0','1') ) NOT NULL CONSTRAINT "DF_6620cd026ee2b231beac7cfe578" DEFAULT 1, "password" nvarchar(255) NOT NULL, CONSTRAINT "UQ_7395ecde6cda2e7fe90253ec59f" UNIQUE ("mail"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "file" ("id" int NOT NULL IDENTITY(1,1), "fileId" nvarchar(255) NOT NULL, "length" int NOT NULL, "filename" nvarchar(255) NOT NULL, "contentType" nvarchar(255) NOT NULL, "uploadAt" nvarchar(255) NOT NULL, "uploadedById" int, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "headcount" int, "website" nvarchar(255), "industry" int CHECK( industry IN ('0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25') ) NOT NULL, "headoffice" nvarchar(255), "description" nvarchar(4000), "disabled" bit NOT NULL CONSTRAINT "DF_5f9ee97fd4fd62a61209da9b5df" DEFAULT 0, "createdAt" nvarchar(255) NOT NULL, "modifiedAt" nvarchar(255), "logoId" int, "createdById" int, "modifiedById" int, CONSTRAINT "UQ_a76c5cd486f7779bd9c319afd27" UNIQUE ("name"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "technology" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, CONSTRAINT "PK_89f217a9ebf9b4bc1a0d74883ec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "source" ("id" int NOT NULL IDENTITY(1,1), "title" nvarchar(255) NOT NULL, "description" nvarchar(4000) NOT NULL, "url" nvarchar(255), "fileId" int, "caseId" int, CONSTRAINT "PK_018c433f8264b58c86363eaadde" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "case" ("id" int NOT NULL IDENTITY(1,1), "title" nvarchar(255) NOT NULL, "description" nvarchar(4000) NOT NULL, "caseType" int CHECK( caseType IN ('0','1','2','3','4') ) NOT NULL CONSTRAINT "DF_0549ff986620eaa2895d609c665" DEFAULT 4, "featured" bit NOT NULL CONSTRAINT "DF_68b352b069c386905f01a0b4278" DEFAULT 0, "url" nvarchar(255), "disabled" bit NOT NULL CONSTRAINT "DF_5a8d21f09fa73575036bf1ec78a" DEFAULT 0, "createdAt" nvarchar(255) NOT NULL, "modifiedAt" nvarchar(255), "imageId" int, "companyId" int, "createdById" int, "modifiedById" int, CONSTRAINT "PK_a1b20a2aef6fc438389d2c4aca0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "log" ("id" int NOT NULL IDENTITY(1,1), "logType" int CHECK( logType IN ('0') ) NOT NULL, "timestamp" nvarchar(255) NOT NULL, "leadTime" int, "httpMethod" int CHECK( httpMethod IN ('0','1','2','3','4','5') ) NOT NULL, "resource" nvarchar(255) NOT NULL, "resourceType" int, "event" int CHECK( event IN ('0','1','2','3','4','5','6','7') ) NOT NULL, "success" bit NOT NULL, "userId" int, CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mail_log" ("id" int NOT NULL IDENTITY(1,1), "mailType" int CHECK( mailType IN ('0','1','2') ) NOT NULL, "timestamp" nvarchar(255) NOT NULL, "mail" nvarchar(255) NOT NULL, "leadTime" int, "accepted" nvarchar(255), "rejected" nvarchar(255), "success" bit NOT NULL, CONSTRAINT "PK_01528929d58f733fd6bc613c638" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invite" ("id" int NOT NULL IDENTITY(1,1), "mail" nvarchar(250) NOT NULL, "hash" nvarchar(255) NOT NULL, "dateCreated" nvarchar(255) NOT NULL, CONSTRAINT "UQ_1895976f96de01bbb52c7fabcde" UNIQUE ("mail"), CONSTRAINT "PK_fc9fa190e5a3c5d80604a4f63e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscriber" ("id" int NOT NULL IDENTITY(1,1), "mail" nvarchar(250) NOT NULL, "hash" nvarchar(255) NOT NULL, "active" bit NOT NULL CONSTRAINT "DF_04689a07bdc5fee71b75fe33789" DEFAULT 0, "dateCreated" nvarchar(255) NOT NULL, CONSTRAINT "UQ_52782466c4b8f69be7edc3868e0" UNIQUE ("mail"), CONSTRAINT "PK_1c52b7ddbaf79cd2650045b79c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "case_technologies_technology" ("caseId" int NOT NULL, "technologyId" int NOT NULL, CONSTRAINT "PK_5e7e6a060de414bdb7b0db4a733" PRIMARY KEY ("caseId", "technologyId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8f3c3fab9738296591f491792e" ON "case_technologies_technology" ("caseId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9893f0ef91269a958f93893bb4" ON "case_technologies_technology" ("technologyId") `);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_6d2ab44c0a95eef23d952db9a79" FOREIGN KEY ("uploadedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_1b087964cd9a3453bef7e178cce" FOREIGN KEY ("logoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_865ba8d77c1cb1478bf7e59c750" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_4db1a304a42d74a740c32f07a82" FOREIGN KEY ("modifiedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "source" ADD CONSTRAINT "FK_12a2aa7a0fca3886a6ad5ba0ab9" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "source" ADD CONSTRAINT "FK_ea3877b23f32e1a969b0daba506" FOREIGN KEY ("caseId") REFERENCES "case"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_b32aa3aed140fdc1c337b9418c4" FOREIGN KEY ("imageId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_f59d9f2fc5da9b854230e84e660" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_dd65e7402357f088fb88d41de5d" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "case" ADD CONSTRAINT "FK_a1e37fd9df915cf7ebfb4a1f373" FOREIGN KEY ("modifiedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "log" ADD CONSTRAINT "FK_cea2ed3a494729d4b21edbd2983" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "case_technologies_technology" ADD CONSTRAINT "FK_8f3c3fab9738296591f491792e4" FOREIGN KEY ("caseId") REFERENCES "case"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "case_technologies_technology" ADD CONSTRAINT "FK_9893f0ef91269a958f93893bb47" FOREIGN KEY ("technologyId") REFERENCES "technology"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "case_technologies_technology" DROP CONSTRAINT "FK_9893f0ef91269a958f93893bb47"`);
        await queryRunner.query(`ALTER TABLE "case_technologies_technology" DROP CONSTRAINT "FK_8f3c3fab9738296591f491792e4"`);
        await queryRunner.query(`ALTER TABLE "log" DROP CONSTRAINT "FK_cea2ed3a494729d4b21edbd2983"`);
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_a1e37fd9df915cf7ebfb4a1f373"`);
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_dd65e7402357f088fb88d41de5d"`);
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_f59d9f2fc5da9b854230e84e660"`);
        await queryRunner.query(`ALTER TABLE "case" DROP CONSTRAINT "FK_b32aa3aed140fdc1c337b9418c4"`);
        await queryRunner.query(`ALTER TABLE "source" DROP CONSTRAINT "FK_ea3877b23f32e1a969b0daba506"`);
        await queryRunner.query(`ALTER TABLE "source" DROP CONSTRAINT "FK_12a2aa7a0fca3886a6ad5ba0ab9"`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_4db1a304a42d74a740c32f07a82"`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_865ba8d77c1cb1478bf7e59c750"`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_1b087964cd9a3453bef7e178cce"`);
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_6d2ab44c0a95eef23d952db9a79"`);
        await queryRunner.query(`DROP INDEX "IDX_9893f0ef91269a958f93893bb4" ON "case_technologies_technology"`);
        await queryRunner.query(`DROP INDEX "IDX_8f3c3fab9738296591f491792e" ON "case_technologies_technology"`);
        await queryRunner.query(`DROP TABLE "case_technologies_technology"`);
        await queryRunner.query(`DROP TABLE "subscriber"`);
        await queryRunner.query(`DROP TABLE "invite"`);
        await queryRunner.query(`DROP TABLE "mail_log"`);
        await queryRunner.query(`DROP TABLE "log"`);
        await queryRunner.query(`DROP TABLE "case"`);
        await queryRunner.query(`DROP TABLE "source"`);
        await queryRunner.query(`DROP TABLE "technology"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TABLE "file"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
