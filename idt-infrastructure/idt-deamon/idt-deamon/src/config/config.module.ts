import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

// declare var process: {
//   env: {
//     NODE_ENV: string;
//   },
// };

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`${process.env.NODE_ENV}`),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule { }
