import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect, OnNull, OnUndefined, UseBefore } from 'routing-controllers';

import * as moment from 'moment';
import { GroupUpdateDto, GroupCreateDto, CreateGroupMemberDto, DeleteGroupMemberDto, GroupMemberInvitedResponseDto } from './dto/group.dto';
import { GroupService } from '../../services/group.service';
import { SiteRole, RequestContext, RequestOperation, GroupRole } from '@app/defines';
import { checkGroupPermission } from '@app/middlewares/groupPermission.middleware';


const resourceType = 'group';

// @Authorized()
@JsonController('/group')
export class GroupController {
    constructor(private service: GroupService) {
    }


    @Authorized()
    @Post()
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
    async update(@Param('id') id: string, @Body() dto: GroupUpdateDto, @Req() request, @CurrentUser() currentUser) {
        return await this.service.update(id, dto);

    }

    @UseBefore(...checkGroupPermission(GroupRole.Admin))
    @Delete('/:id([0-9a-f]{24})')
    async delete(@Param('id') id: string, @Req() request, @CurrentUser() currentUser) {
        return await this.service.delete(id);

    }


    // @Get('/:id([0-9a-f]{24})/member')
    // async getMember(@Param('id') id: string, @QueryParams() query: any, @Req() request, @CurrentUser() currentUser) {

    //     return await this.processRequest({
    //         resourceType,
    //         request,
    //         method: RequestOperation.RETRIEVE,
    //         user: currentUser,
    //         resourceId: id,
    //         filter: { id },
    //         // dto
    //     });

    //     // return await this.service.list(query) ;
    // }

    // @Delete('/:id([0-9a-f]{24})/member')
    // @OnNull(400)
    // async deleteMember(@Param('id') id: string, @Req() request, @CurrentUser() currentUser, @Body() dto: DeleteGroupMemberDto) {
    //     return await this.processRequest({
    //         resourceType,
    //         request,
    //         method: RequestOperation.DELETE,
    //         user: currentUser,
    //         resourceId: id,
    //         filter: { id },
    //         dto
    //     });
    //     // return await this.service.delete(id) ;
    // }

    // @Post('/:id([0-9a-f]{24})/member')
    // @OnUndefined(400)
    // async createMember(@Param('id') id: string, @Body() dto: CreateGroupMemberDto, @Req() request, @CurrentUser() currentUser) {
    //     return await this.processRequest({
    //         resourceType,
    //         request,
    //         method: RequestOperation.CREATE,
    //         user: currentUser,
    //         resourceId: id,
    //         filter: { id },
    //         dto
    //     });

    // }

    // // @Authorized("NONE")
    // @Patch('/:id([0-9a-f]{24})/member_confirm')
    // async memberConfirm(@Param('id') id: string, @Body() dto:GroupMemberInvitedResponseDto, @CurrentUser() currentUser)
    // {
    //     return await this.service.memberConfirm({id, email:currentUser.email, ...dto}) ;
    // }

}
