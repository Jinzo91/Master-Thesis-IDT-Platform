import {
    Controller,
    UseInterceptors,
    CacheInterceptor,
    Get,
    Query,
    BadRequestException,
    UseGuards,
    Req
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { LogService } from './../log/log.service';
import { DateQuery } from './query/date.query';
import * as moment from 'moment';
import { ContributorDto } from './../log/dto/contributor.dto';
import { AuthGuard } from '@nestjs/passport';
import { CompanyService } from './../company/company.service';
import { GetCompanyCountDto } from './../company/dto/get-company-count.dto';
import { GetTechnologyCountDto } from './../case/dto/get-technology-count.dto';
import { CaseService } from './../case/services/case.service';
import { GetCaseTypeCount } from './../case/dto/get-case-type-count.dto';

@ApiTags('reporting')
@UseInterceptors(CacheInterceptor)
@Controller('reporting')
export class ReportingController {

    constructor(
        private readonly logService: LogService,
        private readonly companyService: CompanyService,
        private readonly caseService: CaseService
    ) { }

    @Get('contributors/user')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'List case count of the logged-in user.' })
    @ApiResponse({
        status: 200,
        description: 'The contributor has been successfully queried.',
        type: Number,
        isArray: true
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request.',
    })
    @UseGuards(AuthGuard('bearer'))
    getOneContributor(@Req() req): Promise<any[]> {
        return new Promise<any[]>((resolve) => {
            resolve(this.caseService.getUserCaseCount(req.user.id));
        });
    }

    @Get('contributors/bot')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'List case count for the bot.' })
    @ApiResponse({
        status: 200,
        description: 'The contributor has been successfully queried.',
        type: Number,
        isArray: true
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request.',
    })
    @UseGuards(AuthGuard('bearer'))
    getOneContributorBot(): Promise<any[]> {
        return new Promise<any[]>((resolve) => {
            resolve(this.caseService.getUserCaseCount(14125));
        });
    }

    @Get('contributors')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'List all Contributors in given timeframe.' })
    @ApiResponse({
        status: 200,
        description: 'The contributors have been successfully queried.',
        type: ContributorDto,
        isArray: true
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request. Most likely because a given timestamp is not a date string.',
    })
    @ApiQuery({
        name: 'start',
        description: 'Query a specific timeframe, start property.',
        type: Date,
        required: false,
    })
    @ApiQuery({
        name: 'end',
        description: 'Query a specific timeframe, end property.',
        type: Date,
        required: false,
    })
    @UseGuards(AuthGuard('bearer'))
    getContributors(@Query() query: DateQuery): Promise<ContributorDto[]> {
        return new Promise<ContributorDto[]>((resolve, reject) => {
            if (query.start && query.end) {
                if (moment(query.start).isValid() && moment(query.end).isValid()) {
                    query.start = moment(query.start).toISOString();
                    query.end = moment(query.end).toISOString();

                    resolve(this.logService.getContributors(query));
                } else {
                    reject(new BadRequestException('Please provide valid date strings.'))
                }
            } else {
                query.start = moment().startOf('month').toISOString();
                query.end = moment().endOf('month').toISOString();

                resolve(this.logService.getContributors(query));
            }
        });
    }

    @Get('top/companies')
    @ApiTags('reporting')
    @ApiOperation({ summary: 'Retrieves top 10 companies with most use cases.' })
    @ApiResponse({
        status: 200,
        description: 'Companies have been successfully queried.',
        type: GetCompanyCountDto,
        isArray: true
    })
    async getTopCompanies(): Promise<GetCompanyCountDto[]> {
        return await this.companyService.getTopCompanies(10);
    }

    @Get('top/technologies')
    @ApiTags('reporting')
    @ApiOperation({ summary: 'Retrieves top 10 technologies used the most in cases.' })
    @ApiResponse({
        status: 200,
        description: 'Techs have been successfully queried.',
        type: GetTechnologyCountDto,
        isArray: true
    })
    async getTopTech(): Promise<GetTechnologyCountDto[]> {
        return await this.caseService.getTopTechs(10);
    }

    @Get('top/casetypes')
    @ApiTags('reporting')
    @ApiOperation({ summary: 'Retrieves count of case types in the system.' })
    @ApiResponse({
        status: 200,
        description: 'Techs have been successfully queried.',
        type: GetCaseTypeCount,
        isArray: true
    })
    async getCaseTypeCounts(): Promise<GetCaseTypeCount[]> {
        return await this.caseService.getCaseTypeCounts();
    }

    @Get('progress/cases')
    @ApiTags('reporting')
    @ApiOperation({ summary: 'Retrieves the process of the number of cases per month for the last 6 months.' })
    @ApiResponse({
        status: 200,
        description: 'Cases process has been successfully queried.',
        type: GetCaseTypeCount,
        isArray: true
    })
    async getProgressCases(): Promise<GetCaseTypeCount[]> {
        return await this.caseService.getProgressCases();
    }

    @Get('progress/companies')
    @ApiTags('reporting')
    @ApiOperation({ summary: 'Retrieves the process of the number of companies per month for the last 6 months.' })
    @ApiResponse({
        status: 200,
        description: 'Companies process has been successfully queried.',
        type: GetCompanyCountDto,
        isArray: true
    })
    async getProgressCompanies(): Promise<GetCompanyCountDto[]> {
        return await this.companyService.getProgressCompanies();
    }

    @Get('newest/companies')
    @ApiTags('reporting')
    @ApiOperation({ summary: 'Retrieves the 3 newest companies.' })
    @ApiResponse({
        status: 200,
        description: 'Newest companies have been successfully queried.',
        type: GetCompanyCountDto,
        isArray: true
    })
    async getNewestCompanies(): Promise<GetCompanyCountDto[]> {
        return await this.companyService.getNewestCompanies();
    }

    @Get('today/cases')
    @ApiTags('reporting')
    @ApiOperation({ summary: 'Retrieves the number of cases created today.' })
    @ApiResponse({
        status: 200,
        description: 'Todays case count has been successfully queried.',
        type: Number,
        isArray: true
    })
    async getTodaysCaseCount(): Promise<number> {
        return await this.caseService.getTodaysCaseCount();
    }

    @Get('today/companies')
    @ApiTags('reporting')
    @ApiOperation({ summary: 'Retrieves the number of companies created today.' })
    @ApiResponse({
        status: 200,
        description: 'Todays company count has been successfully queried.',
        type: Number,
        isArray: true
    })
    async getTodaysCompanyCount(): Promise<number> {
        return await this.companyService.getTodaysCompanyCount();
    }

    @Get('trending/technologies')
    @ApiTags('reporting')
    @ApiOperation({ summary: 'Retrieves the 3 technologies which occured in the most cases last week.' })
    @ApiResponse({
        status: 200,
        description: 'Trending technologies have been successfully queried.',
        type: GetTechnologyCountDto,
        isArray: true
    })
    async getTrendingTechnologies(): Promise<GetTechnologyCountDto[]> {
        return await this.caseService.getTrendingTechnologies();
    }
}
