import { Test, TestingModule } from '@nestjs/testing';
import { SignUpService } from './../signup/signup.service';
import { UserService } from './../user/user.service';
import { MailerService } from './../mailer/mailer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Invite } from './../signup/model/invite.entity';
import { DeepPartial } from 'typeorm';

describe('SignUpService', () => {
  let service: SignUpService;
  let date: string = new Date().toISOString();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
      ],
      providers: [
        SignUpService,
        { provide: UserService,
          useFactory: () => ({
            findByEmail: jest.fn((mail: string) => new Promise((resolve) => resolve(null))),
            deleteById: jest.fn((dto: any) => new Promise((resolve) => resolve({ affected: 1 })))
          }),
        },
        { provide: MailerService,
          useFactory: () => ({
            sendInviteMail: jest.fn((dto: any) => new Promise((resolve) => resolve(dto.mail)))
          }),
        },
        {
          provide: getRepositoryToken(Invite),
          useFactory: () => ({
            save: jest.fn((dto: any) => new Promise((resolve) => resolve(dto))),
            findOneOrFail: jest.fn((dto: any) => new Promise((resolve) => {
              resolve({ mail: 'test@test.de', hash: 'hash', dateCreated: date })
            })),
            find: jest.fn((dto: any) => new Promise((resolve) => resolve([{ hash: 'hash' }]))),
            delete: jest.fn((dto: any) => new Promise((resolve) => resolve({ affected: 1 })))
          }),
        },
      ]
    }).compile();

    service = module.get<SignUpService>(SignUpService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should add an invite from partial', async () => {
      const invitePartial: DeepPartial<Invite> = {
        mail: 'test@test.de'
      };

      const result = await service.create(invitePartial);

      expect(result).toEqual(invitePartial);
    });
  });

  describe('getInviteByHash', () => {
    it('should get an invite by hash', async () => {
      const invitePartial: DeepPartial<Invite> = {
        mail: 'test@test.de',
        hash: 'hash',
        dateCreated: date
      };

      const result = await service.getInviteByHash(invitePartial.hash);

      expect(result).toEqual(invitePartial);
    });
  });

  describe('removeInviteByHash', () => {
    it('should remove an invite by hash', async () => {
      const invitePartial: DeepPartial<Invite> = {
        mail: 'test@test.de',
        hash: 'hash',
        dateCreated: date
      };

      const result = await service.removeInviteByHash(invitePartial.hash);

      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('getLastHash', () => {
    it('should get last hash', async () => {
      const result = await service.getLastHash();

      expect(result).toEqual('hash');
    });
  });

  describe('cleanTest', () => {
    it('should clean test', async () => {
      const result = await service.cleanTest('userId');

      expect(result).toEqual({ affected: 1 });
    });
  });
});
