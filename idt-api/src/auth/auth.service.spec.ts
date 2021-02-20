import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import { ConfigModule } from './../config/config.module';
import { ConfigService } from './../config/config.service';
import { UserModule } from './../user/user.module';
import { TokenResponseDto } from './dto/token-response.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { User } from './../user/model/user.entity';
import { DeepPartial } from 'typeorm';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // JwtModule.registerAsync({
        //   imports: [ConfigModule],
        //   useFactory: async (config: ConfigService) => ({
        //     secret: config.values.auth.jwtSecret,
        //     signOptions: {
        //       expiresIn: config.values.auth.jwtLifetime
        //     }
        //   }),
        //   inject: [ConfigService],
        // }),
      ],
      providers: [
        AuthService,
        {
          provide: UserService,
          useFactory: () => ({
            findById: jest.fn((id: number) => new Promise((resolve) => resolve(new User()))),
            findByEmail: jest.fn((mail: string) => new Promise((resolve) => resolve({ id: 1, password: 'ad71148c79f21ab9eec51ea5c7dd2b668792f7c0d3534ae66b22f71c61523fb3' }))),
            createInitialUsers: jest.fn(() => new Promise((resolve) => resolve(true))),
          }),
        },
        {
          provide: JwtService,
          useFactory: () => ({
            sign: jest.fn((dto: any) => 'token'),
            decode: jest.fn((token: string) => { return { user: { id: 1 } } }),
            verifyAsync: jest.fn((token: string, options: any) => new Promise((resolve) => resolve(true))),
          }),
        }
      ],
    })
      .compile();

    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe("login", () => {
    it("should login", async () => {
      const creds: CredentialsDto = {
        mail: 'test@test.de',
        password: 'test'
      };

      const tokenResponse: TokenResponseDto = {
        expires_in: 3600,
        access_token: 'token',
        user_id: 1,
        status: 200,
      };

      const result = await authService.login(creds);

      expect(result).toEqual(tokenResponse);
    });
  });

  describe("validateToken", () => {
    it("should validate token", async () => {
      const result = await authService.validateToken('token');

      expect(result).toEqual({id: 1});
    });
  });
});
