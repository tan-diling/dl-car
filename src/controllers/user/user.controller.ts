import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect } from 'routing-controllers';

import * as moment from 'moment';
import { UserCreateDto, UserUpdateDto, EmailExistDto, VisitorUserCreateDto, ChangePasswordDto } from './dto/user.dto';
import { UserService } from './user.service';

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

@JsonController()
export class UserController {
    constructor(private service: UserService) {
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

    @Post('/sign_up')
    async signUp(@Body() dto:VisitorUserCreateDto) {
        return await this.service.create(dto) ;
    }

    @Authorized('admin')
    @Post('/user')
    async create(@Body() dto:UserCreateDto) {        
        return await this.service.create(dto) ;
    }


    @Get('/user/email_validate')
    @Redirect('/login')
    async emailValidate(@QueryParam('id') id:string, @QueryParam('email') email:string){
        await this.service.validateEmail({id,email}) ;        
    }

    @Post('/user/email_exists')
    async emailExists(@Body() dto:EmailExistDto){
        const users = await this.service.list({filter:{email:dto.email}}) ;
        if(users.length >0 ) 
            return {register:true} ;

        return {register:false} ;
    }

    @Post('/change_password')
    async changePassword(@Body() dto:ChangePasswordDto) {
        return await this.service.changePassword(dto) ;            
    }

    @Authorized()
    @Get('/user')
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

    // @Authorized()
    // @Get('/user/:id([0-9a-f]{24})')
    // async get(@Param('id') id:string,) {
    //     return await this.processRequest({
    //         method:Operation.RETRIEVE,
    //         // user:currentUser,
    //         filter:{id},
    //         // dto
    //     }) ;
        
    //     return await this.service.getById(id) ;
    // }

    @Authorized()
    @Patch('/user/:id([0-9a-f]{24})')
    async update(@Param('id') id:string, @Body() dto:UserUpdateDto, @Req() request, @CurrentUser() currentUser:IUser) {
        return await this.processRequest({
            request,
            method:Operation.UPDATE,
            user:currentUser,
            filter:{id},
            dto
        }) ;
        // return await this.service.update(id,dto) ;
    }

    @Authorized('admin')
    @Delete('/user/:id([0-9a-f]{24})')
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