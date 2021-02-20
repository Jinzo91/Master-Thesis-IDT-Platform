import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { CacheModule } from '@nestjs/common';
import { UserService } from './user.service';

describe('User Controller', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({})
      ],
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: {} }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
