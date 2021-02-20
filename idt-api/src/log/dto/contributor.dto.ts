import { GetUserDto } from "./../../user/dto/get-user.dto";
import { ApiProperty } from '@nestjs/swagger';

export class ContributorDto {
    @ApiProperty({
        description: 'Contributing user.',
        type: GetUserDto
    })
    user: GetUserDto;

    @ApiProperty({
        description: 'Contributed Resource.',
        type: String,
    })
    resource: string;

    @ApiProperty({
        description: 'Amount of contributions.',
        type: Number,
    })
    count: number;
}