import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect, UnauthorizedError, ForbiddenError } from 'routing-controllers';

import * as moment from 'moment';
import { Inject } from 'typedi';
import {  RepoCRUDInterface, RequestContext, RepoOperation, RequestOperation, IRequestUser } from '@app/defines';
import { ProjectPermissionService } from '@app/services/projectPermission.service';

// const resourceType = 'project' ;
// @Authorized()
// @JsonController('/resource/'+resourceType)
export class AbstractResourceController {
    resourceType:string ='';

    @Inject()
    permissionService:ProjectPermissionService ;

    repoService:RepoCRUDInterface ;

    async checkPermission(ctx:RequestContext){
        if(typeof(ctx.method) == typeof('') ){
            return true ;
        }
        
        return await this.permissionService.checkPermission(ctx) ;
    }

    async processRequest(ctx:RequestContext){
        if(typeof(ctx.method) == typeof('') ){
            const func = this.repoService[ctx.method] ;
            if(func){
                return await func.bind(this.repoService)({id:ctx.resourceId,...(ctx.dto)}) ;
            }    
        }
       
        switch(ctx.method){
            case RequestOperation.CREATE:
                return await this.repoService.create(ctx.dto) ;
                break ;
            case RequestOperation.RETRIEVE:
                if(ctx.resourceId){
                    const {populate} = ctx.filter ;
                    if(populate){
                        return await this.repoService.get({_id:ctx.resourceId,populate}) ;
                    }
                    return await this.repoService.get(ctx.resourceId) ;
                }else {
                    return await this.repoService.list(ctx.filter) ;
                }
                
                break ;
            case RequestOperation.DELETE:
                return await this.repoService.delete(ctx.resourceId) ;
                break ;
            case RequestOperation.UPDATE:
                return await this.repoService.update(ctx.resourceId,ctx.dto) ;
                break ;                
        }
    }

    async process(request:Request,ctx:Partial<RequestContext> ){
        const requestContext :RequestContext =  {
            request,
            resourceType:this.resourceType,
            resourceId:request.query?.id as string  ,
            method:RequestOperation.RETRIEVE,
            user: request.user as IRequestUser,
            filter:request.query,
            dto : request.body ,
            ...ctx,
        };

        if(true !== await this.checkPermission(requestContext)){
            throw new ForbiddenError('resource_permission_forbidden') ;
        }

        return await this.processRequest(requestContext) ;

    } 
}
