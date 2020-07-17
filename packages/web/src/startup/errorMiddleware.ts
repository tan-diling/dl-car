import { Request, Response, NextFunction } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';

@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: Response, next: (err: any) => any) {
        if (response.headersSent) return ;

        if (error instanceof HttpError) {

            const {stack,name, ...httpError} = error ;
            
            response.status(error.httpCode || 500)
            .json(httpError)
            .end();
        } else if (error instanceof Error) {
            response.status(500).json({
                httpCode: 500,
                message: error.message,
            })
            .end();
        }
        else {
            next(error);
        }
    }
}