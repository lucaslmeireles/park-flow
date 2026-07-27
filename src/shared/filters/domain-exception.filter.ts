import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  TicketAlreadyClosedException,
  TicketForbiddenException,
  TicketNotActiveException,
  TicketNotFoundException,
  TicketException,
} from 'src/modules/ticket/domain/exceptions/ticket.exception';

@Catch(TicketException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: TicketException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let httpException: HttpException;

    if (exception instanceof TicketNotFoundException) {
      httpException = new NotFoundException(exception.message);
    } else if (exception instanceof TicketForbiddenException) {
      httpException = new ForbiddenException(exception.message);
    } else if (
      exception instanceof TicketAlreadyClosedException ||
      exception instanceof TicketNotActiveException
    ) {
      httpException = new BadRequestException(exception.message);
    } else {
      httpException = new BadRequestException(exception.message);
    }

    response.status(httpException.getStatus()).json({
      statusCode: httpException.getStatus(),
      timestamp: new Date().toISOString(),
      path: request.url,
      message: httpException.message,
    });
  }
}
