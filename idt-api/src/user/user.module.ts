import { Module, CacheModule, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './model/user.entity';
import { CompanyModule } from '../company/company.module';
import { CaseModule } from '../case/case.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule.register(),
    forwardRef(() => CompanyModule),
    CaseModule
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule { }
