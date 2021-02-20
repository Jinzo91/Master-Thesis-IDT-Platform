import { Test, TestingModule } from '@nestjs/testing';

import { CaseService } from '../services/case.service';
import { FileService } from './../../file/file.service';
import { CaseController } from './case.controller';
import { AuthService } from './../../auth/auth.service';
import { SourceService } from '../services/source.service';
import { SourceController } from './source.controller';

describe('Source Controller', () => {
  let controller: SourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
      ],
      controllers: [SourceController],
      providers: [
        { provide: SourceService, useValue: {} },
        { provide: FileService, useValue: {} },
      ]
    }).compile();

    controller = module.get<SourceController>(SourceController);
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
