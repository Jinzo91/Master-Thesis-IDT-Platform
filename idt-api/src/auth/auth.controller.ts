import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { CredentialsDto } from './dto/credentials.dto';
import { TokenResponseDto } from './dto/token-response.dto';

export enum AuthErrorType {
    UnknownUser = 'unknown_user',
    WrongPassword = 'wrong_password',
    InternalError = 'internal'
}

export class AuthError {
    @ApiProperty({
        description: 'Error type.',
        enum: AuthErrorType,
    })
    type: 'unknown_user' | 'wrong_password' | 'internal';

    @ApiProperty({
        description: 'Error message. Presentable to user.',
        type: String,
    })
    message: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ description: 'Login to the application with mail and password.' })
    @ApiResponse({
        status: 200,
        description: 'Gives back TokenResponseObject.',
        type: TokenResponseDto,
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden.',
        type: AuthError,
    })
    @HttpCode(200)
    async login(@Body() credentials: CredentialsDto): Promise<TokenResponseDto> {
        return this.authService.login(credentials);
    }
}
