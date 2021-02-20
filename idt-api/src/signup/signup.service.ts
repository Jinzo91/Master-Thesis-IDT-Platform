import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invite } from './model/invite.entity';
import { Repository, DeepPartial, DeleteResult } from 'typeorm';
import { MailerService } from './../mailer/mailer.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { GetInviteDto } from './dto/get-invite.dto';
import { UserService } from './../user/user.service';

@Injectable()
export class SignUpService {

    constructor(
        @InjectRepository(Invite)
        private readonly inviteRepository: Repository<Invite>,
        private readonly userService: UserService,
        private readonly mailer: MailerService,
    ) { }

    async create(attributes: DeepPartial<Invite>): Promise<CreateInviteDto> {
        return await new Promise<CreateInviteDto>((resolve, reject) => {
            this.userService.findByEmail(attributes.mail).then((m) => {
                if (m) {
                    reject(new BadRequestException('User already exists.'));
                } else {
                    const invite = Object.assign(new Invite(), attributes);
                    this.inviteRepository.save(invite).then((i) => {
                        this.mailer.sendInviteMail(i).then((r) => {
                            resolve({ mail: i.mail });
                        }, (err) => {
                            reject(err);
                        });
                    }, (err) => {
                        reject(err);
                    });
                }
            }, (_) => {
                reject(new InternalServerErrorException('Error on invite.'));
            });
        });
    }

    async getInviteByHash(hash: string): Promise<GetInviteDto> {
        return await new Promise<GetInviteDto>((resolve, reject) => {
            this.inviteRepository.findOneOrFail({
                where: { hash },
                select: ['mail', 'hash', 'dateCreated'],
            }).then((i) => {
                resolve(i);
            }, (err) => {
                reject(new NotFoundException('Not Found. No invitation found for given hash.'));
            });
        });
    }

    async removeInviteByHash(hash: string): Promise<DeleteResult> {
        return await this.inviteRepository.delete({ hash });
    }

    async getLastHash(): Promise<string> {
        return await new Promise<string>((resolve, reject) => {
            this.inviteRepository.find({
                order: { dateCreated: 'DESC' },
                take: 1
            }).then((ii) => {
                resolve(ii[0].hash);
            }, (err) => {
                reject(err);
            });
        });
    }

    async cleanTest(userId: string): Promise<DeleteResult> {
        return await this.userService.deleteById(parseInt(userId, 10));
    }
}
