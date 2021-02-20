import { Injectable } from '@nestjs/common';
import { Cron, NestSchedule } from 'nest-schedule';
import { SubscriberService } from './../subscriber/subscriber.service';

@Injectable() // Only support SINGLETON scope
export class ScheduleService extends NestSchedule {

    constructor(
        private subscriberService: SubscriberService
    ) {
        super();
    }

    // Every Friday, 3 pm (15:00)
    @Cron('0 15 * * 5')
    async sendIDTWeekly() {
        // ToDo: Logging...
        // console.log('Executing cron job.');
        await this.subscriberService.sendIDTWeekly();
        // console.log('IDT Weekly was sent successfully.')
    }
}