import { RequestContext, Operation } from './dto/types';
import { MethodNotAllowedError, InternalServerError } from 'routing-controllers';
import { SiteRole, ResourceType } from '../constant';

export class PermissionService {
    
    async checkPermission(ctx:RequestContext){

        const checkMethodList = [this.checkSiteAdminPolicy,this.checkProjectCreatePolicy,this.checkCurrentCURDPolicy] ;

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

        if(ctx.resourceType != ResourceType.Project) 

            return ctx.user.role != SiteRole.Visitor ;
        
    }
 
    async checkCurrentCURDPolicy(ctx:RequestContext){
        
        return false ;
        
    }

}