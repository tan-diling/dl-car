import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect, UseInterceptor } from 'routing-controllers';
import { ContactService } from '@app/services/contact.service';
import { ContactInvitationDto } from './dto/contact.dto';
import { notificationInterceptor } from '@app/middlewares/notification.interceptor';
import { NotificationTopic, NotificationAction } from '@app/defines';


@JsonController()
export class ContactController {
    constructor(private service: ContactService) {
    }


    @Authorized()
    @Get('/user/contact')
    async listContact(@QueryParams() query: any, @CurrentUser() currentUser) {
        // return await this.service.list({userId:currentUser.id,populate:'contact',...query}) ;
        return await this.service.listContactUser(currentUser.id);

    }

    @Authorized()
    @Delete('/user/contact/:id([0-9a-f]{24})')
    @UseInterceptor(notificationInterceptor(NotificationTopic.Contact, NotificationAction.Deleted))
    async deleteContact(@Param('id') id: string, @Req() request, @CurrentUser() currentUser) {
        return await this.service.delete(currentUser.id, id);
    }

    @Authorized()
    @Post('/user/contact/invitation/by_group/:id([0-9a-f]{24})')
    async inviteContactByGroup(@Param('id') id: string, @Req() request, @CurrentUser() currentUser) {
        return await this.service.inviteContactByGroup(currentUser.id, id);
    }

    @Authorized()
    @Post('/user/contact/invitation')
    async inviteContact(@Body() dto: ContactInvitationDto, @CurrentUser() currentUser) {
        return await this.service.inviteContact({ userId: currentUser.id, ...dto });
    }


}
