import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect } from 'routing-controllers';

import * as moment from 'moment';
import { Inject } from 'typedi';
import { RequestContext, RepoCRUDInterface, Operation, IUser } from './dto/types';
import { PermissionService } from './permission.service';

// const resourceType = 'project' ;
// @Authorized()
// @JsonController('/resource/'+resourceType)
export class AbstractResourceController {
    private resourceType:string ='';

    @Inject()
    private permissionService:PermissionService ;

    private repoService:RepoCRUDInterface ;

    checkPermission(ctx:RequestContext){
        return this.permissionService.checkPermission(ctx) ;
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
                return await this.repoService.delete(ctx.filter.id) ;
                break ;
            case Operation.UPDATE:
                return await this.repoService.update(ctx.filter.id,ctx.dto) ;
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

        this.checkPermission(requestContext) ;

        return this.processRequest(requestContext) ;
    }

    
    
    @Post()
    async create(@Body() dto, @Req() request) {  
        
        return await this.process(request,{
            method:Operation.CREATE,
            dto
        }) ;
    }
    
    @Get()
    async list(@QueryParams() query:any, @Req() request) {
        return await this.process(request,{       
            method:Operation.RETRIEVE,
            filter:query,
            // dto
        }) ;
        
        // return await this.service.list(query) ;
    }

    
    @Patch('/:id([0-9a-f]{24})')
    async update(@Param('id') id:string, @Req() request, ) {
        return await this.process(request,{         
            resourceId: id,
            method:Operation.UPDATE,            
        }) ;
        // return await this.service.update(id,dto) ;
    }


    @Delete('/:id([0-9a-f]{24})')
    async delete(@Param('id') id:string,@Req() request,) {
        return await this.process(request,{           
            resourceId: id,
            method:Operation.DELETE,            
        }) ;
        // return await this.service.delete(id) ;
    }
}
