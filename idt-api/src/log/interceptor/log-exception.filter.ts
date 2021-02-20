import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { LogService } from '../log.service';

@Catch()
export class LogExceptionsFilter implements ExceptionFilter {

    constructor(
        private readonly logService: LogService,
    ) { }

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        if ((exception as any).status) {
            if ((exception as any).status === 401) {
                status = HttpStatus.UNAUTHORIZED;
            }
        }

        this.logService.logError(
            request.method,
            request.url,
            (request as any).user
        );

        response.status(status).json({
            statusCode: status,
            error: (exception as any).message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
