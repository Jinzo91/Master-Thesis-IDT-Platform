import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigModule } from './../config/config.module';
import { ConfigService } from './../config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        type: config.values.database.type,
        host: config.values.database.host,
        port: config.values.database.port,
        username: config.values.database.username,
        password: config.values.database.password,
        database: config.values.database.name,
        entities: [join(__dirname, '../**/**.entity{.ts,.js}')],
        synchronize: !config.values.database.useMigrations,
        options: {
          encrypt: true,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule { }
