import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect, OnNull, OnUndefined, NotAcceptableError, UseBefore, UseInterceptor } from 'routing-controllers';

import * as moment from 'moment';
import { GroupUpdateDto, GroupCreateDto, CreateGroupMemberDto, DeleteGroupMemberDto, GroupMemberInvitedResponseDto, UpdateGroupMemberDto } from './dto/group.dto';
import { GroupService } from '../../services/group.service';
import { SiteRole, RequestContext, RequestOperation, GroupRole, NotificationTopic, NotificationAction } from '@app/defines';
import { Types } from 'mongoose';
import { UserService } from '@app/services/user.service';
import { checkGroupPermission } from '@app/middlewares/groupPermission.middleware';
import { notificationInterceptor } from '@app/middlewares/notification.interceptor';


// @Authorized()
@JsonController('/group/member')
export class GroupMemberController {
    constructor(private service: GroupService, private userService: UserService) {
    }

    @UseBefore(...checkGroupPermission(GroupRole.Admin))
    @Patch('/:id([0-9a-f]{24})/:user([0-9a-f]{24})')
    @UseInterceptor(notificationInterceptor(NotificationTopic.Group, NotificationAction.MemberUpdated))
    async update(@Param('id') id: string, @Param('user') user: string, @Body() dto: UpdateGroupMemberDto, @Req() request, ) {
        if (user == request.user.id) {
            throw new NotAcceptableError('group member update self not allowed');
        }
        return await this.service.updateMember({ group: id, user, groupRole: dto.groupRole });

    }

    @UseBefore(...checkGroupPermission(GroupRole.Admin))
    @UseInterceptor(notificationInterceptor(NotificationTopic.Group, NotificationAction.MemberRemove))
    @Delete('/:id([0-9a-f]{24})/:user([0-9a-f]{24})')
    async delete(@Param('id') id: string, @Param('user') user: string, @Req() request) {
        if (user == request.user.id) {
            throw new NotAcceptableError('group member delete self not allowed');
        }

        return await this.service.deleteMember({ group: id, user });
    }

    @UseBefore(...checkGroupPermission(GroupRole.Admin))
    @Post('/invitation/:id([0-9a-f]{24})')
    async inviteMember(@Param('id') id: string, @Body() dto: CreateGroupMemberDto, @Req() request, @CurrentUser() currentUser) {

        const user = await this.userService.getUserByEmailForce(dto.email);

        return await this.service.inviteMember(Types.ObjectId(id), { userId: user._id, groupRole: dto.groupRole }, currentUser.id);
    }

}
