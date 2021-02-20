import { Module, CacheModule } from '@nestjs/common';
import { ReportingController } from './reporting.controller';
import { LogModule } from './../log/log.module';
import { CompanyModule } from './../company/company.module';
import { CaseModule } from './../case/case.module';

@Module({
  imports: [
    CacheModule.register(),
    LogModule,
    CompanyModule,
    CaseModule
  ],
  controllers: [ReportingController]
})
export class ReportingModule {}
