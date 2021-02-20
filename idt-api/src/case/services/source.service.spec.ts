import { Test, TestingModule } from '@nestjs/testing';

import { SourceService } from './source.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Source } from '../model/source.entity';
import { Case } from '../model/case.entity';
import { File } from './../../file/model/file.entity';

describe('SourceService', () => {
    let service: SourceService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
            ],
            providers: [
                SourceService,
                {
                    provide: getRepositoryToken(Source),
                    useFactory: () => ({
                        save: jest.fn((dto: any) => new Promise((resolve) => resolve(new Source()))),
                        find: jest.fn((dto: any) => new Promise((resolve) => resolve([new Source()]))),
                        findOne: jest.fn((dto: any) => new Promise((resolve) => resolve(new Source()))),
                        findOneOrFail: jest.fn((dto: any) => new Promise((resolve) => resolve(new Source()))),
                        update: jest.fn((id: number, dto: any) => new Promise((resolve) => resolve(new Source()))),
                        // delete: jest.fn((dto: any) => new Promise((resolve) => resolve({ affected: 1 })))
                        query: jest.fn((dto: any) => new Promise((resolve) => resolve(true))),
                    }),
                },
                {
                    provide: getRepositoryToken(Case),
                    useFactory: () => ({
                        save: jest.fn((dto: any) => new Promise((resolve) => resolve(dto))),
                        // find: jest.fn((dto: any) => new Promise((resolve) => resolve([{ hash: 'hash' }]))),
                        // findOne: jest.fn((dto: any) => new Promise((resolve) => resolve(dto.where.mail || dto.where.id))),
                        findOneOrFail: jest.fn((dto: any) => new Promise((resolve) => {
                            resolve(new Case());
                        })),
                        // update: jest.fn((id: number, dto: any) => new Promise((resolve) => resolve({ mail: 'test@test.de' }))),
                        // delete: jest.fn((dto: any) => new Promise((resolve) => resolve({ affected: 1 })))
                    }),
                },
            ]
        }).compile();

        service = module.get<SourceService>(SourceService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should create a source", async () => {
            const result = await service.create('1', {});

            expect(result).toEqual(new Source());
        });
    });

    describe("update", () => {
        it("should update a source", async () => {
            const result = await service.update('1', '1', {});

            expect(result).toEqual(new Source());
        });
    });

    describe("getSourceFileById", () => {
        it("should get a source file by id", async () => {
            const result = await service.getSourceFileById('1',);

            expect(result).toEqual(new File());
        });
    });

    describe("getSourcesOfCase", () => {
        it("should get sources by caseId", async () => {
            const result = await service.getSourcesOfCase('1',);

            expect(result).toEqual([new Source()]);
        });
    });

    describe("clean", () => {
        it("should get sources by caseId", async () => {
            const result = await service.clean();

            expect(result).toEqual(true);
        });
    });
});
