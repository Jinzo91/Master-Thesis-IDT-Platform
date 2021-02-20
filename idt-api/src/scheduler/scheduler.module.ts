import { Module } from '@nestjs/common';
import { ScheduleModule } from 'nest-schedule';
import { ScheduleService } from './scheduler.service';
import { SubscriberModule } from './../subscriber/subscriber.module';

@Module({
  imports: [
    ScheduleModule.register(),
    SubscriberModule
  ],
  providers: [
    ScheduleService
  ],
  exports: [
    ScheduleService
  ]
})
export class SchedulerModule { }
