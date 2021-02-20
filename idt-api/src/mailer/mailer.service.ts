import { Injectable } from '@nestjs/common';
import { InjectTransport } from '@mobizerg/nest-nodemailer';
import { SentMessageInfo } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { Invite } from './../signup/model/invite.entity';
import { TemplateService } from './template/template.service';
import { ConfigService } from './../config/config.service';
import { Subscriber } from './../subscriber/model/subscriber.entity';
import { CountResponse } from './../common/response/count.response';
import { Case } from './../case/model/case.entity';
import { MailLogService } from './../log/mail-log.service';
import { MailTypeEnum } from './../log/model/mail-type.enum';

@Injectable()
export class MailerService {

    constructor(
        private readonly config: ConfigService,
        private readonly templateService: TemplateService,
        private readonly mailLogService: MailLogService,

        @InjectTransport()
        private readonly mailTransport: Mail
    ) { }

    async send(options: Mail.Options): Promise<SentMessageInfo> {
        return await this.mailTransport.sendMail(options);
    }

    async sendInviteMail(invite: Invite): Promise<SentMessageInfo> {
        const lead = Date.now();
        return await new Promise<SentMessageInfo>((resolve, reject) => {
            this.templateService.renderInviteMail(invite.mail, this.config.values.webBaseUrl, this.config.values.apiBaseUrl, invite.hash).then((html) => {
                const mailOptions: Mail.Options = {
                    to: invite.mail,
                    subject: 'Invitation to IDT!',
                    html
                };

                resolve(this._send(mailOptions, MailTypeEnum.invitation, lead));
            }, (err) => {
                reject(err);
            });
        });
    }

    async sendAddSubscriberMail(subscriber: Subscriber): Promise<SentMessageInfo> {
        const lead = Date.now();
        return await new Promise<SentMessageInfo>((resolve, reject) => {
            this.templateService.renderAddSubscriptionMail(subscriber.mail, this.config.values.webBaseUrl, this.config.values.apiBaseUrl, subscriber.hash).then((html) => {
                const mailOptions: Mail.Options = {
                    to: subscriber.mail,
                    subject: 'Activate your IDT subscription!',
                    html
                };

                resolve(this._send(mailOptions, MailTypeEnum.activation, lead));
            }, (err) => {
                reject(err);
            });
        });
    }

    async sendIDTWeeklyMail(ss: Subscriber[], cases: CountResponse<Case[]>): Promise<Boolean> {
        const infos: SentMessageInfo[] = [];
        for (const s of ss) {
            const lead = Date.now();
            const mailOptions: Mail.Options = await this._createIDTWeeklyOptions(s, cases);
            const info = await this._send(mailOptions, MailTypeEnum.idtweekly, lead);
            infos.push(info);
        }

        return infos.map((i) => {
            const acceptedArray = i.accepted as string[];

            return acceptedArray.length > 0 ? true : false;
        }).reduce((total, value) => total && value);
    }

    private async _createIDTWeeklyOptions(subscriber: Subscriber, cases: CountResponse<Case[]>): Promise<Mail.Options> {
        return await new Promise<SentMessageInfo>((resolve, reject) => {
            this.templateService.renderIDTWeeklyMail(
                subscriber.mail,
                this.config.values.webBaseUrl,
                this.config.values.apiBaseUrl,
                subscriber.hash,
                cases.values,
                cases.count ? cases.count : 0
            ).then((html) => {
                const mailOptions: Mail.Options = {
                    to: subscriber.mail,
                    subject: 'IDT Weekly',
                    html
                };

                resolve(mailOptions);
            }, (err) => {
                reject(err);
            });
        });
    }

    private async _send(options: Mail.Options, type: MailTypeEnum, lead: number): Promise<SentMessageInfo> {
        let sendResult = await this.mailTransport.sendMail(options);
        await this.mailLogService.log(
            options.to as string,
            Date.now() - lead,
            type,
            sendResult.accepted as string[],
            sendResult.rejected as string[],
        );
        return sendResult;
    }
}
