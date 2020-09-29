import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect } from 'routing-controllers';

import * as moment from 'moment';
import { SiteRole } from '@app/defines';
import { ActionService } from '@app/services/action.service';
import { ContactInvitationDto, ActionStatusDto } from './dto/invitation.dto';
import { ContactService } from '@app/services/contact.service';
import { Container } from 'typedi';

@Authorized()
@JsonController('/action')
export class ActionController {
    private contactService = Container.get(ContactService)
    constructor(private service: ActionService) {
    }

    @Post('/invitation/contact')
    async inviteContact(@Body() dto:ContactInvitationDto,@CurrentUser() currentUser) {
        return await this.contactService.inviteContact({userId:currentUser.id,...dto}) ;
    }

    @Post('/:id([0-9a-f]{24})/status')
    async response(@Param('id') id:string,@Body() dto:ActionStatusDto,@CurrentUser() currentUser) {
        return await this.service.status({id,userId:currentUser.id, ...dto}) ;
    }

    @Get('')
    async list(@QueryParams() query:any, @Req() request,@CurrentUser() currentUser) {
        return await this.service.list({
            ...query,
            receiver:currentUser.id,
        }) ;
        
        // return await this.service.list(query) ;
    }


}
