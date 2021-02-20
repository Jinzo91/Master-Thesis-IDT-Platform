import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from './../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from './../config/config.module';
import { ConfigService } from './../config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenResponseDto } from './dto/token-response.dto';
import { CredentialsDto } from './../auth/dto/credentials.dto';

describe('Auth Controller', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (config: ConfigService) => ({
            secret: config.values.auth.jwtSecret,
            signOptions: {
              expiresIn: config.values.auth.jwtLifetime
            }
          }),
          inject: [ConfigService],
        }),
        TypeOrmModule
      ],
      controllers: [AuthController],
      providers: [
        { provide: AuthService, 
          useFactory: () => ({
            login: jest.fn(() => new Promise((resolve) => resolve(true)))
          })
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("login", () => {
    it("should return an entity of tokenresult", async () => {
      const params: CredentialsDto = {
        mail: 'test@test.de',
        password: 'test'
      };

      controller.login(params);
      expect(service.login).toHaveBeenCalledWith(params);
    });
  });
});
