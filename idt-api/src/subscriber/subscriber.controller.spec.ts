import { Test, TestingModule } from '@nestjs/testing';
import { SubscriberController } from './../subscriber/subscriber.controller';
import { SubscriberService } from './../subscriber/subscriber.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';

describe('SubscriberController', () => {
  let controller: SubscriberController;
  let service: SubscriberService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
      ],
      controllers: [SubscriberController],
      providers: [
        { provide: SubscriberService,
          useFactory: () => ({
            add: jest.fn(() => new Promise((resolve) => resolve(true))),
            activate: jest.fn(() => new Promise((resolve) => resolve(true))),
            unsubscribe: jest.fn(() => new Promise((resolve) => resolve(true))),
            sendIDTWeekly: jest.fn(() => new Promise((resolve) => resolve(true))),
            getLastHash: jest.fn(() => new Promise((resolve) => resolve(true))),
          })
        }
      ]
    }).compile();

    controller = module.get<SubscriberController>(SubscriberController);
    service = module.get<SubscriberService>(SubscriberService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("add", () => {
    it("should add a subscriber", async () => {
      const params: CreateSubscriberDto = {
        mail: 'test@test.de'
      };

      controller.add(params);
      expect(service.add).toHaveBeenCalledWith(params);
    });
  });

  describe("activate", () => {
    it("should activate a subscriber", async () => {
      const params: string = 'hash';

      controller.activate(params);
      expect(service.activate).toHaveBeenCalledWith(params);
    });
  });

  describe("unsubscribe", () => {
    it("should unsubscribe a subscriber", async () => {
      const params: string = 'hash';

      controller.unsubscribe(params);
      expect(service.unsubscribe).toHaveBeenCalledWith(params);
    });
  });

  describe("test", () => {
    it("should test IDT Weekly", async () => {
      controller.test();
      expect(service.sendIDTWeekly).toHaveBeenCalledWith();
    });
  });

  describe("getHashForTest", () => {
    it("should get hash for test", async () => {
      controller.getHashForTest();
      expect(service.getLastHash).toHaveBeenCalledWith();
    });
  });
});
