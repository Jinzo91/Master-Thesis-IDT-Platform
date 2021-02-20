import { Module } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { SubscriberController } from './subscriber.controller';
import { MailerModule } from './../mailer/mailer.module';
import { Subscriber } from './model/subscriber.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseModule } from './../case/case.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscriber]),
    CaseModule,
    MailerModule
  ],
  providers: [SubscriberService],
  controllers: [SubscriberController],
  exports: [
    SubscriberService
  ]
})
export class SubscriberModule {}
