import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()	
export class HttpExceptionFilter implements ExceptionFilter {	
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    response	
      .status(status)
      .json({	// ② JSON 형태로 클라이언트에게 넘길 값을 설정할 수 있다.
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}

// @Catch(HttpException)	// ① @Catch 데코레이터를 이용하여 특정 예외사항을 정할 수 있다.
// export class HttpExceptionFilter implements ExceptionFilter {	
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//     const status = exception.getStatus();


//     console.warn('예외처리');

//     response	
//       .status(status)
//       .json({	// ② JSON 형태로 클라이언트에게 넘길 값을 설정할 수 있다.
//         statusCode: status,
//         timestamp: new Date().toISOString(),
//         path: request.url,
//       });
//   }
// }