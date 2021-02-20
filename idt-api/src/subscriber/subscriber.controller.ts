import { Controller, UseInterceptors, Post, ClassSerializerInterceptor, Body, Param, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { SubscriberService } from './subscriber.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('subscribers')
@Controller('subscribers')
export class SubscriberController {

    constructor(
        private readonly subscriberService: SubscriberService
    ) { }

    // POST /subscribers/add
    @Post('/add')
    @ApiOperation({ summary: 'Adds a new subscriber.' })
    @ApiResponse({
        status: 201,
        description: 'New subscriber has been added.',
        type: CreateSubscriberDto,
    })
    @UseInterceptors(ClassSerializerInterceptor)
    add(@Body() subscriber: CreateSubscriberDto): Promise<CreateSubscriberDto> {
        return this.subscriberService.add(subscriber);
    }

    // GET /subscribers/activate/:hash
    @Get('/activate/:hash')
    @ApiOperation({ summary: 'Activates a pending subscriber.' })
    @ApiResponse({
        status: 200,
        description: 'New subscriber has been added.',
        type: CreateSubscriberDto,
    })
    @UseInterceptors(ClassSerializerInterceptor)
    activate(@Param('hash') hash: string): Promise<CreateSubscriberDto> {
        return this.subscriberService.activate(hash);
    }

    // GET /subscribers/unsubscribe/:hash
    @Get('/unsubscribe/:hash')
    @ApiOperation({ summary: 'Unsubscribe an active subscriber.' })
    @ApiResponse({
        status: 200,
        description: 'Subscriber has unsubscribe.',
        type: CreateSubscriberDto,
    })
    @UseInterceptors(ClassSerializerInterceptor)
    unsubscribe(@Param('hash') hash: string): Promise<CreateSubscriberDto> {
        return this.subscriberService.unsubscribe(hash);
    }

    // GET /subscribers/unsubscribe/:hash
    @Get('/test/idtweekly')
    @ApiExcludeEndpoint()
    test(): Promise<boolean> {
        return this.subscriberService.sendIDTWeekly();
    }

    @ApiExcludeEndpoint()
    @Get('/integrationtest/gethash')
    @UseGuards(AuthGuard('bearer'))
    getHashForTest(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            resolve(this.subscriberService.getLastHash());
        });
    }
}
