import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect, UseInterceptor } from 'routing-controllers';

import * as moment from 'moment';
import { SiteRole, NotificationTopic, NotificationAction } from '@app/defines';
import { ActionService } from '@app/services/action.service';
import { ActionStatusDto } from './dto/action.dto';
import { ContactService } from '@app/services/contact.service';
import { Container } from 'typedi';
import { Types } from 'mongoose';

import { notificationInterceptor } from '@app/middlewares/notification.interceptor';

@Authorized()
@JsonController('/action')
export class ActionController {
    constructor(private service: ActionService) {
    }


    @UseInterceptor(notificationInterceptor(NotificationTopic.Invitation, NotificationAction.Status))
    @Post('/:id([0-9a-f]{24})/status')
    async response(@Param('id') id: string, @Body() dto: ActionStatusDto, @CurrentUser() currentUser) {
        return await this.service.status({ id, userId: currentUser.id, ...dto });
    }

    @Get('')
    async list(@QueryParams() query: any, @Req() request, @CurrentUser() currentUser) {
        const { status, sender, time } = query;
        return await this.service.list({
            status, sender,
            receiver: Types.ObjectId(currentUser.id),
            populate: "sender",
        });

        // return await this.service.list(query) ;
    }

    @Get('/pending')
    async pendingList(@QueryParams() query: any, @Req() request: Request, @CurrentUser() currentUser) {
        console.log(query);
        return await this.service.list({
            ...query,
            status: "0",
        });

        // return await this.service.list(query) ;
    }


}
