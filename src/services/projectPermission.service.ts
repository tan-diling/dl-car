import { MethodNotAllowedError, InternalServerError } from 'routing-controllers';
import { SiteRole, ResourceType, RequestContext, RequestOperation } from '@app/defines';
import { PermissionPolicyModel } from '@app/models/permission';
import { ProjectMemberModel } from '@app/models/project';

export class ProjectPermissionService {
    
    async checkPermission(ctx:RequestContext){

        const checkMethodList = [this.checkSiteAdminPolicy,this.checkProjectCreatePolicy,this.checkProjectRetrievePolicy,this.checkCurrentCURDPolicy] ;

        let checkResult = false ;
        for(const func of checkMethodList){
            checkResult = await func(ctx) ;
            if (checkResult != null) break;
        }
        return checkResult == true;
        

        // switch(ctx.method)
        // {
        //     case Operation.CREATE:
        //         break ;
        //     case Operation.RETRIEVE:
        //         break ;
        //     case Operation.UPDATE:
        //         // 'admin' site_user can update all
        //         if (ctx.user?.role == 'admin')
        //             return ;

        //         // other site_user can update his/her self information
        //         if( ctx.user?.id != ctx.filter?.id)                    
        //             throw new MethodNotAllowedError('permission_forbidden') ;

        //         // user info:"role" , "defaultContact" maintained by 'admin'
        //         if( ctx.dto?.role != null || ctx.dto?.defaultContact != null)                    
        //             throw new MethodNotAllowedError('permission_forbidden') ;
        //         break ;
        //     case Operation.DELETE:   
        //         if( ctx.user?.id == ctx.filter?.id )              
        //             throw new MethodNotAllowedError('permission_forbidden') ;
        //         break ;
        //     default:
        //         throw new InternalServerError('operation_error');
        // }
    }

    async checkSiteAdminPolicy(ctx:RequestContext){

        if(ctx.user.role == SiteRole.Admin ) return true ;

    }

    async checkProjectCreatePolicy(ctx:RequestContext){

        if(ctx.resourceType == ResourceType.Project && ctx.method == RequestOperation.CREATE) {
            return ctx.user.role != SiteRole.Visitor ;        
        }
    }


    async checkProjectRetrievePolicy(ctx:RequestContext){

        if(ctx.resourceType == ResourceType.Project && ctx.method == RequestOperation.RETRIEVE) {
            return ctx.filter.memberUserId==ctx.user.id ;        
        }      
    }

    async queryPolicy(ctx:RequestContext){
        const projectId :any = ctx.resourceId ;
        const pm = await ProjectMemberModel.findOne({projectId,userId:ctx.user.id}) ;
        if(pm){
            return await PermissionPolicyModel.findOne({resource: ctx.resourceType,role:pm.projectRole}).exec();
        }
        
    }
 
    async checkCurrentCURDPolicy(ctx:RequestContext){

        const permissionPolicy = await this.queryPolicy(ctx) ;
        
        return false ;
        
    }

}