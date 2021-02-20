import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';

describe('CompanyService', () => {
  let service: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
      ],
      providers: [
        { provide: CompanyService, useValue: {} },
      ]
    }).compile();

    service = module.get<CompanyService>(CompanyService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
