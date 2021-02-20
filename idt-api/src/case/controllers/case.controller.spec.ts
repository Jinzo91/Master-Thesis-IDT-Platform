import { Test, TestingModule } from '@nestjs/testing';

import { CaseService } from '../services/case.service';
import { FileService } from './../../file/file.service';
import { CaseController } from './case.controller';
import { AuthService } from './../../auth/auth.service';

describe('Case Controller', () => {
  let controller: CaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
      ],
      controllers: [CaseController],
      providers: [
        { provide: CaseService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: FileService, useValue: {} },
      ]
    }).compile();

    controller = module.get<CaseController>(CaseController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
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
