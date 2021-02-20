import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthService } from '../src/auth/auth.service';
import { UserService } from '../src/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BearerStrategy } from '../src/auth/bearer.strategy';
import { User } from '../src/user/model/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { DeepPartial } from 'typeorm';
import { SourceController } from '../src/case/controllers/source.controller';
import { SourceService } from '../src/case/services/source.service';
import { Source } from '../src/case/model/source.entity';
import { Case } from '../src/case/model/case.entity';
import { FileService } from '../src/file/file.service';
import { CreateSourceDto } from '../src/case/dto/create-source.dto';
import { join } from 'path';
import { createReadStream } from 'fs';

describe('Source (e2e)', () => {
  let server;
  let app: INestApplication;

  let user: DeepPartial<User> = {
    firstName: 'Test',
    lastName: 'Test',
    id: 1,
    mail: 'init@test.de',
    password: 'test',
    role: 0
  }

  let newSource: CreateSourceDto = {
    title: "Research Paper XY",
    description: "Lorem Ipsum...",
    url: "https://www.tum.de"
  };

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
      controllers: [SourceController],
      providers: [
        BearerStrategy,
        SourceService,
        {
          provide: getRepositoryToken(Source),
          useFactory: () => ({
            save: jest.fn((dto: any) => new Promise((resolve) => resolve(dto))),
            findOne: jest.fn(() => new Promise((resolve) => {
                resolve({ id: 1 })
              })),
            findOneOrFail: jest.fn(() => new Promise((resolve) => {
              resolve({ id: 1 })
            })),
            find: jest.fn(() => new Promise((resolve) => resolve([{ id: 1 }]))),
            update: jest.fn(() => new Promise((resolve) => resolve({ id: 1 }))),
            delete: jest.fn(() => new Promise((resolve) => resolve({ affected: 1 })))
          }),
        },
        {
          provide: getRepositoryToken(Case),
          useFactory: () => ({
            save: jest.fn((dto: any) => new Promise((resolve) => resolve(dto))),
            findOneOrFail: jest.fn(() => new Promise((resolve) => {
              resolve({ id: 1 })
            }))
          }),
        },
        {
          provide: FileService,
          useFactory: () => ({
            writeFile: jest.fn(() => new Promise((resolve) => resolve({ id: 1 }))),
            readStream: jest.fn(() => new Promise((resolve) => resolve(createReadStream(join(__dirname, './test.pdf')))))
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

  it(`should create source`, () => {
    return request(server)
      .post('/cases/1/sources')
      .send(newSource)
      .auth('test', { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .expect({ id: 1 });
  });

  it(`should get sources`, () => {
    return request(server)
      .get('/cases/1/sources')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect([{ id: 1 }])
  });

  it(`should update a source`, () => {
    return request(server)
      .patch('/cases/1/sources/1')
      .send(newSource)
      .auth('test', { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({ id: 1 });
  });

  it(`should add a file to a source`, () => {
    return request(server)
      .post('/cases/1/sources/1/file')
      .attach('file', join(__dirname, './test.pdf'))
      .auth('test', { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(201)
      .expect('true');
  });

  it(`should get a file to a source`, () => {
    return request(server)
      .get('/cases/1/sources/1/file')
      .auth('test', { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect(200)
  });

  afterEach(async () => {
    await app.close();
  });
});