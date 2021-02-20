import { Test, TestingModule } from '@nestjs/testing';
import { SignUpController } from './../signup/signup.controller';
import { SignUpService } from './../signup/signup.service';
import { UserService } from './../user/user.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { RoleEnum } from './../user/model/role.enum';
import { ForbiddenException } from '@nestjs/common';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { CreateUserDto } from './../user/dto/create-user.dto';



describe('SignUpController', () => {
  let controller: SignUpController;
  let service: SignUpService;

  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
      ],
      controllers: [SignUpController],
      providers: [
        {
          provide: SignUpService,
          useFactory: () => ({
            create: jest.fn(() => new Promise((resolve) => resolve(true))),
            getInviteByHash: jest.fn(() => new Promise((resolve) => resolve(true))),
            removeInviteByHash: jest.fn(() => new Promise((resolve) => resolve(true))),
            getLastHash: jest.fn(() => new Promise((resolve) => resolve(true))),
            cleanTest: jest.fn(() => new Promise((resolve) => resolve(true)))
          })
        },
        {
          provide: UserService,
          useFactory: () => ({
            create: jest.fn(() => new Promise((resolve) => resolve(true)))
          })
        }
      ]
    }).compile();

    controller = module.get<SignUpController>(SignUpController);
    service = module.get<SignUpService>(SignUpService);

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("invite", () => {
    it("should invite a potential user", async () => {
      const params: CreateInviteDto = {
        mail: 'test@test.de'
      };

      controller.invite(params, { user: { role: RoleEnum.Admin } });
      expect(service.create).toHaveBeenCalledWith(params);
    });
  });

  describe("acceptInvite", () => {
    it("should accept an invite", async () => {
      const params: AcceptInviteDto = {
        firstName: '',
        lastName: '',
        password: ''
      };

      controller.acceptInvite('', params, {});
      expect(service.getInviteByHash).toHaveBeenCalledWith(''); 
    });
  });

  describe("getInvitation", () => {
    it("should get an invite", async () => {
      controller.getInvitation('');
      expect(service.getInviteByHash).toHaveBeenCalledWith(''); 
    });
  });

  describe("getInvitation", () => {
    it("should get an invite", async () => {
      controller.getInvitation('');
      expect(service.getInviteByHash).toHaveBeenCalledWith(''); 
    });
  });

  describe("getHashForTest", () => {
    it("should get hash for test", async () => {
      controller.getHashForTest();
      expect(service.getLastHash).toHaveBeenCalledWith(); 
    });
  });

  describe("cleanTest", () => {
    it("should clean test", async () => {
      controller.cleanTest('');
      expect(service.cleanTest).toHaveBeenCalledWith(''); 
    });
  });
});
