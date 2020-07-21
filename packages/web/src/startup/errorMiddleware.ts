import { Request, Response, NextFunction } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';
import { ValidationError } from 'class-validator';

@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: Response, next: (err: any) => any) {
        if (response.headersSent) return ;

        

        if (error instanceof ValidationError) {

            const {property,constraints} = error ;
            
            response.status(400)
            .json({errorCode:'input_invalid', message:`Invalid input, check '${property}' field` })
            .end();
        } else if (error instanceof HttpError) {

            const {stack,name, message, httpCode} = error ;
            
            response.status(error.httpCode || 501)
            .json({errorCode:name, message })
            .end();
        } else if (error instanceof Error) {
            response.status(500).json({
                errorCode: 'internal_server_error',
                message: error.message,
            })
            .end();
        }
        else {
            next(error);
        }
    }
}