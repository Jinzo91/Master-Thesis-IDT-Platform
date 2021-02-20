import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsUrl } from 'class-validator';
import { CaseTypeEnum } from './../../case/model/case-type.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCaseDto {
    @ApiPropertyOptional({
        example: 'Digitalisierungstrategie',
        type: String,
        description: 'A title for the case.',
    })
    @IsString()
    @IsOptional()
    title: string;

    @ApiPropertyOptional({
        example: 'Lorem Ipsum...',
        type: String,
        description: 'A description.',
    })
    @IsString()
    @IsOptional()
    description: string;

    @ApiPropertyOptional({
        example: 1,
        description: 'Specify type of case.',
        enum: CaseTypeEnum,
    })
    @IsNumber()
    @IsOptional()
    caseType: number;

    @ApiPropertyOptional({
        example: false,
        type: String,
        description: 'Set case to be featured.',
    })
    @IsBoolean()
    @IsOptional()
    featured: boolean;

    @ApiPropertyOptional({
        example: 'https://www.tum.de',
        description: 'Optinal field. Case url for further information as UrlString.',
        type: String,
    })
    @IsOptional()
    @IsUrl()
    url: string;

    @ApiPropertyOptional({
        example: 1,
        type: Number,
        description: 'Id of aligned company.',
    })
    @IsNumber()
    @IsOptional()
    company: number;
}
