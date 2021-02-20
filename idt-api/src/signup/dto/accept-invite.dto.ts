import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AcceptInviteDto {
    @ApiProperty({
        example: 'Cayenne Tina',
        description: 'First and middle name of user.',
    })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty({
        example: 'Mustermann',
        description: 'Last name of user.',
    })
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty({
        example: '12345',
        description: 'A secure password set by the user to access the application.',
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
