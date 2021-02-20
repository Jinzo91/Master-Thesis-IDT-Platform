import { Injectable } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import { readFileSync, readFile } from 'fs';
import { join } from 'path';
import { Case } from 'src/case/model/case.entity';

@Injectable()
export class TemplateService {

    async renderInviteMail(mail: string, webBaseUrl: string, apiBaseUrl: string, hash: string): Promise<string> {
        return await new Promise<string>((resolve, reject) => {
            readFile(join(__dirname, './files/invite.hbs'), (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const template = Handlebars.compile(data.toString());
                    const html = template({ mail, apiBaseUrl, activateLink: `${webBaseUrl}/auth/validate/${hash}`});

                    resolve(html);
                }
            });
        });
    }

    async renderAddSubscriptionMail(mail: string, webBaseUrl: string, apiBaseUrl: string, hash: string): Promise<string> {
        return await new Promise<string>((resolve, reject) => {
            readFile(join(__dirname, './files/add-subscriber.hbs'), (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const template = Handlebars.compile(data.toString());
                    const html = template({ mail, apiBaseUrl, activateLink: `${webBaseUrl}/subscription/activate/${hash}`});

                    resolve(html);
                }
            });
        });
    }

    async renderIDTWeeklyMail(mail: string, webBaseUrl: string, apiBaseUrl: string, hash: string, cases: Case[], caseCount: number): Promise<string> {
        return await new Promise<string>((resolve, reject) => {
            readFile(join(__dirname, './files/idt-weekly.hbs'), (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const template = Handlebars.compile(data.toString());
                    let cleanCaseCount = 0;
                    let hasMore = false;

                    if (caseCount > 5) {
                        cleanCaseCount = caseCount - 5;
                        hasMore = true;
                    }

                    cases.forEach((c) => {
                        if (c.description.split(' ').length >= 40) {
                            c.description = c.description.split(' ').slice(0, 39).join(' ');
                            c.description += '...';
                        }

                        // Wrong usage of URL attribute
                        // Just use it as long as URL attribute is not needed in template!
                        c.url = `${webBaseUrl}/cases/${c.id}`
                    })

                    const html = template({ mail, apiBaseUrl, unsubscribeLink: `${webBaseUrl}/subscription/unsubscribe/${hash}`, moreUrl: `${webBaseUrl}/cases`, cases, cleanCaseCount, hasMore });

                    resolve(html);
                }
            });
        });
    }
}
