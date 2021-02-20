import { Controller, Get, UseInterceptors, ClassSerializerInterceptor, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { SearchResultDto } from './model/search-result.dto';
import { SearchQuery } from './query/search.query';
import { SearchService } from './search.service';

@ApiTags('search')
// @UseInterceptors(CacheInterceptor)
@Controller('search')
export class SearchController {

    constructor(
        private readonly searchService: SearchService,
    ) { }

    // GET /search
    // Global search to query all searchable entities.
    @Get('')
    @ApiOperation({ summary: 'Global search to query all searchable entities.' })
    @ApiResponse({
        status: 200,
        description: 'The companies have been successfully queried.',
        type: SearchResultDto,
    })
    @ApiQuery({
        name: 'entities',
        description: 'Properties to include in search. If nothing is selected, search in all searchable entities is started.',
        enum: ['Cases', 'Companies'],
        isArray: true,
        required: false,
    })
    @ApiQuery({
        name: 'query',
        description: 'Search query.',
        type: 'string',
        required: true,
    })
    @UseInterceptors(ClassSerializerInterceptor)
    search(@Query() query: SearchQuery): Promise<SearchResultDto> {
        return new Promise<SearchResultDto>((resolve) => {
            resolve(this.searchService.perform(query));
        });
    }
}
