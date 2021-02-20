import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { NodemailerModule } from '@mobizerg/nest-nodemailer';
import { ConfigModule } from './../config/config.module';
import { ConfigService } from './../config/config.service';
import { TemplateService } from './template/template.service';
import { LogModule } from './../log/log.module';

@Module({
  imports: [
    ConfigModule,
    LogModule,
    NodemailerModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        name: 'test',
        transport: {
          host: config.values.mail.host,
          port: config.values.mail.port,
          secure: config.values.mail.isSecure,
          auth: {
            user: config.values.mail.user,
            pass: config.values.mail.password,
          },
          pool: true as true,
        },
        defaults: {
          pool: true as true,
          maxConnections: 2,
          from: `${config.values.mail.fromName} <${config.values.mail.fromAddress}>`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailerService, TemplateService],
  exports: [MailerService],
})
export class MailerModule { }
