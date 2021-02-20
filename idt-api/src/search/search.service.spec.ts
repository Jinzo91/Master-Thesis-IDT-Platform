import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './../search/search.service';
import { CaseService } from './../case/services/case.service';
import { CompanyService } from './../company/company.service';
import { SearchQuery } from './query/search.query';

describe('ScheduleService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
      ],
      providers: [
        SearchService,
        { provide: CaseService, 
          useFactory: () => ({
            search: jest.fn((query: SearchQuery) => new Promise((resolve) => resolve([{ values: 0 }, { values: 0 }]))),
          }),
        },
        { provide: CompanyService,
          useFactory: () => ({
            search: jest.fn((query: SearchQuery) => new Promise((resolve) => resolve([{ values: 0 }, { values: 0 }]))),
          }),
        }
      ]
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('perform', () => {
    it('should perform a search query', async () => {
      const query: SearchQuery = {
        entities: ['Cases', 'Companies'],
        query: 'TU'
      };

      const result = await service.perform(query);

      expect(result).toEqual({"cases": [{"values": 0}, {"values": 0}], "companies": [{"values": 0}, {"values": 0}]});
    });
  });

  describe('emptyPromise', () => {
    it('should return an empty response', async () => {
      const result = await service.emptyPromise();

      expect(result).toEqual([{ values: 0 }, { values: 0 }]);
    });
  });
});
