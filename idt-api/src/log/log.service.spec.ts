import { Test, TestingModule } from '@nestjs/testing';

import { LogService } from './../log/log.service';
import { Log } from './model/log.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('LogService', () => {
    let service: LogService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
            ],
            providers: [
                LogService,
                {
                    provide: getRepositoryToken(Log),
                    useFactory: () => ({
                        save: jest.fn(() => new Promise((resolve) => resolve(true))),
                    }),
                }
            ]
        }).compile();

        service = module.get<LogService>(LogService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('logRequest', () => {
        it('should log a request', async () => {
            const result = await service.logRequest('GET', 'companies', 1000);

            expect(result).toBeUndefined();
        });
    });

    describe('logError', () => {
        it('should log an error', async () => {
            const result = await service.logError('GET', 'companies');

            expect(result).toBeUndefined();
        });
    });
});
