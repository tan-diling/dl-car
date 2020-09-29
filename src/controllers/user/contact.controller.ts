import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect } from 'routing-controllers';
import { ContactService } from '@app/services/contact.service';


@JsonController()
export class ContactController {
    constructor(private service: ContactService) {
    }
  

    @Authorized()
    @Get('/user/contact')
    async listContact(@QueryParams() query: any, @CurrentUser() currentUser) {
        // return await this.service.list({userId:currentUser.id,populate:'contact',...query}) ;
        return await this.service.listContact(currentUser.id) ;
        
    }

    @Authorized()
    @Delete('/user/contact/:id([0-9a-f]{24})')
    async deleteContact(@Param('id') id:string,@Req() request,@CurrentUser() currentUser) {
        return await this.service.delete(currentUser.id,id) ;
    }

}
