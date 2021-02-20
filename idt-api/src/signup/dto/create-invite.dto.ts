import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateInviteDto {
    @ApiProperty({
        example: 'firstname.lastname@tum.de',
        description: 'An email address used for invitation mail and as login name.',
    })
    @IsEmail()
    @IsNotEmpty()
    mail: string;
}
