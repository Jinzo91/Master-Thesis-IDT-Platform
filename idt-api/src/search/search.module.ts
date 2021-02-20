import { Module, CacheModule } from '@nestjs/common';
import { SearchController } from './search.controller';
import { CaseModule } from './../case/case.module';
import { CompanyModule } from './../company/company.module';
import { SearchService } from './search.service';

@Module({
  imports: [
    CacheModule.register(),
    CaseModule,
    CompanyModule,
  ],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule {}
