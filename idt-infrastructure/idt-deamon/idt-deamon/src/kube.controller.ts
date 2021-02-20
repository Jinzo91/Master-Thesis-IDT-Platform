import { Controller, Get, Param } from '@nestjs/common';
import { KubeService } from './kube.service';
import { ConfigService } from './config/config.service';

@Controller()
export class KubeController {
  constructor(
    private readonly kubeService: KubeService,
    private readonly config: ConfigService
  ) {}

  @Get()
  hello(): string {
    return 'IDT Deamon';
  }

  @Get('/actions/recreate/pods')
  deletePods(): Promise<any> {
    return this.kubeService.deletePods(this.config.values.namespace);
  }


  @Get('/actions/recreate/tls')
  recreateTls(): Promise<any> {
    return this.kubeService.recreateTLSSecret(this.config.values.namespace);
  }

  @Get('/actions/create/backup')
  backup(): Promise<any> {
    return this.kubeService.zipStorage(this.config.values.namespace);
  }
}
