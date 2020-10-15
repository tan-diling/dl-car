import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi' ;
import { GroupService } from '@app/services/group.service'
import { ForbiddenError, UseBefore } from 'routing-controllers';
import { ProjectPermissionService } from '@app/services/projectPermission.service';
import { RequestOperation, RequestContext } from '@app/defines';
// async function checkGroupMember(userId,groupId)

export function checkGroupPermission(...roles:string[]) {
    function groupPermissionMiddleware(request: Request, response: any, next?: (err?: any) => any): any {
        console.log("group member check ...");
        const groupId:string = request.params?.group || request.params?.id ;
        const userId:string = (request.user as any).id ;
    
        const groupService = Container.get(GroupService);
    
        groupService.checkGroupMemberPermission(groupId,userId,...roles)
        .then( x=> {
            if(x) {
                next();
            } else {
                next(new ForbiddenError('group_forbidden')) ;
            }
        })
        .catch(reason=>{
            next(reason) ;
        }) ;
    }

    return groupPermissionMiddleware ;
}
