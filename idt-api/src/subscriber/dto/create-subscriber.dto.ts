import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateSubscriberDto {
    @ApiProperty({
        example: 'firstname.lastname@tum.de',
        description: 'An email address to subscribe.',
    })
    @IsEmail()
    @IsNotEmpty()
    mail: string;
}
