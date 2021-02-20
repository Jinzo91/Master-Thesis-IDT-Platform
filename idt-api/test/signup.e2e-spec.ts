import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthService } from '../src/auth/auth.service';
import { SignUpController } from '../src/signup/signup.controller';
import { SignUpService } from '../src/signup/signup.service';
import { UserService } from '../src/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Invite } from '../src/signup/model/invite.entity';
import { MailerService } from '../src/mailer/mailer.service';
import { BearerStrategy } from '../src/auth/bearer.strategy';
import { User } from '../src/user/model/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { DeepPartial } from 'typeorm';

describe('SignUp (e2e)', () => {
  let server;
  let app: INestApplication;
  let date: string = new Date().toISOString();

  let user: DeepPartial<User> = {
    firstName: 'Test',
    lastName: 'Test',
    id: 1,
    mail: 'init@test.de',
    password: 'test',
    role: 0
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
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
      ],
      controllers: [SignUpController],
      providers: [
        BearerStrategy,
        SignUpService,
        {
          provide: getRepositoryToken(Invite),
          useFactory: () => ({
            save: jest.fn((dto: any) => new Promise((resolve) => resolve(dto))),
            findOneOrFail: jest.fn(() => new Promise((resolve) => {
              resolve({ mail: 'test@test.de', hash: 'hash', dateCreated: date })
            })),
            find: jest.fn(() => new Promise((resolve) => resolve([{ hash: 'hash' }]))),
            delete: jest.fn(() => new Promise((resolve) => resolve({ affected: 1 })))
          }),
        },
        {
          provide: MailerService,
          useFactory: () => ({
            sendInviteMail: jest.fn((dto: any) => new Promise((resolve) => resolve(dto.mail)))
          }),
        },
        {
          provide: UserService,
          useFactory: () => ({
            create: jest.fn(() => new Promise((resolve) => resolve(true))),
            findByEmail: jest.fn((dto: any) => new Promise((resolve) => {
              if (dto.mail !== 'init@test.de') {
                resolve(null);
              }
              resolve(user);
            }
            ))
          })
        },
        {
          provide: AuthService,
          useFactory: () => ({
            validate: jest.fn(() => new Promise((resolve) => resolve(user))),
            validateToken: jest.fn(() => new Promise((resolve) => resolve(user)))
          })
        }
      ]
    })
      .compile();


    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  it(`should invite an user`, () => {
    return request(server)
      .post('/signup/invite')
      .send({ mail: 'test@test.de' })
      .auth('test', { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);
  });

  it(`should get an invite`, () => {
    return request(server)
      .get('/signup/invite/hash')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({ mail: 'test@test.de', hash: 'hash', dateCreated: date })
  });

  it(`should accept an invite`, () => {
    return request(server)
      .post('/signup/invite/hash')
      .send({ firstName: 'Test', lastName: 'Test', password: 'test' })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(201)
      .expect({})
  });

  afterEach(async () => {
    await app.close();
  });
});