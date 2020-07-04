import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError } from 'routing-controllers';

import * as moment from 'moment';
import { UserCreateDto, UserUpdateDto, EmailExistDto } from './dto/user.dto';
import { UserService } from './user.service';

enum Operation{
    CREATE,
    RETRIEVE,
    UPDATE,
    DELETE,
}

interface IUser{role:string,id:string} ;

interface RequestContext{
  id?:string;
  dto:any;
} 

@JsonController()
export class UserController {
    constructor(private service: UserService) {
    }
    
    checkPermission(op:Operation,user,ctx:any){
        switch(op)
        {
            case Operation.CREATE:
                break ;
            case Operation.RETRIEVE:
                break ;
            case Operation.UPDATE:
                if((user?.role == 'admin') || (user?.id != ctx.id))
                    break ;
                throw new MethodNotAllowedError('permission Error') ;
                break ;
            case Operation.DELETE:
                if( user?.role == 'admin')
                    break ;
                throw new MethodNotAllowedError('permission Error') ;
            default:
                throw new InternalServerError('check permission error');
        }
    }

    @Post('/sign_up')
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
        if(users.length >0 ) return {register:true,emailValidated:users[0].emailValidated} ;

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
    async update(@Param('id') id:string, dto:UserUpdateDto,@CurrentUser() currentUser:IUser) {
        this.checkPermission(Operation.UPDATE,currentUser,{id,dto}) ;
        return await this.service.update(id,dto) ;
    }

    @Authorized('admin')
    @Delete('/user/:id([0-9a-f]{24})')
    async delete(@Param('id') id:string) {
        return await this.service.delete(id) ;
    }
}
