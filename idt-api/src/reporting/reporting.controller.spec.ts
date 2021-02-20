import { Test, TestingModule } from '@nestjs/testing';
import { ReportingController } from './../reporting/reporting.controller';
import { CacheModule } from '@nestjs/common';
import { LogService } from './../log/log.service';
import { CompanyService } from './../company/company.service';
import { CaseService } from './../case/services/case.service';
import { DateQuery } from './query/date.query';

describe('ReportingController', () => {
  let controller: ReportingController;

  let logService: LogService;
  let companyService: CompanyService;
  let caseService: CaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({})
      ],
      controllers: [ReportingController],
      providers: [
        {
          provide: LogService,
          useFactory: () => ({
            getContributors: jest.fn(() => new Promise((resolve) => resolve(true)))
          })
        },
        {
          provide: CompanyService,
          useFactory: () => ({
            getTopCompanies: jest.fn(() => new Promise((resolve) => resolve(true)))
          })
        },
        {
          provide: CaseService,
          useFactory: () => ({
            getTopTechs: jest.fn(() => new Promise((resolve) => resolve(true))),
            getCaseTypeCounts: jest.fn(() => new Promise((resolve) => resolve(true)))
          })
        }
      ]
    }).compile();

    controller = module.get<ReportingController>(ReportingController);

    logService = module.get<LogService>(LogService);;
    companyService = module.get<CompanyService>(CompanyService);
    caseService = module.get<CaseService>(CaseService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("getContributors", () => {
    it("should get contributors", async () => {
      const params: DateQuery = {
        start: new Date().toISOString(),
        end: new Date().toISOString()
      };

      controller.getContributors(params);
      expect(logService.getContributors).toHaveBeenCalledWith(params);
    });
  });

  describe("getTopTech", () => {
    it("should get top tech", async () => {
      controller.getTopTech();
      expect(caseService.getTopTechs).toHaveBeenCalledWith(10);
    });
  });

  describe("getCaseTypeCounts", () => {
    it("should get case type counts", async () => {
      controller.getCaseTypeCounts();
      expect(caseService.getCaseTypeCounts).toHaveBeenCalledWith();
    });
  });
});
