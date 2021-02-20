import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FileService } from './file.service';
import { ConfigModule } from './../config/config.module';
import { ConfigService } from './../config/config.service';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File, FileSchema } from './../file/model/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.values.documentdb.host,
        auth: config.values.documentdb.username ? {
          user: config.values.documentdb.username,
          password: config.values.documentdb.password,
        } : null
      }),
      inject: [ConfigService],
    }),
    MulterModule.register({
      dest: '/tmp/upload',
      preservePath: true
    }),
    MongooseModule.forFeature([{name: 'File', schema: FileSchema}])
  ],
  providers: [FileService],
  exports: [FileService]
})
export class FileModule { }
