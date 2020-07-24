import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect, UnauthorizedError, ForbiddenError } from 'routing-controllers';

import * as moment from 'moment';
import { Inject } from 'typedi';
import { RequestContext, RepoCRUDInterface, Operation, IUser } from './dto/types';
import { PermissionService } from './permission.service';

// const resourceType = 'project' ;
// @Authorized()
// @JsonController('/resource/'+resourceType)
export class AbstractResourceController {
    resourceType:string ='';

    @Inject()
    permissionService:PermissionService ;

    repoService:RepoCRUDInterface ;

    async checkPermission(ctx:RequestContext){
        return await this.permissionService.checkPermission(ctx) ;
    }

    async processRequest(ctx:RequestContext){
       
        switch(ctx.method){
            case Operation.CREATE:
                return await this.repoService.create(ctx.dto) ;
                break ;
            case Operation.RETRIEVE:
                return await this.repoService.list(ctx.filter) ;
                break ;
            case Operation.DELETE:
                return await this.repoService.delete(ctx.resourceId) ;
                break ;
            case Operation.UPDATE:
                return await this.repoService.update(ctx.resourceId,ctx.dto) ;
                break ;                
        }
    }

    async process(request:Request,ctx:Partial<RequestContext> ){
        const requestContext =  {
            request,
            resourceType:this.resourceType,
            resourceId:String(request.query?.id) ,
            method:Operation.RETRIEVE,
            user:request.user as IUser,
            filter:request.query,
            dto : request.body ,
            ...ctx,
        };

        if(true !== await this.checkPermission(requestContext))
            throw new ForbiddenError('resource_permission_forbidden') ;

        return await this.processRequest(requestContext) ;
    }

 
}
