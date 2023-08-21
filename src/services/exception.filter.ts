import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from './logger.service';
import { JwtAuthGuard } from './jwt.auth.guard';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      code: status,
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      message:
        status !== HttpStatus.INTERNAL_SERVER_ERROR
          ? exception.message || null
          : 'Internal server error',
    };

    if (exception.message === JwtAuthGuard.UNAUTHORIZED_MESSAGE) {
      response.status(401).json({ message: 'Unauthorized' });
    } else {
      response.status(403).json({ message: 'Forbidden' });
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      LoggerService.error(`${request.method} ${request.url}`);
    } else {
      LoggerService.error(`${request.method} ${request.url}`);
    }

    response.status(status).json(errorResponse).json();
  }
}
