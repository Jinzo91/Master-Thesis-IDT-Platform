import { Test, TestingModule } from '@nestjs/testing';

import { CaseService } from '../services/case.service';
import { FileService } from './../../file/file.service';
import { AuthService } from './../../auth/auth.service';

describe('CaseService', () => {
  let service: CaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
      ],
      providers: [
        { provide: CaseService, useValue: {} },
      ]
    }).compile();

    service = module.get<CaseService>(CaseService);
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
