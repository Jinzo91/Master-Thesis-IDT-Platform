import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthService } from '../src/auth/auth.service';
import { AuthController } from '../src/auth/auth.controller';

describe('Auth (e2e)', () => {
  let server;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: () => ({
            login: jest.fn(() => new Promise((resolve) => resolve({
              expires_in: 3600,
              access_token: 'token',
              user_id: 1,
              status: 200,
            })))
          })
        }
      ]
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  it(`should login and return token response`, () => {
    return request(server)
      .post('/auth/login')
      .send({ mail: 'test@test.de', password: 'test' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        expires_in: 3600,
        access_token: 'token',
        user_id: 1,
        status: 200,
      });
  });

  afterEach(async () => {
    await app.close();
  });
});