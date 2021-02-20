import { IsString, IsNotEmpty, IsUrl, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateSourceDto {
    @ApiProperty({
        example: 'Research Paper XY',
        type: String,
        description: 'A title for the source.',
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

    @ApiPropertyOptional({
        example: 'https://www.tum.de',
        type: String
    })
    @IsUrl()
    @IsOptional()
    url?: string;
}