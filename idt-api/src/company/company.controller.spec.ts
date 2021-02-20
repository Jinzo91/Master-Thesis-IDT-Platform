import { Test, TestingModule } from '@nestjs/testing';

import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { AuthService } from './../auth/auth.service';
import { FileService } from './../file/file.service';

describe('CompanyController', () => {
  let controller: CompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
      ],
      controllers: [CompanyController],
      providers: [
        { provide: CompanyService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: FileService, useValue: {} },
      ]
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
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
