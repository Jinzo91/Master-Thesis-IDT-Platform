import { ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes, ApiExcludeEndpoint, ApiBody, ApiTags } from "@nestjs/swagger";
import { UseInterceptors, Controller, Post, UseGuards, ClassSerializerInterceptor, Body, Req, Param, Patch, UploadedFile, Get, Res, BadRequestException, InternalServerErrorException, ForbiddenException, Delete, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CreateSourceDto } from "../dto/create-source.dto";
import { SourceService } from "../services/source.service";
import { Source } from "../model/source.entity";
import { UpdateSourceDto } from "../dto/update-source.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { DiskFile } from 'multer';
import { FileService } from "./../../file/file.service";
import { FileUploadDto } from "./../../file/model/file-upload.dto";
import { RoleEnum } from "./../../user/model/role.enum";

@ApiTags('cases/sources')
// @UseInterceptors(CacheInterceptor)
@Controller('cases')
export class SourceController {

    constructor(
        private readonly fileService: FileService,
        private readonly sourceService: SourceService,
    ) { }

    // POST /cases/:caseId/sources
    // Add new source to case
    @Post(':caseId/sources')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add new source to case.' })
    @ApiResponse({
        status: 201,
        description: 'The source has been successfully created.',
        type: Source
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @UseGuards(AuthGuard('bearer'))
    @UseInterceptors(ClassSerializerInterceptor)
    create(
        @Param('caseId') caseId: string,
        @Body() createSourceDto: CreateSourceDto    ): Promise<Source> {
        return new Promise<Source>((resolve) => {
            resolve(this.sourceService.create(caseId, createSourceDto));
        });
    }

    // PATCH /cases/:caseId/sources/:sourceId
    // Update Source using Partials
    @Patch(':caseId/sources/:sourceId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Patch specified source for case.' })
    @ApiResponse({
        status: 200,
        description: 'The source has been successfully patched.',
        type: Source,
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
        @Param('caseId') caseId: string,
        @Param('sourceId') sourceId: string,
        @Body() partial: UpdateSourceDto
    ): Promise<Source> {
        return new Promise<Source>((resolve) => {
            resolve(this.sourceService.update(caseId, sourceId, partial));
        });
    }

    // DELETE cases/:caseId/sources/:sourceId
    // Delete source
    @Delete(':caseId/sources/:sourceId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Deletes source.' })
    @ApiResponse({
        status: 201,
        description: 'The source has been successfully deleted',
        type: Boolean
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @UseGuards(AuthGuard('bearer'))
    removeSource(
        @Param('caseId') caseId: string,
        @Param('sourceId') sourceId: string,
        @Req() req
        ): Promise<any> {
            return new Promise<any>((resolve, reject) => {
                this.sourceService.getSourceFileById(sourceId).then((d) => {
                    if (d.hasOwnProperty('fileId')) {
                        this.fileService.deleteFile(d.fileId).then((a) => {
                            this.sourceService.deleteSourceById(caseId, sourceId).then((d) => {
                                resolve(d);
                            }, (err) => {
                                reject(err);
                            });
                        }, (err) => {
                            reject(err);
                        })
                    } else {
                        this.sourceService.deleteSourceById(caseId, sourceId).then((d) => {
                            resolve(d);
                        }, (err) => {
                            reject(err);
                        });
                    }
                }, (err) => {
                    reject(err);
                });
            });
    }

    // POST cases/:caseId/sources/:sourceId/file
    // Add or change source file
    @Post(':caseId/sources/:sourceId/file')
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({ required: true, description: 'Source file.', type: FileUploadDto })
    @ApiOperation({ summary: 'Add or change source file.' })
    @ApiResponse({
        status: 201,
        description: 'The source file has been successfully added or changed.',
        type: Boolean
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @UseGuards(AuthGuard('bearer'))
    @UseInterceptors(FileInterceptor('file'))
    addFile(
        @Param('caseId') caseId: string,
        @Param('sourceId') sourceId: string,
        @UploadedFile() file: DiskFile,
        @Req() req
    ): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (file) {
                if ((file.mimetype as string).includes('pdf')) {
                    this.fileService.writeFile(file, req.user).then((fileInfo) => {
                        this.sourceService.update(caseId, sourceId, { file: fileInfo.id }).then((_) => {
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

    // GET cases/:caseId/sources/:sourceId/file
    // Get current source file
    @Get(':caseId/sources/:sourceId/file')
    @ApiOperation({ summary: 'Get source file.' })
    @ApiResponse({
        status: 200,
        description: 'The source file has been successfully queried.',
    })
    async getImage(
        @Param('sourceId') sourceId: string,
        @Res() res
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.sourceService.getSourceFileById(sourceId).then((d) => {
                this.fileService.readStream(d.fileId).then((a) => {
                    res.set('Content-Type', d.contentType);
                    a.pipe(res);
                }, (err) => {
                    reject(err);
                })
            }, (err) => {
                reject(err);
            });
        });
    }

    // GET cases/:caseId/sources
    // Get sources of case
    @Get(':caseId/sources')
    @ApiOperation({ summary: 'Get sources of a case.' })
    @ApiResponse({
        status: 200,
        description: 'The sources have been successfully queried.',
        type: Source,
        isArray: true
    })
    async getAllSourceForCase(
        @Param('caseId') caseId: string
    ): Promise<Source[]> {
        return new Promise<any>((resolve, reject) => {
            this.sourceService.getSourcesOfCase(caseId).then((ss) => {
                resolve(ss);
            }, (err) => {
                reject(err);
            });
        });
    }

    // CLEAN sources, for integration tests only
    // GET /testing/clean
    // Clean Sources
    @Get('sources/testing/clean')
    @UseGuards(AuthGuard('bearer'))
    @ApiExcludeEndpoint()
    clean(
        @Req() req,
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (req.user.role === RoleEnum.Admin) {
                resolve(this.sourceService.clean());
            } else {
                reject(new ForbiddenException('Only to be used by admin,'))
            }
        });
    }
}