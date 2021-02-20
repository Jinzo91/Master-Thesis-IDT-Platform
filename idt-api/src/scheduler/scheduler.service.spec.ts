import { Test, TestingModule } from '@nestjs/testing';
import { SubscriberService } from './../subscriber/subscriber.service';
import { ScheduleService } from './scheduler.service';
import { ScheduleModule } from 'nest-schedule';

describe('ScheduleService', () => {
    let service: ScheduleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ScheduleModule.register(),
            ],
            providers: [
                ScheduleService,
                {
                    provide: SubscriberService,
                    useFactory: () => ({
                        sendIDTWeekly: jest.fn(() => new Promise((resolve) => resolve(true))),
                    }),
                }
            ]
        }).compile();

        service = module.get<ScheduleService>(ScheduleService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });


    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('sendIDTWeekly', () => {
        it('should send IDT Weekly', async () => {
          const result = await service.sendIDTWeekly();
    
          expect(result).toBeUndefined();
        });
      });
});
