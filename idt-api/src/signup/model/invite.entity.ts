import { Entity, Unique, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import * as uuid from 'uuid/v4';

@Entity()
@Unique(['mail'])
export class Invite {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 250 })
    @IsEmail()
    @IsNotEmpty()
    mail: string;

    @Column()
    hash: string;

    @Column()
    dateCreated: string;

    @BeforeInsert()
    async createHash() {
        this.hash = uuid();
        this.dateCreated = new Date().toISOString();
    }
}
