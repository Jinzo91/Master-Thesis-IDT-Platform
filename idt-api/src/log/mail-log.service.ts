import { Injectable } from '@nestjs/common';
import { MailLog } from './model/mail-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { MailTypeEnum } from './model/mail-type.enum';

@Injectable()
export class MailLogService {

    constructor(
        @InjectRepository(MailLog)
        private readonly mailLogRepository: Repository<MailLog>,
    ) { }

    async log(mail: string, leadTime: number, mailType: MailTypeEnum, accepted: string[], rejected: string[]) {
        const attributes: DeepPartial<MailLog> = {
            leadTime,
            mail,
            mailType,
            accepted: accepted.length === 0 ? null : accepted.join(', '),
            rejected: rejected.length === 0 ? null :rejected.join(', '),
            success: (rejected.length === 0 && accepted.length > 0) ? true : false
        }

        const mailLog = Object.assign(new MailLog(), attributes);
        await this.mailLogRepository.save(mailLog);
    }
}
