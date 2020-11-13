import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect, OnNull, OnUndefined, UseBefore, UseInterceptor } from 'routing-controllers';

import * as moment from 'moment';
import { GroupUpdateDto, GroupCreateDto, CreateGroupMemberDto, DeleteGroupMemberDto, GroupMemberInvitedResponseDto } from './dto/group.dto';
import { GroupService } from '../../services/group.service';
import { SiteRole, RequestContext, RequestOperation, GroupRole, NotificationTopic, NotificationAction } from '@app/defines';
import { checkGroupPermission } from '@app/middlewares/groupPermission.middleware';
import { notificationInterceptor } from '@app/middlewares/notification.interceptor';


const resourceType = 'group';

@JsonController('/group')
export class GroupController {
    constructor(private service: GroupService) {
    }


    @Authorized()
    @Post()
    @UseInterceptor(notificationInterceptor(NotificationTopic.Group, NotificationAction.Created))
    async create(@Body() dto: GroupCreateDto, @Req() request, @CurrentUser() currentUser) {
        return await this.service.create({ owner: currentUser.id, ...dto });

    }

    @Authorized(SiteRole.Admin)
    @Get()
    async list(@QueryParams() query: any, @Req() request, @CurrentUser() currentUser) {
        return await this.service.list(query);
    }

    @Authorized()
    @Get('/by_member')
    async listByMember(@QueryParams() query: any, @Req() request, ) {
        return await this.service.listByMember(request.user.id, query);
    }

    @Authorized()
    @Get('/related_member')
    async relatedMember(@QueryParams() query: any, @Req() request) {
        return await this.service.relatedMember({ userId: request.user.id, q: query.q });
    }

    @UseBefore(...checkGroupPermission())
    @Get('/:id([0-9a-f]{24})')
    async byId(@Param('id') id: string) {
        return await this.service.getById(id);
    }

    @UseBefore(...checkGroupPermission(GroupRole.Admin))
    @Patch('/:id([0-9a-f]{24})')
    @UseInterceptor(notificationInterceptor(NotificationTopic.Group, NotificationAction.Updated))
    async update(@Param('id') id: string, @Body() dto: GroupUpdateDto, @Req() request, @CurrentUser() currentUser) {
        return await this.service.update(id, dto);

    }

    @UseBefore(...checkGroupPermission(GroupRole.Admin))
    @Delete('/:id([0-9a-f]{24})')
    @UseInterceptor(notificationInterceptor(NotificationTopic.Group, NotificationAction.Deleted))
    async delete(@Param('id') id: string, @Req() request, @CurrentUser() currentUser) {
        return await this.service.delete(id);

    }
}
