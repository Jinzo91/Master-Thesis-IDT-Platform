import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CountsDto {
    @ApiProperty({
        example: 5,
        type: Number,
        description: 'The amount of enabled companies in the system.',
    })
    @IsNumber()
    @IsNotEmpty()
    companies: number;

    @ApiProperty({
        example: 5,
        type: Number,
        description: 'The amount of enabled cases in the system.',
    })
    @IsNumber()
    @IsNotEmpty()
    cases: number;

    @ApiProperty({
        example: 5,
        type: Number,
        description: 'The amount of files in the system.',
    })
    @IsNumber()
    @IsNotEmpty()
    files: number;
}
