import { IsString, IsOptional, IsBase64, IsNumber, IsUrl, IsEnum, IsByteLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IndustryEnum } from '../model/industry.enum';

export class UpdateCompanyDto {
    @ApiProperty({
        example: 'TU München',
        description: 'The official name of a company.',
    })
    @IsString()
    @IsOptional()
    name: string;

    @ApiPropertyOptional({
        example: 15000,
        description: 'Optinal field. Companys headcount as number.',
        type: Number,
    })
    @IsOptional()
    @IsNumber()
    headcount: number;
    
    @ApiPropertyOptional({
        example: 'https://www.tum.de',
        description: 'Optinal field. Companys website as UrlString.',
        type: String,
    })
    @IsOptional()
    @IsUrl()
    website: string;

    @ApiPropertyOptional({
        example: 1,
        enum: IndustryEnum,
        description: 'Industry the company belongs to.',
    })
    @IsEnum(IndustryEnum)
    @IsOptional()
    industry: number;

    @ApiPropertyOptional({
        example: 'Munich',
        description: 'Optinal field. Location of companys headoffice.',
        type: String,
    })
    @IsOptional()
    @IsString()
    headoffice: string;

    @ApiPropertyOptional({
        example: 'Most excellent university.',
        description: 'Optinal field. Company description.',
        type: String,
    })
    @IsOptional()
    @IsString()
    description: string;

    @ApiPropertyOptional({
        example: 3400000,
        description: 'Optinal field. Companys revenue as string.',
    })
    @IsOptional()
    @IsString()
    revenue: string;

    @ApiPropertyOptional({
        example: 'US9173926183',
        description: 'Optional field. Contains the idtCompanySource Id',
    })
    @IsOptional()
    @IsString()
    companySourceId: string;
}
