import { MethodNotAllowedError, InternalServerError } from 'routing-controllers';
import { SiteRole, ResourceType, RequestContext, RequestOperation, PermissionOperation } from '@app/defines';
import { PermissionPolicyModel, PermissionPolicy } from '@app/models/permission';
import { ProjectMemberModel, ResourceModel, CommentModel, ResourceRelatedBase, AttachmentModel, CheckListModel, EffortModel } from '@app/models';
import { Types } from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';

/**
 * Project Permission Service
 */
export class ProjectPermissionService {

    /**
     * project role permission check
     * @param ctx 
     */
    async checkPermission(ctx: RequestContext) {

        const checkMethodList = [this.checkSiteAdminPolicy, this.checkProjectCreatePolicy, this.checkRelatedPolicy, this.checkProjectRetrievePolicy, this.checkCurrentCURDPolicy];


        let checkResult = false;
        for (const func of checkMethodList) {
            checkResult = await func.bind(this)(ctx);
            if (checkResult != null) break;
        }
        return checkResult == true;

    }

    /**
     * check for site_role "admin"
     * @param ctx 
     */
    async checkSiteAdminPolicy(ctx: RequestContext) {

        if (ctx.user.role == SiteRole.Admin) return true;

    }

    async checkRelatedPolicy(ctx: RequestContext) {
        // if is entity relate object , check current user  it's if it is member
        let doc: DocumentType<ResourceRelatedBase> = null;
        switch (ctx.resourceType) {
            case ResourceType.Comment:
                doc = await CommentModel.findById(ctx.resourceId).exec();
                break;
            case ResourceType.Attachment:
                doc = await AttachmentModel.findById(ctx.resourceId).exec();
                break;

            case ResourceType.CheckList:
                doc = await CheckListModel.findById(ctx.resourceId).exec();
                break;
            case ResourceType.Effort:
                doc = await EffortModel.findById(ctx.resourceId).exec();
                break;
        }
        if (doc) {
            const resource = await ResourceModel.findById(doc.parent).exec();
            if (resource) {
                const members = await resource.getMembers();
                return members.some(x => x.deleted != true && String(x.userId) == ctx.user.id);
            }

            return false;
        }



    }

    /**
     * check for project create 
     * @param ctx 
     */
    async checkProjectCreatePolicy(ctx: RequestContext) {

        if (ctx.resourceType == ResourceType.Project && ctx.method == RequestOperation.CREATE) {
            return ctx.user.role != SiteRole.Visitor;
        }
    }

    /**
     * check for project retrieve 
     * @param ctx 
     */
    async checkProjectRetrievePolicy(ctx: RequestContext) {

        if (ctx.resourceType == ResourceType.Project && ctx.method == RequestOperation.RETRIEVE) {
            if (ctx.resourceId) {
                return true;
            } else {
                return ctx.filter.memberUserId == ctx.user.id;
            }
        }
    }

    /**
     * query policy by resource and project_role
     * @param filter 
     */
    async queryPolicy(filter: { resource: string, role: string }) {

        return await PermissionPolicyModel.findOne({ resource: filter.resource.toLowerCase(), role: filter.role.toLowerCase() }).exec();
    }

    /**
     * check input valid
     * @param ctx 
     * @param policy 
     */
    async validateInputField(ctx: RequestContext, policy: PermissionPolicy) {
        let checkResult = true;
        if (ctx.dto && policy.fields?.length) {
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

    /**
     * check request operation is allowed
     * @param ctx 
     * @param policy 
     */
    async checkPolicyScope(ctx: RequestContext, policy: PermissionPolicy) {
        if (policy == null) return false;

        const { scope, fields } = policy;
        let op = 0;
        if (ctx.method == RequestOperation.RETRIEVE) {
            op = PermissionOperation.Retrieve;
        }
        if (ctx.method == RequestOperation.CREATE) {
            op = PermissionOperation.Create;
        }
        if (ctx.method == RequestOperation.UPDATE) {
            op = PermissionOperation.Update;
        }
        if (ctx.method == RequestOperation.DELETE) {
            op = PermissionOperation.Delete;
        }

        if ((op & scope) == op) {
            return await this.validateInputField(ctx, policy);
        } else {
            return false;
        }
    }

    /**
     * check current 
     * @param ctx 
     */
    async checkCurrentCURDPolicy(ctx: RequestContext) {
        let resourceId = ctx.resourceId;
        if (!resourceId) {
            if (ctx.method == RequestOperation.CREATE) {
                resourceId = ctx.dto.parent;
            }

            if (ctx.method == RequestOperation.RETRIEVE) {
                resourceId = ctx.filter.parents || ctx.filter.parent;
            }
        }
        if (resourceId) {
            //check current
            const resource = await ResourceModel.findById(resourceId).exec();
            const projectId = resource?.parents?.[0] || resource?._id;
            const pm = await ProjectMemberModel.findOne({ projectId, userId: ctx.user.id }).exec();

            if (pm == null) return;

            const resourceType = ctx.resourceType || (resource as any).__t;

            const policy = await this.queryPolicy({ resource: resourceType, role: pm.projectRole });

            if (!policy) {
                return false;
            }

            if (await this.checkPolicyScope(ctx, policy)) {
                return true;
            }

            // check assign
            if (policy.scope & PermissionOperation.Assign) {
                const userObjectId = new Types.ObjectId(ctx.user.id);
                const where = { _id: ctx.resourceId, assignee: Types.ObjectId(ctx.user.id) };

                if (resource.assignees?.find(x => userObjectId == x)) {

                    const policy = await this.queryPolicy({ resource: ctx.resourceType, role: "assign" });

                    if (await this.checkPolicyScope(ctx, policy)) {
                        return true;
                    }

                }

            }

            // check inherit
            if (policy.scope & PermissionOperation.Inherit) {
                const parentId = Array(...(resource.parents)).pop();

                if (parentId) {
                    // const parentResource = await ResourceModel.findById(ctx.resourceId).exec();


                    if (await this.checkCurrentCURDPolicy({ ...ctx, resourceType: "", resourceId: String(parentId), dto: null })) {

                        const policy = await this.queryPolicy({ resource: resourceType, role: "assign" });


                        if (await this.checkPolicyScope(ctx, policy)) {
                            return true;
                        }

                    }

                }

            }
        }

    }

    async validatePermissionRole(projectId: Types.ObjectId, userId: Types.ObjectId, ...roles: string[]) {
        const pm = await ProjectMemberModel.findOne({ projectId, userId }).exec();

        if (pm) {
            if (roles.length == 0) return true;

            if (roles.includes(pm.projectRole)) {
                return true;
            };

        }

        return false;
    }

}