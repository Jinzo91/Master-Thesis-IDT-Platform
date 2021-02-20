import { Controller, Get, UseInterceptors, CacheInterceptor, ClassSerializerInterceptor } from '@nestjs/common';
import { LandingService } from './landing.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountsDto } from './dto/counts.dto';
import { CaseCountResponse } from './../case/response/case-count.response';

@ApiTags('landing')
@UseInterceptors(CacheInterceptor)
@Controller('landing')
export class LandingController {

    constructor(
        private landingService: LandingService,
    ) { }

    // GET /landing/counts
    @Get('/counts')
    @ApiOperation({ summary: 'Get counts of entities.', description: 'Retrieves count of cases and companies which were added to the system (alltime).' })
    @ApiResponse({
        status: 200,
        description: 'Counts have been successfully queried.',
        type: CountsDto,
    })
    @UseInterceptors(ClassSerializerInterceptor)
    getCount(): Promise<CountsDto> {
        return this.landingService.getCounts();
    }

    // GET /landing/counts
    @Get('/counts/weekly')
    @ApiOperation({ summary: 'Get weekly counts of entities.', description: 'Retrieves count of cases and companies which were added within the last 7 days (rolling last week).' })
    @ApiResponse({
        status: 200,
        description: 'Counts have been successfully queried.',
        type: CountsDto,
    })
    @UseInterceptors(ClassSerializerInterceptor)
    getWeeklyCount(): Promise<CountsDto> {
        return this.landingService.getWeeklyCounts();
    }

    // GET /landing/featuredcases
    @Get('/featuredcases')
    @ApiOperation({ summary: 'Get featured cases.' })
    @ApiResponse({
        status: 200,
        description: 'Get the 5 featured cases with the latest changes.',
        type: CaseCountResponse,
    })
    @UseInterceptors(ClassSerializerInterceptor)
    getFeaturedCases(): Promise<CaseCountResponse> {
        return this.landingService.getFeaturedCases();
    }
}
