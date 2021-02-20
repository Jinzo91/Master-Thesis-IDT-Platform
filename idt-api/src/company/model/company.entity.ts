import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToOne, JoinColumn, Unique, BeforeUpdate, OneToMany } from 'typeorm';
import { IsString, IsNotEmpty, IsBoolean, IsDateString, IsNumber, IsBase64, IsOptional, IsUrl, IsEnum } from 'class-validator';
import { User } from './../../user/model/user.entity';
import { File } from './../../file/model/file.entity';
import { Case } from './../../case/model/case.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IndustryEnum } from './industry.enum';

@Entity()
@Unique(['name'])
export class Company {
    @ApiProperty({
        example: '4',
        description: 'Id of company.',
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example: 'TU München',
        description: 'The official name of a company.',
    })
    @Column()
    @IsString()
    @IsNotEmpty()
    name: string;

    // @ApiProperty({
    //     description: 'Image as file object.',
    //     type: File,
    // })
    @ManyToOne(type => File)
    @JoinColumn()
    logo: number;

    @ApiPropertyOptional({
        example: 15000,
        description: 'Optinal field. Companys headcount as number.',
        type: Number,
    })
    @Column({
        nullable: true
    })
    @IsOptional()
    @IsNumber()
    headcount: number;
    
    @ApiPropertyOptional({
        example: 'https://www.tum.de',
        description: 'Optinal field. Companys website as UrlString.',
        type: String,
    })
    @Column({
        nullable: true
    })
    @IsOptional()
    @IsUrl()
    website: string;

    @ApiProperty({
        example: 1,
        enum: IndustryEnum,
        description: 'Industry the company belongs to.',
    })
    @IsEnum(IndustryEnum)
    @IsOptional()
    @Column({
        nullable: true
    })
    industry: number;

    @ApiPropertyOptional({
        example: 'Munich',
        description: 'Optinal field. Location of companys headoffice.',
        type: String,
    })
    @Column({
        nullable: true,
        length: 1020,
    })
    @IsOptional()
    @IsString()
    headoffice: string;

    @ApiPropertyOptional({
        example: 'Most excellent university.',
        description: 'Optinal field. Company description.',
        type: String,
    })
    @Column({
        type: 'varchar',
        nullable: true,
        length: 6000,
    })
    @IsOptional()
    description: string;

    @ApiProperty({
        description: 'User who created this company.',
        type: User,
    })
    @IsNumber()
    @IsNotEmpty()
    @ManyToOne(type => User)
    @JoinColumn()
    createdBy: number;

    @ApiProperty({
        example: '2019-07-22T13:54:14.466Z',
        description: 'DateString with CreationTime.',
    })
    @Column()
    @IsDateString()
    @IsNotEmpty()
    createdAt: string;

    @ApiProperty({
        description: 'User who modified this company at last.',
        type: User,
    })
    @IsNumber()
    @IsNotEmpty()
    @ManyToOne(type => User)
    @JoinColumn()
    modifiedBy: number;

    @ApiProperty({
        example: '2019-07-22T13:54:14.466Z',
        description: 'DateString with ModificationTime.',
    })
    @Column({
        nullable: true,
    })
    @IsDateString()
    modifiedAt: string;

    @ApiPropertyOptional({
        description: 'Optinal field. Cases aligned with company.',
        type: Case,
        isArray: true
    })
    @OneToMany(type => Case, dbcase => dbcase.company)
    cases?: Case[];

    @ApiPropertyOptional({
        example: 1500000,
        description: 'Optional field. Contains the operational revenue as string',
    })
    @Column({
        nullable: true
    })
    @IsOptional()
    @IsString()
    revenue: string;

    @ApiPropertyOptional({
        example: 'US9173926183',
        description: 'Optional field. Contains the idtCompanySource Id',
    })
    @Column({
        nullable: true
    })
    @IsOptional()
    @IsString()
    companySourceId: string;

    @BeforeInsert()
    async setDate() {
        this.createdAt = new Date().toISOString();
    }

    @BeforeUpdate()
    async setModifiedDate() {
        this.modifiedAt = new Date().toISOString();
    }
}
