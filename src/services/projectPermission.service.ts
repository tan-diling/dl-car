import { MethodNotAllowedError, InternalServerError } from 'routing-controllers';
import { SiteRole, ResourceType, RequestContext, RequestOperation, PermissionOperation } from '@app/defines';
import { PermissionPolicyModel, PermissionPolicy } from '@app/models/permission';
import { ProjectMemberModel, ResourceModel } from '@app/models/project';
import { Types } from 'mongoose';

export class ProjectPermissionService {

    async checkPermission(ctx: RequestContext) {

        const checkMethodList = [this.checkSiteAdminPolicy, this.checkProjectCreatePolicy, this.checkProjectRetrievePolicy, this.checkCurrentCURDPolicy];

        let checkResult = false;
        for (const func of checkMethodList) {
            checkResult = await func.bind(this)(ctx);
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

    async checkSiteAdminPolicy(ctx: RequestContext) {

        if (ctx.user.role == SiteRole.Admin) return true;

    }

    async checkProjectCreatePolicy(ctx: RequestContext) {

        if (ctx.resourceType == ResourceType.Project && ctx.method == RequestOperation.CREATE) {
            return ctx.user.role != SiteRole.Visitor;
        }
    }


    async checkProjectRetrievePolicy(ctx: RequestContext) {

        if (ctx.resourceType == ResourceType.Project && ctx.method == RequestOperation.RETRIEVE) {
            return ctx.filter.memberUserId == ctx.user.id;
        }
    }

    async queryPolicy(filter: { resource, role }) {

        return await PermissionPolicyModel.findOne(filter).exec();
    }

    async validateInputField(ctx: RequestContext, policy: PermissionPolicy) {
        let checkResult = true;
        if (ctx.dto  &&  policy.fields?.length ) {
            const op: number = Number(ctx.method);
            const allowFields = policy.fields.filter(x => (x.policy & op) == op).map(x => x.name);
            for (const fieldName in Object.keys(ctx.dto)) {
                if (!allowFields.includes(fieldName)) {
                    checkResult = false;
                    break;
                }
            }
        }
        return checkResult;

    }

    async checkPolicyScope(ctx: RequestContext, policy: PermissionPolicy) {
        if (policy == null) return false;

        const { scope, fields } = policy;
        const op: number = Number(ctx.method);

        if ((op & scope) == op) {
            return await this.validateInputField(ctx, policy);
        } else {
            return false;
        }
    }

    async checkCurrentCURDPolicy(ctx: RequestContext) {
        if (ctx.resourceId) {
            //check current
            const resource = await ResourceModel.findById(ctx.resourceId).exec();
            const projectId = resource?.parent?.[0] || resource?._id;
            const pm = await ProjectMemberModel.findOne({ projectId, userId: ctx.user.id }).exec();

            if (pm == null) return;

            const resourceType =ctx.resourceType ||  (resource as any).__t;

            const policy = await this.queryPolicy({ resource:resourceType, role: pm.projectRole });

            if (!policy) {
                return false;
            }

            if (await this.checkPolicyScope(ctx, policy)) {
                return true;
            }

            // check assign
            if (policy.scope & PermissionOperation.Assign) {
                const where = { _id: ctx.resourceId, assignee: Types.ObjectId(ctx.user.id) };

                if (resource.assignee?.find( x => Types.ObjectId(ctx.user.id).equals(x) ) ) {

                    const policy = await this.queryPolicy({ resource: ctx.resourceType, role: "assign" });

                    if (await this.checkPolicyScope(ctx, policy)) {
                        return true;
                    }

                }

            }

            // check inherit
            if (policy.scope & PermissionOperation.Inherit ) {
                const parentId = Array(...(resource.parent)).pop() ;

                if (parentId) {
                    // const parentResource = await ResourceModel.findById(ctx.resourceId).exec();


                    if (await this.checkCurrentCURDPolicy({...ctx, resourceType:"" ,resourceId:String(parentId),dto:null})) {

                        const policy = await this.queryPolicy({ resource:resourceType, role: "assign" });


                        if (await this.checkPolicyScope(ctx, policy)) {
                            return true;
                        }
                        
                    }

                }

            }
        }

    }

}