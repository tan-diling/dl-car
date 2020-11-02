import { Request, Response, NextFunction } from 'express';
import { UserService } from '@app/services';
import { Container } from 'typedi';
import { NotFoundError, UnauthorizedError } from 'routing-controllers';



export const userCheckMiddleware = (...roles: string[]) => {

    function middle(request: Request, response: any, next?: (err?: any) => any): any {
        console.log('user check ...');
        const id = (request.user as any)?.id;
        if (id) {
            const userService = Container.get(UserService);
            userService.getById(id).
                then(x => {
                    if (x && x.isNormal()) {
                        console.log('user check ok ');
                        next();
                    } else {
                        next(new UnauthorizedError('user db check error'));
                    }
                })
                .catch(err => {
                    next(err);
                })
        } else {
            next(new UnauthorizedError('user not exist'));
        }

    }

    return middle;
}
