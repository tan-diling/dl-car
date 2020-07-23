import { RequestContext, Operation } from './dto/types';
import { MethodNotAllowedError, InternalServerError } from 'routing-controllers';

export class PermissionService {
    
    checkPermission(ctx:RequestContext){
        

        switch(ctx.method)
        {
            case Operation.CREATE:
                break ;
            case Operation.RETRIEVE:
                break ;
            case Operation.UPDATE:
                // 'admin' site_user can update all
                if (ctx.user?.role == 'admin')
                    return ;

                // other site_user can update his/her self information
                if( ctx.user?.id != ctx.filter?.id)                    
                    throw new MethodNotAllowedError('permission_forbidden') ;

                // user info:"role" , "defaultContact" maintained by 'admin'
                if( ctx.dto?.role != null || ctx.dto?.defaultContact != null)                    
                    throw new MethodNotAllowedError('permission_forbidden') ;
                break ;
            case Operation.DELETE:   
                if( ctx.user?.id == ctx.filter?.id )              
                    throw new MethodNotAllowedError('permission_forbidden') ;
                break ;
            default:
                throw new InternalServerError('operation_error');
        }
    }

 
}