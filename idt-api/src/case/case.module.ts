import { Module, CacheModule } from '@nestjs/common';
import { CaseService } from './services/case.service';
import { CaseController } from './controllers/case.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Case } from './model/case.entity';
import { AuthModule } from './../auth/auth.module';
import { FileModule } from './../file/file.module';
import { Technology } from './model/technology.entity';
import { Comment } from './model/comment.entity';
import { Source } from './model/source.entity';
import { SourceController } from './controllers/source.controller';
import { SourceService } from './services/source.service';
import { File } from '../file/model/file.entity'

@Module({
  imports: [
    AuthModule,
    FileModule,
    TypeOrmModule.forFeature([Case, Technology, Source, File, Comment]),
    CacheModule.register(),
  ],
  providers: [
    SourceService,
    CaseService,
  ],
  controllers: [
    CaseController,
    SourceController
  ],
  exports: [
    CaseService,
  ]
})
export class CaseModule { }
