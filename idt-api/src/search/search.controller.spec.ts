import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { SearchQuery } from './query/search.query';

describe('SearchController', () => {
  let controller: SearchController;
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({})
      ],
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useFactory: () => ({
            perform: jest.fn(() => new Promise((resolve) => resolve(true))),
          })
        }
      ]
    }).compile();

    controller = module.get<SearchController>(SearchController);
    service = module.get<SearchService>(SearchService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("search", () => {
    it("should search", async () => {
      const params: SearchQuery = {
        entities: ['Cases', 'Companies'],
        query: ''
      };

      controller.search(params);
      expect(service.perform).toHaveBeenCalledWith(params);
    });
  });
});
