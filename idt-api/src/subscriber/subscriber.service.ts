import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Subscriber } from './model/subscriber.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, FindManyOptions } from 'typeorm';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { MailerService } from './../mailer/mailer.service';
import { CaseService } from './../case/services/case.service';

@Injectable()
export class SubscriberService {

    constructor(
        @InjectRepository(Subscriber)
        private readonly subscriberRepository: Repository<Subscriber>,

        private readonly mailerService: MailerService,
        private readonly caseService: CaseService
    ) { }

    async add(attributes: DeepPartial<Subscriber>): Promise<CreateSubscriberDto> {
        return await new Promise<CreateSubscriberDto>((resolve, reject) => {
            const subscriber = Object.assign(new Subscriber(), attributes);
            this.subscriberRepository.save(subscriber).then((s) => {
                this.mailerService.sendAddSubscriberMail(s).then((_) => {
                    resolve({ mail: s.mail });
                }, (err) => {
                    console.log(err);
                    reject(new InternalServerErrorException('Error on sending mail!'));
                });
            }, (err) => {
                reject(err);
            });
        });
    }

    async activate(hash: string): Promise<CreateSubscriberDto> {
        return await new Promise<CreateSubscriberDto>((resolve, reject) => {
            this.subscriberRepository.findOneOrFail({ hash }).then((s) => {
                if (s.active) {
                    reject(new BadRequestException('Subscriber already active.'));
                } else {
                    this.subscriberRepository.update(s.id, { active: true }).then((_) => {
                        resolve({ mail: s.mail });
                    }, (err) => {
                        reject(err);
                    });
                }
            }, (_) => {
                reject(new NotFoundException('Subscriber not found.'));
            });
        });
    }

    async unsubscribe(hash: string): Promise<CreateSubscriberDto> {
        return await new Promise<CreateSubscriberDto>((resolve, reject) => {
            this.subscriberRepository.findOneOrFail({ hash }).then((s) => {
                if (!s.active) {
                    reject(new BadRequestException('Subscriber is not active.'));
                } else {
                    this.subscriberRepository.delete(s.id).then((_) => {
                        resolve({ mail: s.mail });
                    }, (err) => {
                        reject(err);
                    });
                }
            }, (_) => {
                reject(new NotFoundException('Subscriber not found.'));
            });
        });
    }

    async sendIDTWeekly(): Promise<any> {
        return await new Promise<any>((resolve, reject) => {
            this.caseService.getWeeklyCases().then((c) => {
                const findOptions: FindManyOptions<Subscriber> = {
                    where: { active: true }
                }
                this.subscriberRepository.find(findOptions).then((ss) => {
                    this.mailerService.sendIDTWeeklyMail(ss, c).then((_) => {
                        resolve(true);
                    }, (err) => {
                        console.log(err);
                        reject(new InternalServerErrorException('Error on sending mail!'));
                    });
                }, (err) => {
                    console.log(err);
                    reject(new NotFoundException('Subscriber not found.'));
                });
            }, (err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    async getLastHash(): Promise<string> {
        return await new Promise<string>((resolve, reject) => {
            this.subscriberRepository.find({
                order: { dateCreated: 'DESC' },
                take: 1
            }).then((ii) => {
                resolve(ii[0].hash);
            }, (err) => {
                reject(err);
            });
        });
    }
}
