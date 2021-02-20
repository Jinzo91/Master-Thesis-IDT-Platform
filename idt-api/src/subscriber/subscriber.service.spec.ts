import { Test, TestingModule } from '@nestjs/testing';
import { SignUpService } from './../signup/signup.service';
import { UserService } from './../user/user.service';
import { MailerService } from './../mailer/mailer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Subscriber } from './../subscriber/model/subscriber.entity';
import { SubscriberService } from './../subscriber/subscriber.service';
import { CaseService } from './../case/services/case.service';
import { DeepPartial } from 'typeorm';

describe('SubscriberService', () => {
  let service: SubscriberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
      ],
      providers: [
        SubscriberService,
        { provide: MailerService,
          useFactory: () => ({
            sendAddSubscriberMail: jest.fn((s: any) => new Promise((resolve) => resolve(s.mail))),
            sendIDTWeeklyMail: jest.fn((s: any, c: any) => new Promise((resolve) => resolve(true)))
          }),
        },
        { provide: CaseService,
          useFactory: () => ({
            getWeeklyCases: jest.fn(() => new Promise((resolve) => resolve({ })))
          }),
        },
        {
          provide: getRepositoryToken(Subscriber),
          useFactory: () => ({
            save: jest.fn((dto: any) => new Promise((resolve) => resolve(dto))),
            find: jest.fn((dto: any) => new Promise((resolve) => resolve([{ hash: 'hash' }]))),
            findOne: jest.fn((dto: any) => new Promise((resolve) => resolve(dto.where.mail || dto.where.id ))),
            findOneOrFail: jest.fn((dto: any) => new Promise((resolve) => {
              if (dto.hash === 'hash') {
                resolve({ active: false, mail: 'test@test.de'})
              } else {
                resolve({ active: true, mail: 'test@test.de'})
              }
            })),
            update: jest.fn((id: number, dto: any) => new Promise((resolve) => resolve({ mail: 'test@test.de' }))),
            delete: jest.fn((dto: any) => new Promise((resolve) => resolve({ affected: 1 })))
          }),
        },
      ]
    }).compile();

    service = module.get<SubscriberService>(SubscriberService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('add', () => {
    it('should add a subscriber from partial', async () => {
      const subscriberPartial: DeepPartial<Subscriber> = {
        mail: 'test@test.de'
      };

      const result = await service.add(subscriberPartial);

      expect(result).toEqual(subscriberPartial);
    });
  });

  describe('activate', () => {
    it('should activate a subscriber by hash', async () => {
      const subscriberPartial: DeepPartial<Subscriber> = {
        mail: 'test@test.de'
      };

      const result = await service.activate('hash');

      expect(result).toEqual(subscriberPartial);
    });
  });

  describe('unsubscribe', () => {
    it('should deactivate a subscriber by hash', async () => {
      const subscriberPartial: DeepPartial<Subscriber> = {
        mail: 'test@test.de'
      };

      const result = await service.unsubscribe('activeHash');

      expect(result).toEqual(subscriberPartial);
    });
  });

  describe('sendIDTWeekly', () => {
    it('should send IDT Weekly', async () => {
      const result = await service.sendIDTWeekly();

      expect(result).toEqual(true);
    });
  });

  describe('getLastHash', () => {
    it('should get last hash', async () => {
      const result = await service.getLastHash();

      expect(result).toEqual('hash');
    });
  });

  // describe("login", () => {
  //   it("should return an entity of tokenresult", async () => {
  //     const expectedResult = new TokenResponseDto();
  //     const params = new CredentialsDto();

  //     jest.spyOn(service, "login").mockResolvedValue(expectedResult);
  //     expect(await controller.login(params)).toBe(expectedResult);
  //   });
  // });
});
