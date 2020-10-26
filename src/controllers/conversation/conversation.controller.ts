import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect, OnNull, OnUndefined } from 'routing-controllers';

import * as moment from 'moment';
import { SiteRole, RequestContext, RequestOperation } from '@app/defines';
import { ConversationService } from '@app/services';
import { ConversationDto, ConversationUserDto, UpdateConversationDto } from './dto/conversation.dto';



@Authorized()
@JsonController('/conversation')
export class ConversationController {
    constructor(private service: ConversationService) {
    }



    @Post('/group')
    async createGroup(@Body() dto: ConversationDto, @Req() request) {
        const conversation = await this.service.createGroupConversation({ title: dto.title, image: dto.image });
        await this.service.appendMember(conversation._id, [request.user.id, ...dto.users], request.user.id);
        return await this.getById(conversation._id);
    }

    @Post('/user')
    async createUser(@Body() dto: ConversationUserDto, @Req() request) {
        const conversation = await this.service.getUserConversation(dto.user, request.user.id);
        return await this.getById(conversation._id);
    }

    @Get('/my')
    async myList(@Req() request) {
        return await this.service.listByUser(request.user.id);
    }

    @Get('/message')
    async myMessageList(@Req() request) {
        return await this.service.listMessage(request.query);
    }

    @Get('/:id([0-9a-f]{24})')
    async getById(@Param('id') id: string) {
        return await this.service.getById(id);
    }


    @Patch('/:id([0-9a-f]{24})')
    async update(@Param('id') id: string, @Body() dto: UpdateConversationDto, @Req() request, @CurrentUser() currentUser) {
        await this.service.updateConversation(id, dto);
        return await this.getById(id);
    }

    @Post('/:id([0-9a-f]{24})/member')
    async appendMember(@Param('id') id: string, @Body() dto: ConversationUserDto, @Req() request, @CurrentUser() currentUser) {
        await this.service.appendMember(id, [dto.user], currentUser.id);
        return await this.getById(id);
    }

    @Delete('/:id([0-9a-f]{24})/member')
    async removeMember(@Param('id') id: string, @Body() dto: ConversationUserDto, @Req() request, @CurrentUser() currentUser) {
        await this.service.removeMember(id, [dto.user], currentUser.id);
        return await this.getById(id);
    }


}
