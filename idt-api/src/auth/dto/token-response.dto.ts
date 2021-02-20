import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class TokenResponseDto {
    @ApiProperty({
        example: '3600',
        description: 'Duration for which token is valid.',
    })
    @IsNotEmpty()
    @IsNumber()
    // tslint:disable-next-line:variable-name
    expires_in: number;

    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiJ9.eyJpZ...',
        description: 'JWT token, containing User.',
    })
    @IsNotEmpty()
    @IsNumber()
    // tslint:disable-next-line:variable-name
    access_token: string;

    @ApiProperty({
        example: '1',
        description: 'UserId of current user.',
    })
    @IsNotEmpty()
    @IsNumber()
    // tslint:disable-next-line:variable-name
    user_id: number;

    @ApiProperty({
        example: '200',
        description: 'HTTP Status Code.',
    })
    @IsNotEmpty()
    @IsNumber()
    status: number;
}
