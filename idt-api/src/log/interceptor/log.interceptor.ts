import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogService } from '../log.service';
import { IncomingMessage } from 'http';

@Injectable()
export class LogInterceptor implements NestInterceptor {

    constructor(
        private readonly logService: LogService,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const incomingMessage: IncomingMessage = context.getArgs()[0];
        const now = Date.now();

        return next
            .handle()
            .pipe(
                tap(() => {
                    let leadTime = Date.now() - now;

                    this.logService.logRequest(
                        incomingMessage.method,
                        incomingMessage.url,
                        leadTime,
                        (incomingMessage as any).user
                    );
                })
            );
    }
}