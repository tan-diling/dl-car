import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { GroupService } from '@app/services/group.service'
import { ForbiddenError, UseBefore } from 'routing-controllers';
import { ProjectPermissionService } from '@app/services/projectPermission.service';
import { RequestOperation, RequestContext, SiteRole, ResourceType, GroupRole } from '@app/defines';
import { jwtAuthenticate } from './jwt.middleware';
import { userCheckMiddleware } from './userCheck.middleware';
import { checkGroupPermission } from './groupPermission.middleware';
import { checkResourcePermission } from './resourcePermission.middleware';
type PermissionType = 'admin' | 'user' | 'contact' | 'group' | ResourceType;
export function checkPermission(options: { id?: string, type?: PermissionType, method?: RequestOperation, } = {}) {
    switch (options.type) {
        case 'admin':
            return [jwtAuthenticate, userCheckMiddleware(SiteRole.Admin)];
        case 'user':
        case 'contact':
            return [jwtAuthenticate, userCheckMiddleware()];
        case 'group':
            {
                if (options.method != RequestOperation.RETRIEVE) {
                    return checkGroupPermission(GroupRole.Admin);
                } else {
                    return checkGroupPermission();
                }
            }
        default:
            if (ResourceType[options.type] != null) {
                return checkResourcePermission(options);
            }
    }
}
