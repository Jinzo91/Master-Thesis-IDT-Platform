import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserModule } from './../user/user.module';
import { BearerStrategy } from './bearer.strategy';
import { ConfigModule } from './../config/config.module';
import { ConfigService } from './../config/config.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
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
  ],
  providers: [
    AuthService,
    BearerStrategy,
  ],
  controllers: [AuthController],
  exports: [
    AuthService
  ]
})
export class AuthModule { }
