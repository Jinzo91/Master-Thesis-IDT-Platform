import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
      ],
      providers: [
        { provide: FileService, useValue: {} },
      ]
    }).compile();

    service = module.get<FileService>(FileService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe("login", () => {
  //   it("should return an entity of tokenresult", async () => {
  //     const expectedResult = new TokenResponseDto();
  //     const params = new CredentialsDto();

  //     jest.spyOn(service, "login").mockResolvedValue(expectedResult);
  //     expect(await controller.login(params)).toBe(expectedResult);
  //   });
  // });
});
