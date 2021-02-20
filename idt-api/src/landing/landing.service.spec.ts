import { Test, TestingModule } from '@nestjs/testing';
import { LandingService } from './landing.service';
import { CompanyService } from './../company/company.service';
import { CaseService } from './../case/services/case.service';
import { FileService } from './../file/file.service';
import { CaseCountResponse } from 'dist/case/response/case-count.response';

describe('LandingService', () => {
  let service: LandingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
      ],
      providers: [
        LandingService,
        {
          provide: CompanyService,
          useFactory: () => ({
            countRecords: jest.fn(() => new Promise((resolve) => resolve(1))),

          })
        },
        {
          provide: CaseService,
          useFactory: () => ({
            countRecords: jest.fn(() => new Promise((resolve) => resolve(1))),
            getAllFeatured: jest.fn(() => new Promise((resolve) => resolve({ values: [], count: 0 })))
          })
        },
        {
          provide: FileService,
          useFactory: () => ({
            count: jest.fn(() => new Promise((resolve) => resolve(1))),

          })
        },
      ]
    }).compile();

    service = module.get<LandingService>(LandingService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("getCounts", () => {
    it("should get counts", async () => {
      const result = await service.getCounts();

      expect(result).toEqual({ companies: 1, cases: 1, files: 1 });
    });
  });

  describe("getWeeklyCounts", () => {
    it("should get counts", async () => {
      const result = await service.getWeeklyCounts();

      expect(result).toEqual({ companies: 1, cases: 1, files: 1 });
    });
  });

  describe("getFeaturedCases", () => {
    it("should get counts", async () => {
     const response: CaseCountResponse = { values: [], count: 0 };

      const result = await service.getFeaturedCases();

      expect(result).toEqual(response);
    });
  });
});
