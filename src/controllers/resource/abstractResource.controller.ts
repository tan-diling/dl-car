import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect, UnauthorizedError, ForbiddenError } from 'routing-controllers';

import * as moment from 'moment';
import { Inject } from 'typedi';
import { RepoCRUDInterface, RequestContext, RepoOperation, RequestOperation, IRequestUser, ResourceType, isBaseResourceType } from '@app/defines';
import { ProjectPermissionService } from '@app/services/projectPermission.service';

interface QueryOptionInterface {
    populate?: string,
    limit?: number,
    offset?: number,
    sort?: string,
}
// const resourceType = 'project' ;
// @Authorized()
// @JsonController('/resource/'+resourceType)
export class AbstractResourceController {
    resourceType: string = '';

    queryOptions: { get?: QueryOptionInterface, list?: QueryOptionInterface } = {};

    @Inject()
    permissionService: ProjectPermissionService;

    repoService: RepoCRUDInterface;

    async checkPermission(ctx: RequestContext) {
        if (typeof (ctx.method) == typeof ('')) {
            return true;
        }

        return await this.permissionService.checkPermission(ctx);
    }

    async processRequest(ctx: RequestContext) {
        if (typeof (ctx.method) == typeof ('')) {
            const func = this.repoService[ctx.method];
            if (func) {
                return await func.bind(this.repoService)({ id: ctx.resourceId, ...(ctx.dto) });
            }
        }

        switch (ctx.method) {
            case RequestOperation.CREATE:
                return await this.repoService.create(ctx.dto);
                break;
            case RequestOperation.RETRIEVE:

                if (ctx.resourceId) {
                    const queryOptions = { ...this.queryOptions?.get, ...ctx.filter };
                    const { populate } = queryOptions;
                    if (populate) {
                        return await this.repoService.get({ _id: ctx.resourceId, populate });
                    }
                    return await this.repoService.get(ctx.resourceId);
                } else {
                    return await this.repoService.list(ctx.filter);
                }

                break;
            case RequestOperation.DELETE:
                return await this.repoService.delete(ctx.resourceId);
                break;
            case RequestOperation.UPDATE:
                return await this.repoService.update(ctx.resourceId, ctx.dto);
                break;
        }
    }

    async process(request: Request, ctx: Partial<RequestContext>) {
        const requestContext: RequestContext = {
            request,
            resourceType: this.resourceType,
            resourceId: request.query?.id as string,
            method: RequestOperation.RETRIEVE,
            user: request.user as IRequestUser,
            filter: request.query,
            dto: request.body,
            ...ctx,
        };

        if (true !== await this.checkPermission(requestContext)) {
            throw new ForbiddenError('resource_permission_forbidden');
        }

        const result = await this.processRequest(requestContext);
        request.res.locals = { result };
        return result;

    }
}

export class AbstractResourceRelatedController extends AbstractResourceController {

    private async getResourceBaseInfo(id) {
        const resource = await this.repoService.get(id);
        return {
            resourceId: resource._id,
            resourceType: resource.type,
        }
    }

    async checkPermission(ctx: RequestContext) {
        let _ctx: RequestContext = { ...ctx, resourceId: undefined, resourceType: undefined };
        switch (ctx.method) {
            case RequestOperation.CREATE:
                _ctx.resourceId = ctx.dto.parent;
                _ctx.method = RequestOperation.RETRIEVE;
                break;
            case RequestOperation.UPDATE:
            case RequestOperation.DELETE:

                const baseInfo = await this.getResourceBaseInfo(ctx.resourceId);

                _ctx = { ..._ctx, ...baseInfo, method: RequestOperation.RETRIEVE };
                break;
            case RequestOperation.RETRIEVE:
                _ctx.method = RequestOperation.RETRIEVE;
                if (ctx.filter?.parent) {
                    _ctx.resourceId = ctx.filter.parent;
                }

                if (ctx.resourceId) {
                    const baseInfo = await this.getResourceBaseInfo(ctx.resourceId);
                    _ctx = { ..._ctx, ...baseInfo };
                }
                _ctx.method = RequestOperation.RETRIEVE;
                break;
        }

        return await this.permissionService.checkPermission(_ctx);
    }
}