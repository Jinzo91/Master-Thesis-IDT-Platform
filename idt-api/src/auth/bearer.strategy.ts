import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './../user/model/user.entity';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(token: string): Promise<User> {
    const user = await this.authService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
