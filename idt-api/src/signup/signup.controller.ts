import { Controller, Post, Body, Req, UseGuards, UnauthorizedException, Get, Param, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiExcludeEndpoint, ApiTags, ApiParam } from '@nestjs/swagger';
import { SignUpService } from './signup.service';
import { Invite } from './model/invite.entity';
import { AuthGuard } from '@nestjs/passport';
import { RoleEnum } from './../user/model/role.enum';
import { CreateInviteDto } from './dto/create-invite.dto';
import { GetInviteDto } from './dto/get-invite.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { UserService } from './../user/user.service';
import { CreateUserDto } from './../user/dto/create-user.dto';
import { GetUserDto } from './../user/dto/get-user.dto';
import { DeleteResult } from 'typeorm';

@ApiTags('signup')
@Controller('signup')
export class SignUpController {

    constructor(
        private readonly signUpService: SignUpService,
        private readonly userService: UserService,
    ) { }

    // POST /signup/invite
    // Invite an user to the application.
    @Post('/invite')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Invite an user to the application.' })
    @ApiResponse({
        status: 201,
        description: 'The invitation has been successfully sent.',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden.',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Error. Most possibly the current call tries to create a duplicate invitation.',
    })
    @UseGuards(AuthGuard('bearer'))
    invite(@Body() invite: CreateInviteDto, @Req() req): Promise<CreateInviteDto> {
        return new Promise<CreateInviteDto>((resolve, reject) => {
            if (req.user.role === RoleEnum.Admin) {
                resolve(this.signUpService.create(invite));
            } else {
                reject(new ForbiddenException('You need Admin priviledges to invite new users.'));
            }
        });
    }

    // POST /signup/invite/:hash
    // Invite an user to the application.
    @Post('/invite/:hash')
    @ApiParam({
        name: 'hash',
        description: 'Hash that identifies invitation.',
        type: 'string',
        required: true,
    })
    @ApiOperation({ summary: 'Accept invite to the application & set password as user.' })
    @ApiResponse({
        status: 201,
        description: 'The invitation has been successfully accepted.',
        type: GetUserDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Password fields are not matching!',
    })
    acceptInvite(
        @Param('hash') hash: string,
        @Body() acceptInviteDto: AcceptInviteDto,
        @Req() req,
    ): Promise<GetUserDto> {
        return new Promise<GetUserDto>((resolve, reject) => {
            // Step 1: Get Invite by hash given by query param
            this.signUpService.getInviteByHash(hash).then((i) => {

                // Step 2: Create CreateUserDto with GetInviteDto and AcceptInviteDto
                const createUserDto: CreateUserDto = {
                    firstName: acceptInviteDto.firstName,
                    lastName: acceptInviteDto.lastName,
                    mail: i.mail,
                    role: RoleEnum.User,
                    password: acceptInviteDto.password,
                };

                // Step 3: Create real User with CreateUserDto
                this.userService.create(createUserDto).then((u) => {

                    // Step 4: Remove used Invite from DB
                    this.signUpService.removeInviteByHash(i.hash).then((r) => {
                        resolve(u);
                    }, (err) => {
                        reject(err);
                    });
                }, (err) => {
                    reject(err);
                });
            }, (err) => {
                reject(err);
            });
        });
    }

    // GET /signup/invite/:hash
    // Get invitation with hash.
    @Get('/invite/:hash')
    @ApiOperation({ summary: 'Get invitation with hash.' })
    @ApiParam({
        name: 'hash',
        description: 'Hash that identifies invitation.',
        type: 'string',
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: 'Found Invite.',
        type: GetInviteDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Not Found. No invitation found for given hash.',
    })
    getInvitation(@Param('hash') hash: string): Promise<GetInviteDto> {
        return new Promise<GetInviteDto>((resolve, reject) => {
            resolve(this.signUpService.getInviteByHash(hash));
        });
    }

    @ApiExcludeEndpoint()
    @Get('/invite/integrationtest/gethash')
    @UseGuards(AuthGuard('bearer'))
    getHashForTest(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            resolve(this.signUpService.getLastHash());
        });
    }

    @ApiExcludeEndpoint()
    @Get('/invite/integrationtest/removeuser/:userId')
    @UseGuards(AuthGuard('bearer'))
    cleanTest(@Param('userId') userId: string): Promise<DeleteResult> {
        return new Promise<DeleteResult>((resolve, reject) => {
            resolve(this.signUpService.cleanTest(userId));
        });
    }
}
