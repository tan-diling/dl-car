import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';

@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: (err: any) => any) {

        if (error instanceof HttpError) {
            const {stack, ...httpError} = error ;
            response.status(error.httpCode || 500)
            .json(httpError)
            .end();
        } else if (error instanceof Error) {
            response.status(500).json({
                codeCode: 500,
                error: error.message,
            })
            .end();
        }
        else {
            next(error);
        }
    }
}