import { ApiProperty } from '@nestjs/swagger';
import { Technology } from "../model/technology.entity";

export class GetTechnologyCountDto extends Technology {
    @ApiProperty({
        example: 5,
        description: 'Technology count.',
    })
    count: number;
}