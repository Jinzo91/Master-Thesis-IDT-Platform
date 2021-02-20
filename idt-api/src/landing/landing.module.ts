import { Module, CacheModule } from '@nestjs/common';
import { LandingService } from './landing.service';
import { LandingController } from './landing.controller';
import { CompanyModule } from '../company/company.module';
import { CaseModule } from '../case/case.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    CacheModule.register(),
    CompanyModule,
    CaseModule,
    FileModule
  ],
  providers: [LandingService],
  controllers: [LandingController],
})
export class LandingModule {}
