import { INestApplication, CacheModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthService } from '../src/auth/auth.service';
import { UserService } from '../src/user/user.service';
import { BearerStrategy } from '../src/auth/bearer.strategy';
import { User } from '../src/user/model/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { DeepPartial } from 'typeorm';
import { ReportingController } from '../src/reporting/reporting.controller';
import { LogService } from '../src/log/log.service';
import { CompanyService } from '../src/company/company.service';
import { CaseService } from '../src/case/services/case.service';
import { ContributorDto } from 'src/log/dto/contributor.dto';
import { GetTechnologyCountDto } from 'src/case/dto/get-technology-count.dto';

describe('Reporting (e2e)', () => {
    let server;
    let app: INestApplication;

    let user: DeepPartial<User> = {
        firstName: 'Test',
        lastName: 'Test',
        id: 1,
        mail: 'init@test.de',
        password: 'test',
        role: 0
    }

    let contributorsDto: ContributorDto[] = [{
        count: 5,
        resource: '/companies',
        user: { id: 1, mail: 'test@test.de', firstName: 'test', lastName: 'test', role: 0, }
    }];

    let companiesCount = [{
        id: 5,
        count: 5
    }];

    let techs: GetTechnologyCountDto[] = [{
        id: 4,
        name: "Node.JS",
        count: 5
    }];


    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                CacheModule.register(),
                JwtModule.registerAsync({
                    imports: [ConfigModule],
                    useFactory: async (config: ConfigService) => ({
                        secret: config.values.auth.jwtSecret,
                        signOptions: {
                            expiresIn: config.values.auth.jwtLifetime
                        }
                    }),
                    inject: [ConfigService],
                }),
            ],
            controllers: [ReportingController],
            providers: [
                BearerStrategy,
                {
                    provide: LogService,
                    useFactory: () => ({
                        getContributors: jest.fn(() => new Promise((resolve) => resolve(contributorsDto))),
                    }),
                },
                {
                    provide: CompanyService,
                    useFactory: () => ({
                        getTopCompanies: jest.fn(() => new Promise((resolve) => resolve(companiesCount))),
                    }),
                },
                {
                    provide: CaseService,
                    useFactory: () => ({
                        getTopTechs: jest.fn(() => new Promise((resolve) => resolve(techs))),
                        getCaseTypeCounts: jest.fn(() => new Promise((resolve) => resolve(techs))),
                    }),
                },
                {
                    provide: UserService,
                    useFactory: () => ({
                        create: jest.fn(() => new Promise((resolve) => resolve(true))),
                        findByEmail: jest.fn((dto: any) => new Promise((resolve) => {
                            if (dto.mail !== 'init@test.de') {
                                resolve(null);
                            }
                            resolve(user);
                        }
                        ))
                    })
                },
                {
                    provide: AuthService,
                    useFactory: () => ({
                        validate: jest.fn(() => new Promise((resolve) => resolve(user))),
                        validateToken: jest.fn(() => new Promise((resolve) => resolve(user)))
                    })
                }
            ]
        })
            .compile();

        app = module.createNestApplication();
        server = app.getHttpServer();
        await app.init();
    });

    it(`should list all contributors`, () => {
        return request(server)
            .get('/reporting/contributors')
            .auth('test', { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(contributorsDto);
    });

    it(`should get top companies`, () => {
        return request(server)
            .get('/reporting/top/companies')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(companiesCount)
    });

    it(`should get top technologies`, () => {
        return request(server)
            .get('/reporting/top/technologies')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(techs)
    });

    it(`should get top case types`, () => {
        return request(server)
            .get('/reporting/top/casetypes')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(techs)
    });

    afterEach(async () => {
        await app.close();
    });
});