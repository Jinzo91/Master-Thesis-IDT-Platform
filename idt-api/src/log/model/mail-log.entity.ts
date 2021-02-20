import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm";
import { MailTypeEnum } from "./mail-type.enum";

@Entity()
export class MailLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        enum: MailTypeEnum,
    })
    mailType: number;

    @Column()
    timestamp: string;

    @Column()
    mail: string;

    @Column({
        nullable: true
    })
    leadTime: number;

    @Column({
        nullable: true
    })
    accepted: string;

    @Column({
        nullable: true
    })
    rejected: string;

    @Column()
    success: boolean;

    @BeforeInsert()
    async setDate() {
        this.timestamp = new Date().toISOString();
    }

}