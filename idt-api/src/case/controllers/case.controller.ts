import {
    Controller, Post, Body, Req, Get, UseGuards, ClassSerializerInterceptor,
    UseInterceptors, Param, Patch, Delete, ForbiddenException, Res, UploadedFile, BadRequestException, InternalServerErrorException,
} from '@nestjs/common';
import { CaseService } from '../services/case.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes, ApiExcludeEndpoint, ApiTags, ApiBody } from '@nestjs/swagger';
import { CreateCaseDto } from '../dto/create-case.dto';
import { Case } from '../model/case.entity';
import { Comment }  from '../model/comment.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCaseDto } from '../dto/update-case.dto';
import { AuthService } from './../../auth/auth.service';
import { User } from './../../user/model/user.entity';
import { RoleEnum } from './../../user/model/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './../../file/file.service';
import { DiskFile } from 'multer';
import { AddTechnologyDto } from '../dto/add-technology.dto';
import { Technology } from '../model/technology.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Crud, CrudController, Override, ParsedRequest, CrudRequest } from '@nestjsx/crud';
import { FileUploadDto } from './../../file/model/file-upload.dto';
import { DeleteResult } from 'typeorm';

// @ts-ignore left join only
// tslint:disable-next-line:only-arrow-functions
TypeOrmCrudService.prototype.getJoinType = function () {
    // tslint:disable-next-line:no-console
    return 'leftJoin';
};

// @UseInterceptors(CacheInterceptor)
@Crud({
    model: {
        type: Case,
    },
    routes: {
        only: ['getManyBase', 'getOneBase']
    },
    query: {
      limit: 25,
      maxLimit: 100,
      cache: 2000,
      join: {
        createdBy: {
          eager: true,
          exclude: ['password']
        },
        modifiedBy: {
          eager: true,
          exclude: ['password']
        },
        company: {
          exclude: ['createdBy', 'modifiedBy'],
        },
        technologies: { },
        sources: { }
      }
    }
})
@Controller('cases')
export class CaseController implements CrudController<Case> {

    constructor(
        public service: CaseService,
        private readonly authService: AuthService,
        private readonly fileService: FileService
    ) { }

    get base(): CrudController<Case> {
        return this;
    }

