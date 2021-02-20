import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsUrl } from 'class-validator';
import { CaseTypeEnum } from '../model/case-type.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCaseDto {
    @ApiProperty({
        example: 'Digitalisierungstrategie',
        type: String,
        description: 'A title for the case.',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: 'Lorem Ipsum...',
        type: String,
        description: 'A description.',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        example: 1,
        description: 'Specify type of case.',
        enum: CaseTypeEnum,
    })
    @IsNumber()
    @IsNotEmpty()
    caseType: number;

    @ApiPropertyOptional({
        example: false,
        type: String,
        description: 'Set case to be featured.',
    })
    @IsOptional()
    @IsBoolean()
    featured: boolean;

    @ApiPropertyOptional({
        example: 'https://www.tum.de',
        description: 'Optinal field. Case url for further information as UrlString.',
        type: String,
    })
    @IsOptional()
    @IsUrl()
    url: string;

    @ApiProperty({
        example: 1,
        type: Number,
        description: 'Id of aligned company.',
    })
    @IsNumber()
    @IsNotEmpty()
    company: number;
}
