import { Module } from '@nestjs/common';
import { KubeController } from './kube.controller';
import { KubeService } from './kube.service';
import { ScheduleModule } from 'nest-schedule';
import { ScheduleService } from './schedule.service';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ScheduleModule.register(),
    ConfigModule
  ],
  controllers: [
    KubeController
  ],
  providers: [
    KubeService,
    ScheduleService
  ],
})
export class AppModule { }
