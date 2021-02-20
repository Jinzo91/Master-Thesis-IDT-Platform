import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class GetInviteDto {
    @ApiProperty({
        example: 'firstname.lastname@tum.de',
        description: 'An email address used for invitation mail and as login name.',
    })
    @IsEmail()
    @IsNotEmpty()
    mail: string;

    @ApiProperty({
        example: '233d2d3f-cfd9-48be-aff1-03282a9be562',
        description: 'Hash used to identify an invitation.',
    })
    @IsString()
    @IsNotEmpty()
    hash: string;

    @ApiProperty({
        example: '2019-07-22T13:54:14.466Z',
        description: 'DateString with CreationTime.',
    })
    @IsDateString()
    @IsNotEmpty()
    dateCreated: string;
}
