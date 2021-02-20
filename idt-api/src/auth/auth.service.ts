import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { UserService } from './../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './../user/model/user.entity';
import * as crypto from 'crypto';
import { CredentialsDto } from './dto/credentials.dto';
import { TokenResponseDto } from './dto/token-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) { }

    public async login(credentials: CredentialsDto): Promise<TokenResponseDto> {
        credentials.password = crypto.createHmac('sha256', credentials.password).digest('hex');

        return new Promise<TokenResponseDto>((resolve, reject) => {
            this.userService.findByEmail("idt.integration.test.box+adminaccount@gmail.com").then((u) => {

                if (u) {
                    this.validate(credentials).then((user) => {
                        if (!user) {
                            reject(new UnauthorizedException({ type: 'unknown_user', message: 'User was not found!' }));
                        } else {
                            const accessToken = this.jwtService.sign({ user });

                            const tokenResponse: TokenResponseDto = {
                                expires_in: 3600,
                                access_token: accessToken,
                                user_id: user.id,
                                status: 200,
                            };

                            resolve(tokenResponse);
                        }
                    }, (err) => {
                        reject(err);
                    });
                } else {
                    this.userService.createInitialUsers().then((_) => {
                        this.validate(credentials).then((user) => {
                            if (!user) {
                                reject(new UnauthorizedException({ type: 'unknown_user', message: 'User was not found!' }));
                            } else {
                                const accessToken = this.jwtService.sign({ user });

                                const tokenResponse: TokenResponseDto = {
                                    expires_in: 3600,
                                    access_token: accessToken,
                                    user_id: user.id,
                                    status: 200,
                                };

                                resolve(tokenResponse);
                            }
                        }, (err) => {
                            reject(err);
                        });
                    }, (_) => {
                        reject(new InternalServerErrorException('Error Code 101.'));
                    })
                }

            }, (err) => {
                reject(err);
            });
        });
    }

    public async validateToken(token: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.jwtService.verifyAsync(token, {}).then(() => {
                const payload = this.jwtService.decode(token);

                const user = (payload as any).user as User;

                this.userService.findById(user.id).then((u) => {
                    if (u.role === user.role) {
                        resolve(user);
                    } else {
                        reject(new UnauthorizedException('Could not validate user!'));
                    }
                }, (_) => {
                    reject(new UnauthorizedException('Could not validate user!'));
                });
                resolve((payload as any).user as User);
            }, (err) => {
                if (err.name === 'TokenExpiredError') {
                    reject(new UnauthorizedException('Token expired!'));
                } else {
                    reject(err);
                }
            });
        });
    }

    private async validate(credentials: CredentialsDto): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.userService.findByEmail(credentials.mail).then((u) => {
                if (u) {
                    if (u.password === credentials.password) {
                        // Strip pwd for security reasons.
                        delete u.password;
                        resolve(u);
                    } else {
                        reject(new UnauthorizedException({ type: 'wrong_password', message: 'Provided password does not match!' }));
                    }
                } else {
                    reject(new UnauthorizedException({ type: 'unknown_user', message: 'User was not found!' }));
                }
            }, () => {
                reject(new InternalServerErrorException({ type: 'internal', message: 'Internal Server Error. Please try again later!' }));
            });
        });
    }

}
