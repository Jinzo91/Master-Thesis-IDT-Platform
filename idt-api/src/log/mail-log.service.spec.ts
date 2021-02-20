import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { MailLogService } from './mail-log.service';
import { MailLog } from './model/mail-log.entity';
import { MailTypeEnum } from './model/mail-type.enum';

describe('MailLogService', () => {
    let service: MailLogService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
            ],
            providers: [
                MailLogService,
                {
                    provide: getRepositoryToken(MailLog),
                    useFactory: () => ({
                        save: jest.fn(() => new Promise((resolve) => resolve(true))),
                    }),
                }
            ]
        }).compile();

        service = module.get<MailLogService>(MailLogService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('logMailing', () => {
        it('should log a mailing', async () => {
            const result = await service.log('Test', 100, MailTypeEnum.invitation, ['test@test.de'], []);

            expect(result).toBeUndefined();
        });
    });
});
