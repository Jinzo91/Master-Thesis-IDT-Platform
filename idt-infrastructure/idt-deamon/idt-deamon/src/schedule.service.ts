import { Injectable } from '@nestjs/common';
import { Cron, NestSchedule } from 'nest-schedule';
import { KubeService } from './kube.service';
import { ConfigService } from './config/config.service';

@Injectable() // Only support SINGLETON scope
export class ScheduleService extends NestSchedule {

    constructor(
        private kubeService: KubeService,
        private readonly config: ConfigService
    ) {
        super();
    }

    // Everyday, 6am (06:00)
    @Cron('0 6 * * *')
    async saveBackupMorning() {
        if (this.config.values.namespace === 'idt') {
            // ToDo: Logging...
            console.log('Executing saveBackupMorning() cron job.');
            await this.kubeService.zipStorage(this.config.values.namespace);
            console.log('Backup was created successfully.')
        }
    }
/*
    // Everyday, 6pm (18:00)
    @Cron('0 18 * * *')
    async saveBackupEvening() {
        if (this.config.values.namespace === 'idt') {
            // ToDo: Logging...
            console.log('Executing saveBackupMorning() cron job.');
            await this.kubeService.zipStorage(this.config.values.namespace);
            console.log('Backup was created successfully.')
        }
    }
*/
    // Every first of month, at midnight (00:00)
    @Cron('0 0 1 * *')
    async recreateTLS() {
        if (this.config.values.namespace === 'idt') {
            // ToDo: Logging...
            console.log('Executing recreateTLS() cron job.');
            await this.kubeService.recreateTLSSecret(this.config.values.namespace);
            console.log('TLS Secret and Ingress was recreated successfully.')
        }
    }

    // Every second day of month, at midnight (00:00)
    @Cron('0 0 2 * *')
    async recreateTLSForTest() {
        if (this.config.values.namespace === 'idt-test') {
            // ToDo: Logging...
            console.log('Executing recreateTLS() cron job.');
            await this.kubeService.recreateTLSSecret(this.config.values.namespace);
            console.log('TLS Secret and Ingress was recreated successfully.')
        }
    }
}