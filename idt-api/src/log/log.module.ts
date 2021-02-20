import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './model/log.entity';
import { LogInterceptor } from './interceptor/log.interceptor';
import { LogExceptionsFilter } from './interceptor/log-exception.filter';
import { UserModule } from './../user/user.module';
import { MailLog } from './model/mail-log.entity';
import { MailLogService } from './mail-log.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Log, MailLog]),
    UserModule
  ],
  providers: [
    LogService,
    MailLogService,
    LogInterceptor,
    LogExceptionsFilter,
  ],
  exports: [
    LogService,
    MailLogService,
    LogInterceptor,
    LogExceptionsFilter
  ]
})
export class LogModule { }
