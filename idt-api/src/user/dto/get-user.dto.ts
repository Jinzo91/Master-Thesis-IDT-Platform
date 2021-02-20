import { IsString, IsNotEmpty, IsEmail, IsEnum, IsNumber } from 'class-validator';
import { RoleEnum } from '../model/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from 'src/company/model/company.entity';

export class GetUserDto {
    @ApiProperty({
        example: '4',
        description: 'Id of user.',
    })
    @IsNotEmpty()
    @IsNumber()
    id: number;

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
        example: '[1, 2, 3, 4, 5]',
        description: 'Array of companies the user is following.'
    })
    followingCompanies: Company[];
}
