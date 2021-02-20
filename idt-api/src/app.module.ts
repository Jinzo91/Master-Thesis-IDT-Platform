import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { MailerModule } from './mailer/mailer.module';
import { SignUpModule } from './signup/signup.module';
import { CompanyModule } from './company/company.module';
import { CaseModule } from './case/case.module';
import { LandingModule } from './landing/landing.module';
import { LogModule } from './log/log.module';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { LogInterceptor } from './log/interceptor/log.interceptor';
import { LogExceptionsFilter } from './log/interceptor/log-exception.filter';
import { ReportingModule } from './reporting/reporting.module';
import { SearchModule } from './search/search.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SubscriberModule } from './subscriber/subscriber.module';
import { CleanUserInterceptor } from './auth/clean-user.interceptor';
import { SchedulerModule } from './scheduler/scheduler.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '.', 'static'),
      renderPath: 'static',
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    ConfigModule,
    MailerModule,
    SignUpModule,
    CompanyModule,
    CaseModule,
    LandingModule,
    LogModule,
    ReportingModule,
    SearchModule,
    SubscriberModule,
    SchedulerModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
    // ===== MARK: Disabled CleanUserInterceptor =====
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CleanUserInterceptor,
    // },
    {
      provide: APP_FILTER,
      useClass: LogExceptionsFilter
    }
  ],
})
export class AppModule {}
