import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError } from 'routing-controllers';

import * as moment from 'moment';
import { UserCreateDto, UserUpdateDto, EmailExistDto, VisitorUserCreateDto } from './dto/user.dto';
import { UserService } from './user.service';

enum Operation{
    CREATE,
    RETRIEVE,
    UPDATE,
    DELETE,
}

interface IUser{role:string,id:string} ;

interface RequestContext{
  method:Operation,
  user?:IUser;
  filter?:any;  
  dto?:any;    
} 

@JsonController()
export class UserController {
    constructor(private service: UserService) {
    }
    
    checkPermission(ctx:RequestContext){
        if (ctx.user?.role == 'admin')
            return ;

        switch(ctx.method)
        {
            case Operation.CREATE:
                break ;
            case Operation.RETRIEVE:
                break ;
            case Operation.UPDATE:
                if( ctx.user?.id != ctx.filter?.id)                    
                    throw new MethodNotAllowedError('permission check error') ;

                if( ctx.dto?.role != null || ctx.dto?.defaultContact != null)                    
                    throw new MethodNotAllowedError('permission check error') ;
                break ;
            case Operation.DELETE:                
                throw new MethodNotAllowedError('permission Error') ;
            default:
                throw new InternalServerError('check permission error');
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
    async emailValidate(@QueryParam('id') id:string, @QueryParam('email') email:string){
        return await this.service.validateEmail({id,email}) ;
    }

    @Post('/user/email_exists')
    async emailExists(@Body() dto:EmailExistDto){
        const users = await this.service.list({filter:{email:dto.email}}) ;
        if(users.length >0 ) 
            return {register:true} ;

        return {register:false} ;
    }

    @Authorized()
    @Get('/user')
    async list(@QueryParams() query:any,@CurrentUser() currentUser:IUser) {
        return await this.service.list(query) ;
    }

    @Authorized()
    @Get('/user/:id([0-9a-f]{24})')
    async get(@Param('id') id:string,) {
        return await this.service.getById(id) ;
    }

    @Authorized()
    @Patch('/user/:id([0-9a-f]{24})')
    async update(@Param('id') id:string, @Body() dto:UserUpdateDto, @CurrentUser() currentUser:IUser) {
        this.checkPermission({
            method:Operation.UPDATE,
            user:currentUser,
            filter:{id},
            dto
        }) ;
        return await this.service.update(id,dto) ;
    }

    @Authorized('admin')
    @Delete('/user/:id([0-9a-f]{24})')
    async delete(@Param('id') id:string) {
        return await this.service.delete(id) ;
    }
}
