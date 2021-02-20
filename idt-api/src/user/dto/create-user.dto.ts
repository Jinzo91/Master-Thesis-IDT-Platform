import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { RoleEnum } from '../model/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        example: 'firstname.lastname@tum.de',
        description: 'An email address used for invitation mail and as login name.',
    })
    @IsEmail()
    @IsNotEmpty()
    mail: string;

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
        example: 'User',
        description: 'Role of user.',
        enum: RoleEnum,
    })
    @IsEnum(RoleEnum)
    role: number;

    @ApiProperty({
        example: '12345',
        description: 'A secure password set by the user to access the application.',
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
