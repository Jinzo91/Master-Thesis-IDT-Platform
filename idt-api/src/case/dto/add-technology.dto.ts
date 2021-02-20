import { IsNumber, IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class AddTechnologyDto {
    @ApiPropertyOptional({
        example: 1,
        type: Number,
        description: 'Id for technology.',
    })
    @IsNumber()
    @IsOptional()
    id: number;

    @ApiPropertyOptional({
        example: 'Lorem Ipsum...',
        type: String,
        description: 'A name.',
    })
    @IsString()
    @IsOptional()
    name: string;
}