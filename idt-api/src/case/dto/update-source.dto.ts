import { IsString, IsNotEmpty, IsUrl, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateSourceDto {
    @ApiPropertyOptional({
        example: 'Research Paper XY',
        type: String,
        description: 'A title for the source.',
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
        example: 'https://www.tum.de',
        type: String
    })
    @IsUrl()
    @IsOptional()
    url?: string;
}