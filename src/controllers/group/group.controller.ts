import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect } from 'routing-controllers';

import * as moment from 'moment';
import { GroupUpdateDto, GroupCreateDto } from './dto/group.dto';
import { GroupService } from './group.service';

enum Operation{
    CREATE,
    RETRIEVE,
    UPDATE,
    DELETE,
}

interface IUser{role:string,id:string} ;

interface RequestContext{
    request:Request,
    method:Operation,
    user?:IUser;
    filter?:{id:string}|any;  
    dto?:any;    
} 

@Authorized()
@JsonController('/group')
export class GroupController {
    constructor(private service: GroupService) {
    }
    
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
                    throw new MethodNotAllowedError('permission check error') ;

                // user info:"role" , "defaultContact" maintained by 'admin'
                if( ctx.dto?.role != null || ctx.dto?.defaultContact != null)                    
                    throw new MethodNotAllowedError('permission check error') ;
                break ;
            case Operation.DELETE:   
                if( ctx.user?.id == ctx.filter?.id )              
                    throw new MethodNotAllowedError('permission check: cannot delete self') ;
                break ;
            default:
                throw new InternalServerError('check permission error');
        }
    }

    async processRequest(ctx:RequestContext){
        this.checkPermission(ctx) ;
        switch(ctx.method){
            case Operation.CREATE:
                return await this.service.create(ctx.dto) ;
                break ;
            case Operation.RETRIEVE:
                return await this.service.list(ctx.filter) ;
                break ;
            case Operation.DELETE:
                return await this.service.delete(ctx.filter.id) ;
                break ;
            case Operation.UPDATE:
                return await this.service.update(ctx.filter.id,ctx.dto) ;
                break ;                
        }
    }
    
    @Post()
    async create(@Body() dto:GroupCreateDto,@Req() request,@CurrentUser() currentUser) {        
        return await this.processRequest({
            request,
            method:Operation.CREATE,
            user:currentUser,
            filter:query,
            dto:{owner:currentUser.id,email:currentUser.email,...dto}
        }) ;
        
    }
    
    @Get()
    async list(@QueryParams() query:any, @Req() request,@CurrentUser() currentUser:IUser) {
        return await this.processRequest({
            request,
            method:Operation.RETRIEVE,
            user:currentUser,
            filter:query,
            // dto
        }) ;
        
        // return await this.service.list(query) ;
    }
        
    @Patch('/:id([0-9a-f]{24})')
    async update(@Param('id') id:string, @Body() dto:GroupUpdateDto, @Req() request, @CurrentUser() currentUser:IUser) {
        return await this.processRequest({
            request,
            method:Operation.UPDATE,
            user:currentUser,
            filter:{id},
            dto
        }) ;
        // return await this.service.update(id,dto) ;
    }

    @Delete('/:id([0-9a-f]{24})')
    async delete(@Param('id') id:string,@Req() request, @CurrentUser() currentUser:IUser) {
        return await this.processRequest({
            request,
            method:Operation.DELETE,
            user:currentUser,
            filter:{id},
            // dto
        }) ;
        // return await this.service.delete(id) ;
    }
}
