import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi' ;
import { GroupService } from '@app/services/group.service'
import { ForbiddenError, UseBefore } from 'routing-controllers';
import { ProjectPermissionService } from '@app/services/projectPermission.service';
import { RequestOperation, RequestContext } from '@app/defines';
// async function checkGroupMember(userId,groupId)


export function checkResourcePermission(resourceType:string,method:RequestOperation) {
    function resourcePermissionMiddleware(request: Request, response: any, next?: (err?: any) => any): any {
        console.log("resource permission check ...");
        const resourceId:string = request.params?.resource || request.params?.id ;
        // const userId:string = (request.user as any).id ;
    
        const service = Container.get(ProjectPermissionService);

        const ctx :RequestContext= {
            method,
            request,
            resourceType,
            resourceId,
            user:request.user as any,
            filter:request.query,
            dto:request.body,    
            
        }
    
        service.checkPermission(ctx)
        .then( x=> {
            if(x) {
                next();
            } else {
                next(new ForbiddenError('resource_forbidden')) ;
            }
        })
        .catch(reason=>{
            next(reason) ;
        }) ;
    }

    return resourcePermissionMiddleware ;
}