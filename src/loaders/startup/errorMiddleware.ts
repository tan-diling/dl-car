import { Request, Response, NextFunction } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';
import { ValidationError } from 'class-validator';
import { errorMessage } from '@app/config';
import { errorMiddleware } from '@app/middlewares/error.middleware';

@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: Response, next: (err: any) => any) {
        errorMiddleware(error, request, response, next);
        // if (response.headersSent) return;

        // const validErrors = error?.errors;
        // if (typeof (validErrors) == typeof ([]) && validErrors[0] instanceof ValidationError) {
        //     response.status(400)
        //         .json({
        //             errorCode: 'input_invalid',
        //             message: `Invalid input, check '${validErrors[0].property}' property `
        //         })
        //         .end();

        // } else if (error instanceof HttpError) {

        //     let { stack, name, message, httpCode, ...ext } = error;
        //     if (!message.includes(' ')) {
        //         const k = message;
        //         const msg = errorMessage(k);
        //         response.status(error.httpCode || 501)
        //             .json({ errorCode: k, message: msg })
        //             .end();
        //     }
        //     else {

        //         response.status(error.httpCode || 501)
        //             .json({ errorCode: name, message })
        //             .end();
        //     }
        // } else if (error instanceof Error) {
        //     response.status(500)
        //         .json({
        //             errorCode: 'internal_server_error',
        //             message: error.message,
        //         })
        //         .end();
        // } else {
        //     response.status(500)
        //         .json({
        //             errorCode: 'unknown_error',
        //             message: JSON.stringify(error),
        //         })
        //         .end();
        // }
    }
}