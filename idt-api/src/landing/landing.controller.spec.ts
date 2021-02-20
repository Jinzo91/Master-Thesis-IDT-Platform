import { Test, TestingModule } from '@nestjs/testing';

import { LandingController } from './landing.controller';
import { LandingService } from './landing.service';
import { CacheModule, CacheInterceptor } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

describe('LandingController', () => {
  let controller: LandingController;
  let service: LandingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({})
      ],
      controllers: [LandingController],
      providers: [
        { provide: LandingService, 
          useFactory: () => ({
            getCounts: jest.fn(() => new Promise((resolve) => resolve(true))),
            getWeeklyCounts: jest.fn(() => new Promise((resolve) => resolve(true))),
            getFeaturedCases: jest.fn(() => new Promise((resolve) => resolve(true)))
          })
        }
      ]
    }).compile();

    controller = module.get<LandingController>(LandingController);
    service = module.get<LandingService>(LandingService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("getCount", () => {
    it("should get count", async () => {
      controller.getCount();
      expect(service.getCounts).toHaveBeenCalledWith();
    });
  });

  describe("getWeeklyCount", () => {
    it("should get weekly count", async () => {
      controller.getWeeklyCount();
      expect(service.getWeeklyCounts).toHaveBeenCalledWith();
    });
  });

  describe("getFeaturedCases", () => {
    it("should get featured cases", async () => {
      controller.getFeaturedCases();
      expect(service.getFeaturedCases).toHaveBeenCalledWith();
    });
  });
});
