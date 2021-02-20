import { Controller, UseInterceptors, Post, UseGuards, Body, Req, Get, Param, Patch, Delete, ClassSerializerInterceptor, ForbiddenException, UploadedFile, Res, InternalServerErrorException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes, ApiExcludeEndpoint, ApiTags, ApiBody } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { Company } from './model/company.entity';
import { BvDCompany } from './model/BvDCompany';
import { AuthGuard } from '@nestjs/passport';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from './../user/model/user.entity';
import { AuthService } from './../auth/auth.service';
import { RoleEnum } from './../user/model/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { DiskFile } from 'multer';
import { FileService } from './../file/file.service';
import { Crud, CrudController, Override, ParsedRequest, CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { FileUploadDto } from './../file/model/file-upload.dto';

// @ts-ignore left join only
// tslint:disable-next-line:only-arrow-functions
TypeOrmCrudService.prototype.getJoinType = function () {
  // tslint:disable-next-line:no-console
  return 'leftJoin';
};

// @UseInterceptors(CacheInterceptor)
@Crud({
  model: {
    type: Company,
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
      cases: {
        exclude: ['createdBy', 'modifiedBy']
      },
    }
  }
})
@Controller('companies')
export class CompanyController implements CrudController<Company> {
  constructor(
    public service: CompanyService,
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) { }

  get base(): CrudController<Company> {
    return this;
  }

  //GET /companies/FindAddableByName
  //Finds companies matching a specific name from the idtCompanySource
  @Get('findAddableByName/:name')
  findAddableByName(@Param('name') name: string) {
    return this.service.findAddableCompanyByName(name);
  }

  //GET /companies/FindAddableByURL
  //Finds companies matching a specific url from the idtCompanySource
  @Get('findAddableByURL/:url')
  findAddableByURL(@Param('url') url: string) {
    return this.service.findAddableCompanyByURL(url);
  }

  @Get('performCompanyEnrichment')
  @ApiBearerAuth()
  @ApiTags('companies')
  @ApiOperation({ summary: 'Enrich existing companies with data from companySource' })
  @UseGuards(AuthGuard('bearer'))
  performCompanyEnrichment(@Req() req) {
    return new Promise<any>((resolve, reject) => {
      if (req.user.role === RoleEnum.Admin) {
        this.service.replaceAllCompanies(req.user);
        resolve();
      } else {
        reject(new ForbiddenException('Only to be used by admin,'));
      }
    });
  }

  // POST /companies
  // Add new Company
  @Post('')
  @ApiBearerAuth()
  @ApiTags('companies')
  @ApiOperation({ summary: 'Create new Company.' })
  @ApiResponse({
    status: 201,
    description: 'The company has been successfully created.',
    type: Company
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 400,
    description: 'A Company with the same name already exists and cannot created a second time.`.',
  })
  @UseGuards(AuthGuard('bearer'))
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() createCompanyDto: CreateCompanyDto, @Req() req): Promise<Company> {
    return new Promise<Company>((resolve) => {
      resolve(this.service.create(createCompanyDto, req.user));
    });
  }

  // POST /company/:id/logo
  // Add or change company logo
  @Post(':id/logo')
  @ApiBearerAuth()
  @ApiTags('companies/logo')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ required: true, description: 'Company logo.', type: FileUploadDto  })
  @ApiOperation({ summary: 'Add or change company logo.' })
  @ApiResponse({
    status: 201,
    description: 'The company logo has been successfully added or changed.',
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
      this.fileService.writeFile(file, req.user).then((fileInfo) => {
        this.service.update(id, { logo: fileInfo.id }, req.user).then((_) => {
          resolve(true);
        }, (err) => {
          reject(err);
        });
      }, (err) => {
        reject(err);
      });
    });
  }

  // GET /company/:id/logo
  // Get current company logo
  @Get(':id/logo')
  @ApiTags('companies/logo')
  @ApiOperation({ summary: 'Get company logo.' })
  @ApiResponse({
    status: 200,
    description: 'The company logo has been successfully queried.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found.',
  })
  async getImage(
    @Param('id') id: string,
    @Res() res
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.service.getCompanyLogoById(id).then((d) => {
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

  // GET /companies
  // List and query Companies
  @Override()
  @ApiBearerAuth()
  @ApiTags('companies')
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
      req.options.query.filter = [
        {
          field: 'disabled',
          operator: '$eq',
          value: false
        }
      ];*/

      return this.base.getManyBase(req);
    // }
  }

  // GET /companies
  // Get and query Company
  @Override()
  @ApiBearerAuth()
  @ApiTags('companies')
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

  // PATCH /companies/:id
  // Update Company using Partials
  @Patch(':id')
  @ApiBearerAuth()
  @ApiTags('companies')
  @ApiOperation({ summary: 'Patch specified Company.' })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully patched.',
    type: Company,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Most likly because a company with the same name already exists .',
  })
  @UseGuards(AuthGuard('bearer'))
  @UseInterceptors(ClassSerializerInterceptor)
  updateById(
    @Param('id') id: string,
    @Body() partial: UpdateCompanyDto,
    @Req() req
  ): Promise<Company> {
    return new Promise<Company>((resolve) => {
      resolve(this.service.update(id, partial, req.user));
    });
  }

  // DELETE /companies/:id
  // Soft delete company by disabling it
  @Delete(':id')
  @ApiBearerAuth()
  @ApiTags('companies')
  @ApiOperation({
    summary: 'Delete specified Company.',
    description: 'Only admins are allowed to delete companies.'
  })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully deleted.',
  })
  @ApiResponse({
    status: 400,
    description: 'A Company with the same name already exists and cannot created a second time.`.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.'
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
  deleteById(
    @Param('id') id: string,
    @Req() req
  ): Promise<Company> {
    return new Promise<any>((resolve, reject) => {
      const user = req.user;
      if (user.role === RoleEnum.Admin) {
        this.service.remove(id, req.user)
        resolve();
      } else {
        reject(new ForbiddenException('Only administrators are allowed to remove a case.'))
      }
    });
  }

  // CLEAN companies, for integration tests only
  // GET /testing/clean
  // Clean Companies
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

  private async getUserFromHeader(authHeader: string): Promise<User> {
    return await new Promise<User>((resolve) => {
      const token = authHeader.split(' ')[1];
      resolve(this.authService.validateToken(token));
    });
  }
}