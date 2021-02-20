import { Entity, PrimaryGeneratedColumn, ManyToOne, BeforeInsert, Column, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Case } from "./case.entity";
import { User } from './../../user/model/user.entity';
import { IsString, IsNotEmpty, IsDateString } from "class-validator";

@Entity()
export class Comment {
    @ApiProperty({
        example: 4,
        description: 'Id of comment'
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'User who created this case.',
        type: User,
    })
    @ManyToOne(type => User)
    @JoinColumn()
    createdBy: User;

    @ApiProperty({
        example: 'Lorem Ipsum...',
        type: String,
        description: 'A description.',
    })
    @IsString()
    @IsNotEmpty()
    @Column({
        length: 4000,
    })
    comment: string;

    @ApiProperty({
        example: '2019-07-22T13:54:14.466Z',
        description: 'DateString with CreationTime.',
    })
    @Column()
    @IsDateString()
    @IsNotEmpty()
    createdAt: string;

    @ManyToOne(type => Case, caseEntity => caseEntity.sources, { onDelete: 'CASCADE' })
    case: Case;

    @BeforeInsert()
    async setDate() {
        this.createdAt = new Date().toISOString();
    }
}