import { INestApplication, CacheModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { User } from '../src/user/model/user.entity';
import { DeepPartial } from 'typeorm';
import { Case } from '../src/case/model/case.entity';
import { FileService } from '../src/file/file.service';
import { LandingController } from '../src/landing/landing.controller';
import { LandingService } from '../src/landing/landing.service';
import { CompanyService } from '../src/company/company.service';
import { CaseService } from '../src/case/services/case.service';

describe('Landing (e2e)', () => {
  let server;
  let app: INestApplication;


  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        CacheModule.register()
      ],
      controllers: [LandingController],
      providers: [
        LandingService,
        {
          provide: CompanyService,
          useFactory: () => ({
            countRecords: jest.fn(() => new Promise((resolve) => resolve(1))),
          }),
        },
        {
          provide: CaseService,
          useFactory: () => ({
            countRecords: jest.fn(() => new Promise((resolve) => resolve(1))),
            getAllFeatured: jest.fn(() => new Promise((resolve) => resolve([new Case()]))),
          }),
        },
        {
          provide: FileService,
          useFactory: () => ({
            count: jest.fn(() => new Promise((resolve) => resolve(1))),
          }),
        },
      ]
    })
      .compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  it(`should get counts`, () => {
    return request(server)
      .get('/landing/counts')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({ companies: 1, cases: 1, files: 1 });
  });

  it(`should get weekly counts`, () => {
    return request(server)
      .get('/landing/counts/weekly')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({ companies: 1, cases: 1, files: 1 });
  });

  it(`should get featured cases`, () => {
    return request(server)
      .get('/landing/featuredcases')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect([{ }]);
  });

  afterEach(async () => {
    await app.close();
  });
});