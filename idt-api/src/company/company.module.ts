import { Module, CacheModule, forwardRef, HttpModule } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './model/company.entity';
import { AuthModule } from './../auth/auth.module';
import { FileModule } from './../file/file.module';
import { CaseModule } from './../case/case.module';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => AuthModule),
    FileModule,
    CaseModule,
    TypeOrmModule.forFeature([Company]),
    CacheModule.register(),
  ],
  providers: [CompanyService],
  controllers: [CompanyController],
  exports: [
    CompanyService,
  ],
})
export class CompanyModule {}
