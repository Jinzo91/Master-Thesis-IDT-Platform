import { INestApplication, CacheModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CaseService } from '../src/case/services/case.service';
import { SubscriberController } from '../src/subscriber/subscriber.controller';
import { SubscriberService } from '../src/subscriber/subscriber.service';
import { MailerService } from '../src/mailer/mailer.service';
import { Subscriber } from '../src/subscriber/model/subscriber.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateSubscriberDto } from '../src/subscriber/dto/create-subscriber.dto';

describe('Subscriber (e2e)', () => {
    let server;
    let app: INestApplication;

    let subscriberDto: CreateSubscriberDto = {
        mail: 'test@test.de'
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                CacheModule.register()
            ],
            controllers: [SubscriberController],
            providers: [
                SubscriberService,
                {
                    provide: MailerService,
                    useFactory: () => ({
                        sendAddSubscriberMail: jest.fn(() => new Promise((resolve) => resolve(true))),
                    }),
                },
                {
                    provide: CaseService,
                    useFactory: () => ({ }),
                },
                {
                    provide: getRepositoryToken(Subscriber),
                    useFactory: () => ({
                        save: jest.fn((dto: any) => new Promise((resolve) => resolve(dto))),
                        findOneOrFail: jest.fn((query: any) => new Promise((resolve) => {
                            if (query.hash.includes('active')) {
                                resolve({ id: 1, mail: 'test@test.de', active: true })
                            } else {
                                resolve({ id: 1, mail: 'test@test.de', active: false })
                            }
                        })),
                        update: jest.fn(() => new Promise((resolve) => resolve({ id: 1, mail: 'test@test.de' }))),
                        delete: jest.fn(() => new Promise((resolve) => resolve({ affected: 1 })))
                    }),
                },
            ]
        })
            .compile();

        app = module.createNestApplication();
        server = app.getHttpServer();
        await app.init();
    });

    it(`should add a new subscriber`, () => {
        return request(server)
            .post('/subscribers/add')
            .send(subscriberDto)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .expect(subscriberDto);
    });

    it(`should activate a pending subscriber`, () => {
        return request(server)
            .get('/subscribers/activate/hash')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(subscriberDto);
    });

    it(`should unsubscribe an active subscriber`, () => {
        return request(server)
            .get('/subscribers/unsubscribe/hashactive')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(subscriberDto);
    });

    afterEach(async () => {
        await app.close();
    });
});