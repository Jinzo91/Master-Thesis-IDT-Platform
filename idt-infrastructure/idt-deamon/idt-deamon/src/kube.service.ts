import { Injectable, BadRequestException } from '@nestjs/common';
import { Client } from 'ssh2';
import { SSHResponse } from './model/ssh-response.class';
import { } from "moment";
import moment = require('moment');
import { ConfigService } from './config/config.service';

@Injectable()
export class KubeService {

  constructor(
    private readonly config: ConfigService
  ) { }

  deletePods(namespace: string): Promise<string> {
    return new Promise<any>((resolve, reject) => {
      if (namespace === 'idt' || namespace === 'idt-test') {
        this._executeCall(`kubectl delete pods -l type=deployable -n ${namespace}`).then((sshRes) => {
          resolve(sshRes);
        }, (sshErr) => {
          resolve(sshErr);
        });
      } else {
        reject(new BadRequestException('Wrong namespace...'));
      }
    })
  }

  recreateTLSSecret(namespace: string): Promise<string> {
    return new Promise<any>((resolve, reject) => {
      if (namespace === 'idt' || namespace === 'idt-test') {
        this._executeCall(`kubectl delete secret idt-tls-secret -n ${namespace}`).then((sshRes) => {
          this._executeCall(`kubectl create secret tls idt-tls-secret --key /var/lib/rbg-cert/live/host:intum:vmkrcmar68.privkey.pem --cert /var/lib/rbg-cert/live/host:intum:vmkrcmar68.cert.pem -n ${namespace}`).then((sshRes) => {

            if (namespace === 'idt') {
              this._executeCall('kubectl apply -f /home/schueler/idtdeploy/prod/05-ingress/ingress.prod.controller.yml').then((sshRes) => {
                resolve('Secret recreated.');
              }, (sshErr) => {
                resolve(sshErr);
              });
            } else {
              this._executeCall('kubectl apply -f /home/schueler/idtdeploy/test/05-ingress/ingress.test.controller.yml').then((sshRes) => {
                resolve('Secret recreated.');
              }, (sshErr) => {
                resolve(sshErr);
              });
            }

          }, (sshErr) => {
            resolve(sshErr);
          });
        }, (sshErr) => {
          resolve(sshErr);
        });
      } else {
        reject(new BadRequestException('Wrong namespace...'));
      }
    })
  }

  zipStorage(namespace: string): Promise<string> {
    const time = moment().format("YYYYMMDD[_]HHmmss");
    return new Promise<any>((resolve, reject) => {
      if (namespace === 'idt' || namespace === 'idt-test') {
        this._executeCall(`echo cschueler2015 | sudo -S zip -r /var/idt_backups/${time}_BackUp_IDTPortal /var/snap/microk8s/common/default-storage`).then((sshRes) => {
          this._executeCall(`find /var/idt_backups -mtime +10 -type f -delete`).then((sshRes) => {
            resolve(`BackUp with timestamp ${time} created.`);
          }, (sshErr) => {
            resolve(sshErr);
          });
        }, (sshErr) => {
          resolve(sshErr);
        });
      } else {
        reject(new BadRequestException('Wrong namespace...'));
      }
    })
  }

  private _executeCall(command: string): Promise<SSHResponse> {
    return new Promise<SSHResponse>((resolve, reject) => {
      var success = "";
      var error = "";
      const connection = new Client();
      connection.on('ready', () => {

        connection.exec(command, (err, stream) => {
          if (err) throw err;
          stream.on('close', (code, signal) => {
            connection.end();

            if (code === 0) {
              resolve(new SSHResponse(code, success, null));
            } else {
              reject(new SSHResponse(code, null, error));
            }
          }).on('data', (data) => {
            success += data.toString();
          }).stderr.on('data', (data) => {
            error += data.toString();
          });
        })
      }).connect({
        host: this.config.values.sshhost,
        port: this.config.values.sshport,
        username: this.config.values.sshusername,
        password: this.config.values.sshpassword
      });
    })
  }
}
