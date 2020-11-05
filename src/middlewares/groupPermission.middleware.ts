import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { GroupService } from '@app/services/group.service'
import { ForbiddenError, UseBefore } from 'routing-controllers';
import { ProjectPermissionService } from '@app/services/projectPermission.service';
import { RequestOperation, RequestContext, SiteRole } from '@app/defines';
import { jwtAuthenticate } from './jwt.middleware';
import { userCheckMiddleware } from './userCheck.middleware';

export function checkGroupPermission(...roles: string[]) {
    function groupPermissionMiddleware(request: Request, response: any, next?: (err?: any) => any): any {
        const currentUser: any = request.user;
        console.log("group member check ...");
        if (currentUser.role == SiteRole.Admin) {
            return next();
        }
        const groupId: string = request.params?.group || request.params?.id;
        const userId: string = (request.user as any).id;

        const groupService = Container.get(GroupService);

        groupService.checkGroupMemberPermission(groupId, userId, ...roles)
            .then(x => {
                if (x) {
                    next();
                } else {
                    next(new ForbiddenError('group_forbidden'));
                }
            })
            .catch(reason => {
                next(reason);
            });
    }

    return [jwtAuthenticate, userCheckMiddleware(), groupPermissionMiddleware];
}
