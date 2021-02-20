import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { File } from "./../../file/model/file.entity";
import { IsString, IsNotEmpty, IsOptional, IsUrl } from "class-validator";
import { Case } from "./case.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Entity()
export class Source {
    @ApiProperty({
        example: 4,
        description: 'Id of source.',
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example: 'Research Paper XY',
        type: String,
        description: 'A title for the source.',
    })
    @IsString()
    @IsNotEmpty()
    @Column()
    title: string;

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
    description: string;

    @ApiPropertyOptional({
        example: 'https://www.tum.de',
        type: String
    })
    @IsUrl()
    @IsOptional()
    @Column({
        nullable: true
    })
    url: string;

    @ApiPropertyOptional({
        type: File,
        description: 'Aligned file for source.',
    })
    @ManyToOne(type => File)
    @JoinColumn()
    file: number;

    @ManyToOne(type => Case, caseEntity => caseEntity.sources, { onDelete: 'CASCADE' })
    case: Case;
}