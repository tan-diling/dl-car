import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect, Put } from 'routing-controllers';

import * as moment from 'moment';
import { SiteRole, NotificationStatus } from '@app/defines';
import { NotificationStatusDto } from './dto/notification.dto';
import { Container } from 'typedi';
import { Types } from 'mongoose';
import { NotificationService } from '@app/services/notification';
import { stringify } from 'querystring';

@Authorized()
@JsonController('/notification')
export class NotificationController {
    constructor(private service: NotificationService) {
    }

    @Post('/status')
    async response(@Body() dto: NotificationStatusDto, @CurrentUser() currentUser) {
        for (const id of dto.ids) {
            await this.service.status({ id, userId: currentUser.id, status: dto.status });
        }

        return { count: dto.ids.length };
    }

    @Get('/my')
    async list(@QueryParams() query: any, @Req() request, @CurrentUser() currentUser) {
        // const {status,sender,time} = query ;
        return await this.service.list({
            status: [NotificationStatus.Read, NotificationStatus.Unread].join(','),
            ...query,
            receiver: Types.ObjectId(currentUser.id),
            populate: "event,event.sender",
            fields: "event.sender.name,event.sender.email,event.sender.image"
        });

        // return await this.service.list(query) ;
    }

    @Delete('/my')
    async clearMy(@CurrentUser() currentUser) {

        return await this.service.deleteAllByReceiver(currentUser.id);

    }

    @Put('/my')
    async setAllReadMy(@CurrentUser() currentUser) {

        return await this.service.setReadAllByReceiver(currentUser.id);

    }


}
