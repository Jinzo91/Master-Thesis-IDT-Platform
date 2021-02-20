import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert } from "typeorm";
import { User } from "./../../user/model/user.entity";
import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import * as mongoose from "mongoose";

export const FileSchema = new mongoose.Schema({
    length: Number,
    chunkSize: Number,
    uploadDate: Date,
    filename: String,
    md5: String,
});

@Entity()
export class File {
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;
    
    @Exclude()
    @Column()
    fileId: string;

    @Exclude()
    @Column()
    length: number;

    @Exclude()
    @Column()
    filename: string;

    @ApiProperty({
        example: 'application/pdf',
        description: 'MIME/Type of file.',
    })
    @Column()
    contentType: string;

    @ApiProperty({
        example: '2019-07-22T13:54:14.466Z',
        description: 'DateString with CreationTime.',
    })
    @Column()
    uploadAt: string;
    
    @ApiProperty({
        description: 'User who created this case.',
        type: User,
    })
    @ManyToOne(type => User)
    @JoinColumn()
    uploadedBy: number;

    @BeforeInsert()
    async setDate() {
        this.uploadAt = new Date().toISOString();
    }
}