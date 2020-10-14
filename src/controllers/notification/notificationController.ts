import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect } from 'routing-controllers';

import * as moment from 'moment';
import { SiteRole } from '@app/defines';
import { NotificationStatusDto } from './dto/notification.dto';
import { Container } from 'typedi';
import { Types } from 'mongoose';
import { NotificationService } from '@app/services/notification';

@Authorized()
@JsonController('/notification')
export class NotificationController {
    constructor(private service: NotificationService) {
    }

    @Post('/status')
    async response(@Body() dto:NotificationStatusDto,@CurrentUser() currentUser) {
        for(const id of dto.ids){
          await this.service.status({id,userId:currentUser.id, status: dto.status}) ;
        }

        return { count: dto.ids.length };
    }

    @Get('')
    async list(@QueryParams() query:any, @Req() request,@CurrentUser() currentUser) {
        // const {status,sender,time} = query ;
        return await this.service.list({
            ...query,
            receiver:Types.ObjectId(currentUser.id),  
            populate:"event,event.sender",
            fields:"event.sender.name,event.sender.email,event.sender.image"          
        }) ;
        
        // return await this.service.list(query) ;
    }

    // @Get('/pending')
    // async pendingList(@QueryParams() query:any, @Req() request:Request,@CurrentUser() currentUser) {
    //     console.log(query) ;
    //     return await this.service.list({
    //         ...query,
    //         status:"0",            
    //     }) ;
        
    //     // return await this.service.list(query) ;
    // }


}
