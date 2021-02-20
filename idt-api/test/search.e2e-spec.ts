import { INestApplication, CacheModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Case } from '../src/case/model/case.entity';
import { CompanyService } from '../src/company/company.service';
import { CaseService } from '../src/case/services/case.service';
import { SearchController } from '../src/search/search.controller';
import { SearchService } from '../src/search/search.service';
import { Company } from '../src/company/model/company.entity';

describe('Search (e2e)', () => {
  let server;
  let app: INestApplication;


  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        CacheModule.register()
      ],
      controllers: [SearchController],
      providers: [
        SearchService,
        {
          provide: CompanyService,
          useFactory: () => ({
            search: jest.fn(() => new Promise((resolve) => resolve([new Company()]))),
          }),
        },
        {
          provide: CaseService,
          useFactory: () => ({
            search: jest.fn(() => new Promise((resolve) => resolve([new Case()]))),
          }),
        },
      ]
    })
      .compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  it(`should search`, () => {
    return request(server)
      .get('/search')
      .query('?query=test&entities=Cases&entities=Companies')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({ cases: [ {} ], companies: [ {} ] });
  });

  afterEach(async () => {
    await app.close();
  });
});