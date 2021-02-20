// tslint:disable-next-line:max-line-length
import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, UnauthorizedException, CacheInterceptor, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UserService } from './user.service';
import { DeleteResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { RoleEnum } from './model/role.enum';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Company } from '../company/model/company.entity';
import { Case } from '../case/model/case.entity';

// @ApiTags('users')
// @ApiBearerAuth()
@UseInterceptors(CacheInterceptor)
@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) { }

    // // POST user
    // @Post()
    // @UseGuards(AuthGuard('bearer'))
    // create(@Body() user: User, @Req() req): Promise<User> {
    //     return new Promise<User>((resolve, reject) => {
    //         if (req.user.role === RoleEnum.Admin) {
    //             resolve(this.userService.create(user));
    //         } else {
    //             reject(new UnauthorizedException('You need Admin priviledges to post new users.'));
    //         }
    //     });
    // }

    // GET users
    // @Get()
    // @UseGuards(AuthGuard('bearer'))
    // getAll(@Req() req): Promise<User[]> {
    //     return new Promise<User[]>((resolve, reject) => {
    //         if (req.user.role === RoleEnum.Admin) {
    //             resolve(this.userService.getAll({}));
    //         } else {
    //             resolve(this.userService.getAll({ id: req.user.id }));
    //         }
    //     });
    // }

    // // GET user with :id
    // @Get(':id')
    // @UseGuards(AuthGuard('bearer'))
    // @ApiParam({
    //     name: 'id',
    //     description: 'userId',
    //     type: 'number',
    //     required: true,
    // })
    // get(@Param('id') id, @Req() req): Promise<User> {
    //     return new Promise<User>((resolve, reject) => {
    //         if (req.user.role === RoleEnum.Admin) {
    //             resolve(this.userService.get(id));
    //         } else {
    //             if (parseInt(req.user.id, 10) === parseInt(id, 10)) {
    //                 resolve(this.userService.get(id));
    //             } else {
    //                 reject(new UnauthorizedException('You need Admin priviledges to access this ressource.'));
    //             }
    //         }
    //     });
    // }

    // // PUT user with id
    // @Put(':id')
    // @UseGuards(AuthGuard('bearer'))
    // @ApiParam({
    //     name: 'id',
    //     description: 'userId',
    //     type: 'number',
    //     required: true,
    // })
    // update(@Param('id') id, @Body() user, @Req() req): Promise<User> {
    //     user.id = parseInt(id, 10);

    //     return new Promise<User>((resolve, reject) => {
    //         if (req.user.role === RoleEnum.Admin) {
    //             resolve(this.userService.update(user));
    //         } else {
    //             if (req.user.id === id) {
    //                 resolve(this.userService.update(user));
    //             } else {
    //                 reject(new UnauthorizedException('You need Admin priviledges to access this ressource.'));
    //             }
    //         }
    //     });
    // }

    // // DELETE user with id
    // @Delete(':id')
    // @UseGuards(AuthGuard('bearer'))
    // @ApiParam({
    //     name: 'id',
    //     description: 'userId',
    //     type: 'number',
    //     required: true,
    // })
    // delete(@Param('id') id, @Req() req): Promise<DeleteResult> {
    //     return new Promise<DeleteResult>((resolve, reject) => {
    //         if (req.user.role === RoleEnum.Admin) {
    //             resolve(this.userService.remove(id));
    //         } else {
    //             if (req.user.id === id) {
    //                 resolve(this.userService.remove(id));
    //             } else {
    //                 reject(new UnauthorizedException('You need Admin priviledges to access this ressource.'));
    //             }
    //         }
    //     });
    // }


    // GET /users/:id/companies
    // Get all companies a user is following
    @Get(':userId/companies')
    @ApiTags('users/companies')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all companies a user is following.', description: 'The companies the user with the specified id is following as an array.' })
    @ApiResponse({
        status: 201,
        description: 'The companies have been successfully queried.',
        type: Company
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @UseGuards(AuthGuard('bearer'))
    @UseInterceptors(ClassSerializerInterceptor)
    async getFollowingCompanies(
        @Param('userId') userId: number
    ): Promise<number[]> {
        return new Promise<number[]>((resolve) => {
            resolve(this.userService.getFollowingCompanies(userId));
        });
    }

    // POST /users/:id/companies
    // Follow a new company/ new companies
    @Post(':userId/companies/:compId')
    @ApiTags('users/companies')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Follow a new company/ new companies.', description: 'The company/companies is/are added to the array of companies the user is following.' })
    @ApiResponse({
        status: 201,
        description: 'The company has been successfully added.',
        type: Company
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @UseGuards(AuthGuard('bearer'))
    @UseInterceptors(ClassSerializerInterceptor)
    addCompany(
        @Param('userId') userId: number,
        @Param('compId') compId: number,
    ): Promise<number[]> {
        return new Promise<number[]>((resolve) => {
            resolve(this.userService.addCompany(userId, compId));
        });
    }


    // DELETE /users/:id/companies
    // Delete company from user
    @Delete(':userId/companies/:compId')
    @ApiBearerAuth()
    @ApiTags('users/companies')
    @ApiOperation({ summary: 'Remove company from users following companies.' })
    @ApiResponse({
        status: 200,
        description: 'The company has been successfully removed.',
        type: ApiResponse
    })
    @ApiResponse({
        status: 400,
        description: 'CompanyId was not found on user.',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @UseGuards(AuthGuard('bearer'))
    @UseInterceptors(ClassSerializerInterceptor)
    removeTechnology(
        @Param('userId') userId: number,
        @Param('compId') compId: string
    ): Promise<number[]> {
        return new Promise<number[]>((resolve) => {
            resolve(this.userService.removeCompany(userId, parseInt(compId)));
        });
    }


    // GET /users/:id/feed
    // Get the users personal feed
    @Get(':userId/feed')
    @ApiTags('users/feed')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get the users feed.', description: 'The cases of all companies the user is following as an array.' })
    @ApiResponse({
        status: 201,
        description: 'The cases have been successfully queried.',
        type: Case
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @UseGuards(AuthGuard('bearer'))
    @UseInterceptors(ClassSerializerInterceptor)
    async getPersonalFeed(
        @Param('userId') userId: number
    ): Promise<Case[]> {
        return new Promise<Case[]>((resolve) => {
            resolve(this.userService.getPersonalFeed(userId));
        });
    }

    // GET /users/:id/feed/suggest/company
    // Get the users suggested companies
    @Get(':userId/feed/suggest/company')
    @ApiTags('users/feed/suggest/company')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a company (companies) suggested for the user.', description: 'Returns an array of companies of the same industries the users following companies are in.' })
    @ApiResponse({
        status: 201,
        description: 'The companies have been successfully queried.',
        type: Company
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @UseGuards(AuthGuard('bearer'))
    @UseInterceptors(ClassSerializerInterceptor)
    async getSuggestedCompanies(
        @Param('userId') userId: number
    ): Promise<Company[]> {
        return new Promise<Company[]>((resolve) => {
            resolve(this.userService.getSuggestedCompanies(userId));
        });
    }

    // GET /users/:id/feed/suggest/case
    // Get the users suggested cases
    @Get(':userId/feed/suggest/case')
    @ApiTags('users/feed/suggest/case')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a case (cases) suggested for the user.', description: 'Returns an array of cases of the same industries the users following companies are in.' })
    @ApiResponse({
        status: 201,
        description: 'The cases have been successfully queried.',
        type: Case
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @UseGuards(AuthGuard('bearer'))
    @UseInterceptors(ClassSerializerInterceptor)
    async getSuggestedCases(
        @Param('userId') userId: number
    ): Promise<Case[]> {
        return new Promise<Case[]>((resolve) => {
            resolve(this.userService.getSuggestedCases(userId));
        });
    }
}
