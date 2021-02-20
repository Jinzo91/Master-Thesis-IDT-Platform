import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './../config/config.service';
import { TemplateService } from './template/template.service';
import { MailLogService } from './../log/mail-log.service';
import { MailerService } from './mailer.service';
import { NodemailerModule } from '@mobizerg/nest-nodemailer';
import { ConfigModule } from './../config/config.module';

describe('MailerService', () => {
  let service: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
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
      providers: [
        MailerService,
        { provide: ConfigService, useValue: {} },
        { provide: TemplateService, useValue: {} },
        { provide: MailLogService, useValue: {} },
      ]
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
