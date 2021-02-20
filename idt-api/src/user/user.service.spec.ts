import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './model/user.entity';
import { DeepPartial } from 'typeorm';
import { CompanyService } from 'src/company/company.service';
import { CaseService } from 'src/case/services/case.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
      ],
      providers: [
        UserService,
        { provide: CompanyService, useValue: {} },
        { provide: CaseService, useValue: {} },
        {
          provide: getRepositoryToken(User),
          useFactory: () => ({
            save: jest.fn((dto: any) => new Promise((resolve) => resolve(dto))),
            findOne: jest.fn((dto: any) => new Promise((resolve) => resolve(dto.where.mail || dto.where.id ))),
            delete: jest.fn((dto: any) => new Promise((resolve) => resolve({ affected: 1 })))
          }),
        },
      ]
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an user from partial', async () => {
      const userPartial: DeepPartial<User> = {
        firstName: 'test',
        lastName: 'test',
        mail: 'test@test.de',
        role: 1,
      };

      const result = await service.create(userPartial);

      expect(result).toEqual(userPartial);
    });
  });

  describe('findByEmail', () => {
    it('should find an user by email', async () => {
      const userPartial: DeepPartial<User> = {
        mail: 'test@test.de',
      };

      const result = await service.findByEmail(userPartial.mail);

      expect(result).toEqual(userPartial.mail);
    });
  });

  describe('findById', () => {
    it('should find an user by id', async () => {
      const userPartial: DeepPartial<User> = {
        id: 1
      };

      const result = await service.findById(userPartial.id);

      expect(result).toEqual(userPartial.id);
    });
  });

  describe('deleteById', () => {
    it('should delete an user by id', async () => {
      const userPartial: DeepPartial<User> = {
        id: 1,
      };

      const result = await service.deleteById(userPartial.id);

      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('createInitialUsers', () => {
    it('should create inititial users and return true', async () => {

      const result = await service.createInitialUsers();

      expect(result).toEqual(true);
    });
  });
});
