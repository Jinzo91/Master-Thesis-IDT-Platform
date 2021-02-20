import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Company } from './../../company/model/company.entity';
import { User } from './../../user/model/user.entity';
import { Comment } from './../model/comment.entity';
import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsUrl, IsOptional } from 'class-validator';
import { File } from './../../file/model/file.entity';
import { CaseTypeEnum } from './case-type.enum';
import { Technology } from './technology.entity';
import { Source } from './source.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Case {
    @ApiProperty({
        example: '4',
        description: 'Id of case.',
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example: 'Digitalisierungstrategie',
        type: String,
        description: 'A title for the case.',
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

    @ApiProperty({
        example: 1,
        description: 'Specify type of case.',
        enum: CaseTypeEnum,
    })
    @IsNumber()
    @IsNotEmpty()
    @Column({
        enum: CaseTypeEnum,
        default: 4
    })
    caseType: number;

    @ApiProperty({
        description: 'Aligned technologies for case.',
        type: Technology,
        isArray: true
    })
    @ManyToMany(type => Technology)
    @JoinTable()
    technologies: Technology[];

    @ApiPropertyOptional({
        example: false,
        type: Boolean,
        description: 'Set case to be featured.',
    })
    @IsBoolean()
    @Column({
        default: 0,
    })
    featured: boolean;

    @ApiProperty({
        example: true,
        type: Boolean,
        description: 'Indicates if case has sources.',
    })
    @IsBoolean()
    @Column({
        default: 0,
    })
    hasSources: boolean;

    @ApiPropertyOptional({
        example: 'https://www.tum.de',
        description: 'Optinal field. Case url for further information as UrlString.',
        type: String,
    })
    @Column({
        nullable: true
    })
    @IsOptional()
    @IsUrl()
    url: string;

    // @ApiProperty({
    //     description: 'Image as file object.',
    //     type: File,
    // })
    @ManyToOne(type => File)
    @JoinColumn()
    image: number;

    // @ApiPropertyOptional({
    //     description: 'Available sources for this case.',
    //     type: Source,
    //     isArray: true
    // })
    @OneToMany(type => Source, source => source.case)
    sources: Source[];

    @ApiProperty({
        type: Company,
        // description: 'Id of aligned company.',
    })
    @IsNumber()
    @IsNotEmpty()
    @ManyToOne(type => Company, { onDelete: 'CASCADE' })
    @JoinColumn()
    company: number;

    @ApiProperty({
        example: '2019-07-22T13:54:14.466Z',
        description: 'DateString with CreationTime.',
    })
    @Column()
    createdAt: string;

    @ApiProperty({
        description: 'User who created this case.',
        type: User,
    })
    @ManyToOne(type => User)
    @JoinColumn()
    createdBy: number;

    @ApiPropertyOptional({
        example: '2019-07-22T13:54:14.466Z',
        description: 'DateString with ModificationTime.',
    })
    @Column({
        nullable: true,
    })
    modifiedAt: string;

    @ApiPropertyOptional({
        description: 'User who updated this case.',
        type: User,
    })
    @ManyToOne(type => User)
    @JoinColumn()
    modifiedBy: number;

    @OneToMany(type => Comment, comment => comment.case)
    comments: Comment[];

    @BeforeInsert()
    async setDate() {
        this.createdAt = new Date().toISOString();
    }

    @BeforeUpdate()
    async setModifiedDate() {
        this.modifiedAt = new Date().toISOString();
    }
}