    // POST /cases
    // Add new Case
    @Post('')
    @ApiBearerAuth()
    @ApiTags('cases')
    @ApiOperation({ summary: 'Create new Case.' })
    @ApiResponse({
        status: 201,
        description: 'The case has been successfully created.',
        type: Case
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @UseGuards(AuthGuard('bearer'))
    @UseInterceptors(ClassSerializerInterceptor)
    create(@Body() createCaseDto: CreateCaseDto, @Req() req): Promise<Case> {
        return new Promise<Case>((resolve) => {
            resolve(this.service.create(createCaseDto, req.user));
        });
    }

    // POST /cases/:id/image
    // Add or change case image
    @Post(':id/image')
    @ApiBearerAuth()
    @ApiTags('cases/image')
    @ApiConsumes('multipart/form-data')
    @ApiBody({ required: true, description: 'Case image.', type: FileUploadDto })
    @ApiOperation({ summary: 'Add or change case image.' })
    @ApiResponse({
        status: 201,
        description: 'The case image has been successfully added or changed.',
        type: Boolean
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @UseGuards(AuthGuard('bearer'))
    @UseInterceptors(FileInterceptor('file'))
    addImage(
        @Param('id') id: string,
        @UploadedFile() file: DiskFile,
        @Req() req
    ): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (file) {
                if ((file.mimetype as string).includes('image')) {
                    this.fileService.writeFile(file, req.user).then((fileInfo) => {
                        this.service.update(id, { image: fileInfo.id }, req.user).then((_) => {
                            resolve(true);
                        }, (err) => {
                            reject(err);
                        });
                    }, (err) => {
                        reject(err);
                    });
                } else {
                    reject(new BadRequestException('Wrong file format.'));
                }
            } else {
                reject(new InternalServerErrorException('Internal Error.'));
            }
        });
    }

    // GET /cases/:id/image
    // Get current case image
    @Get(':id/image')
    @ApiTags('cases/image')
    @ApiOperation({ summary: 'Get case image.' })
    @ApiResponse({
        status: 200,
        description: 'The case image has been successfully queried.',
    })
    async getImage(
        @Param('id') id: string,
        @Res() res
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.service.getCaseImageById(id).then((d) => {
                this.fileService.readStream(d.fileId).then((a) => {
                    res.set('Content-Type', d.contentType);

                    a.pipe(res);
                }, (err) => {
                    reject(err);
                })
            }, (_) => {
                // Fallback on random image
                let random = Math.round(Math.random() * 19) + 1;
                this.fileService.readStreamFromFS('./../../src/static/placeholder/cases/' + random + '.jpg').then((s) => {
                    res.set('Content-Type', 'image/jpg');

                    s.pipe(res);
                }, (err) => {
                    reject(err);
                });
            });
        });
    }

    // POST /cases/:id/technologies
    // Add technologies to case
    @Post(':id/technologies')
    @ApiBearerAuth()
    @ApiTags('cases/technologies')
    @ApiOperation({ summary: 'Add new technology to case.', description: 'If technology has an id, the existing technology is used. If not a new technology will be created.' })
    @ApiResponse({
        status: 201,
        description: 'The technology has been successfully created.',
        type: Technology
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @UseGuards(AuthGuard('bearer'))
    @UseInterceptors(ClassSerializerInterceptor)
    addTechnology(
        @Param('id') caseId: string,
        @Body() addTechDto: AddTechnologyDto,
        @Req() req
    ): Promise<Technology> {
        return new Promise<Technology>((resolve) => {
            resolve(this.service.addTechnology(caseId, addTechDto, req.user));
        });
    }

    // DELETE /cases/:id/technologies
    // Delete technologies from case
    @Delete(':caseId/technologies/:techId')
    @ApiBearerAuth()
    @ApiTags('cases/technologies')
    @ApiOperation({ summary: 'Delete technology from case.' })
    @ApiResponse({
        status: 200,
        description: 'The case has been successfully deleted.',
        type: Case
    })
    @ApiResponse({
        status: 400,
        description: 'TechId was not found on caseId.',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @UseGuards(AuthGuard('bearer'))
    @UseInterceptors(ClassSerializerInterceptor)
    removeTechnology(
        @Param('caseId') caseId: string,
        @Param('techId') techId: string,
        @Req() req
    ): Promise<Case> {
        return new Promise<Case>((resolve) => {
            resolve(this.service.removeTechnology(caseId, techId, req.user));
        });
    }

    // GET /cases/:id/technologies/suggestions
    // Get possible tags for case
    @Get(':caseId/technologies/suggestions')
    @ApiTags('cases/technologies')
    @ApiOperation({ summary: 'Get possible technologies for case.' })
    @ApiResponse({
        status: 200,
        description: 'The technology suggestions have been successfully queried.',
        type: Technology,
        isArray: true
    })
    @UseInterceptors(ClassSerializerInterceptor)
    getSuggestions(
        @Param('caseId') caseId: string
    ): Promise<Technology[]> {
        return new Promise<Technology[]>((resolve) => {
            resolve(this.service.suggestTechnology(caseId));
        });
    }

    // GET /cases/:id/technologies/suggestions
    // Get possible tags for case
    @Get('technologies')
    @ApiTags('cases/technologies')
    @ApiOperation({ summary: 'Get all technologies.' })
    @ApiResponse({
        status: 200,
        description: 'The technologies have been successfully queried.',
        type: Technology,
        isArray: true
    })
    @UseInterceptors(ClassSerializerInterceptor)
    getAllSuggestions(): Promise<Technology[]> {
        return new Promise<Technology[]>((resolve) => {
            resolve(this.service.suggestTechnology(null));
        });
    }

   // GET /cases
  // List and query Cases
  @Override()
  @ApiBearerAuth()
  @ApiTags('cases')
  getMany(
    @ParsedRequest() req: CrudRequest,
    @Req() reqOrg,
  ) {
    /*if (reqOrg.headers['authorization']) {
      return this.getUserFromHeader(reqOrg.headers['authorization']).then((user) => {
        if (user.role === RoleEnum.Admin) {

          return this.base.getManyBase(req);
        } else {
          req.options.query.filter = [
            {
              field: 'disabled',
              operator: '$eq',
              value: false
            }
          ];

          return this.base.getManyBase(req);
        }
      }, (err) => {
        return new InternalServerErrorException(err);
      })
    } else {
     /* req.options.query.filter = [
        {
          field: 'disabled',
          operator: '$eq',
          value: false
        }
      ];*/

      return this.base.getManyBase(req);
    // }
  }

  // GET /cases
  // Get and query Case
  @Override()
  @ApiBearerAuth()
  @ApiTags('cases')
  getOne(
    @ParsedRequest() req: CrudRequest,
    @Req() reqOrg,
  ) {
    if (reqOrg.headers['authorization']) {
      return this.getUserFromHeader(reqOrg.headers['authorization']).then((user) => {
        if (user.role === RoleEnum.Admin) {
          return this.base.getOneBase(req);
        } else {
          return this.base.getOneBase(req);
        }
      }, (err) => {

        return new InternalServerErrorException(err);
      })
    } else {
      return this.base.getOneBase(req);
    }
  }

    // PATCH /cases/:id
    // Update Case using Partials
    @Patch(':id')
    @ApiBearerAuth()
    @ApiTags('cases')
    @ApiOperation({ summary: 'Patch specified Case.' })
    @ApiResponse({
        status: 200,
        description: 'The case has been successfully patched.',
        type: Case,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request.',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @ApiResponse({
        status: 404,
        description: 'Not Found.',
    })
    @UseGuards(AuthGuard('bearer'))
    @UseInterceptors(ClassSerializerInterceptor)
    updateById(
        @Param('id') id: string,
        @Body() partial: UpdateCaseDto,
        @Req() req
    ): Promise<Case> {
        return new Promise<Case>((resolve) => {
            resolve(this.service.update(id, partial, req.user));
        });
    }

    // DELETE /cases/:id
    // Soft delete case by disabling it
    @Delete(':id')
    @ApiBearerAuth()
    @ApiTags('cases')
    @ApiOperation({
        summary: 'Delete specified Case.',
        description: 'Only admins are allowed to delete cases.'
    })
    @ApiResponse({
        status: 204,
        description: 'The case has been successfully deleted.',
        type: Case,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden. Only Administrators are allowed to access this endpoint.',
    })
    @ApiResponse({
        status: 404,
        description: 'Not Found.',
    })
    @UseGuards(AuthGuard('bearer'))
    @UseInterceptors(ClassSerializerInterceptor)
    deleteById(
        @Param('id') id: string,
        @Req() req
    ): Promise<Case> {
        return new Promise<Case>((resolve, reject) => {
            // console.log(req);
            const user = req.user;
            if (user.role === RoleEnum.Admin) {
                resolve(this.service.remove(id, req.user));
            } else {
                reject(new ForbiddenException('Only administrators are allowed to remove a case.'))
            }
        });
    }

    // CLEAN cases, for integration tests only
    // GET /testing/clean
    // Clean Cases
    @Get('testing/clean')
    @UseGuards(AuthGuard('bearer'))
    @ApiExcludeEndpoint()
    clean(
        @Req() req,
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (req.user.role === RoleEnum.Admin) {
                resolve(this.service.clean());
            } else {
                reject(new ForbiddenException('Only to be used by admin,'))
            }
        });
    }

    // CLEAN technologies, for integration tests only
    // GET /testing/clean
    // Clean Cases
    @Get('technologies/testing/clean')
    @UseGuards(AuthGuard('bearer'))
    @ApiExcludeEndpoint()
    cleanTech(
        @Req() req,
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (req.user.role === RoleEnum.Admin) {
                resolve(this.service.cleanTech());
            } else {
                reject(new ForbiddenException('Only to be used by admin,'))
            }
        });
    }


    // GET /cases/:id/comments
    // Get case comments
    @Get(':id/comments')
    @ApiTags('cases/comments')
    @ApiOperation({ summary: 'Get the cases comment(s).' })
    @ApiResponse({
        status: 201,
        description: 'The comment(s) have been successfully queried.',
        type: Case
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @UseInterceptors(ClassSerializerInterceptor)
    async getCaseComments(
        @Param('id') id: string
    ): Promise<Comment[]> {
        return new Promise<Comment[]>((resolve) => {
            resolve(this.service.getCaseComments(id));
        });
    }


    // POST /cases/:id/comments
    // Add new comment
    @Post(':id/comments')
    @ApiBearerAuth()
    @ApiTags('cases/comments')
    @ApiOperation({ summary: 'Create new comment.' })
    @ApiResponse({
        status: 201,
        description: 'The comment has been successfully created.',
        type: Case
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @UseGuards(AuthGuard('bearer'))
    @UseInterceptors(ClassSerializerInterceptor)
    async createCaseComment(
        @Param('id') id: string,
        @Body() body,
        @Req() req
    ): Promise<Comment> {
        return new Promise<Comment>((resolve) => {
            resolve(this.service.createCaseComment(id, body, req.user));
        });
    }

    // PATCH /cases/:id/comments/:commentId
    // Edit a comment
    @Patch(':id/comments/:commentId')
    @ApiBearerAuth()
    @ApiTags('cases/comments')
    @ApiOperation({ summary: 'Edit a comment.' })
    @ApiResponse({
        status: 201,
        description: 'The comment has been successfully edited.',
        type: Case
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @UseGuards(AuthGuard('bearer'))
    @UseInterceptors(ClassSerializerInterceptor)
    async editCaseComment(
        @Param('commentId') commentId: string,
        @Body() body,
        @Req() req
    ): Promise<Comment> {
        return new Promise<Comment>((resolve) => {
            resolve(this.service.editCaseComment(commentId, body, req.user));
        });
    }

    // DELETE /cases/:id/comments/:commentId
    // Delete a comment
    @Delete(':id/comments/:commentId')
    @ApiBearerAuth()
    @ApiTags('cases/comments')
    @ApiOperation({ summary: 'Delete a comment.' })
    @ApiResponse({
        status: 201,
        description: 'The comment has been successfully deleted.',
        type: Case
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @UseGuards(AuthGuard('bearer'))
    @UseInterceptors(ClassSerializerInterceptor)
    async deleteCaseComment(
        @Param('commentId') commentId: string,
        @Req() req
    ): Promise<DeleteResult> {
        return new Promise<DeleteResult>((resolve) => {
            resolve(this.service.deleteCaseComment(commentId, req.user));
        });
    }

    private async getUserFromHeader(authHeader: string): Promise<User> {
        return await new Promise<User>((resolve) => {
            const token = authHeader.split(' ')[1];
            resolve(this.authService.validateToken(token));
        });
    }
}
