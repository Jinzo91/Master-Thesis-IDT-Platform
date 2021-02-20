import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CredentialsDto {

    @ApiProperty({
        example: 'firstname.lastname@tum.de',
        description: 'An email address used for invitation mail and as login name.',
    })
    @IsEmail()
    @IsNotEmpty()
    mail: string;

    @ApiProperty({
        example: '12345',
        description: 'A secure password set by the user to access the application.',
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
