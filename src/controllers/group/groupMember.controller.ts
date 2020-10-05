import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect, OnNull, OnUndefined, NotAcceptableError } from 'routing-controllers';

import * as moment from 'moment';
import { GroupUpdateDto, GroupCreateDto, CreateGroupMemberDto, DeleteGroupMemberDto, GroupMemberInvitedResponseDto, UpdateGroupMemberDto } from './dto/group.dto';
import { GroupService } from '../../services/group.service';
import { SiteRole, RequestContext, RequestOperation, GroupRole } from '@app/defines';
import { Types } from 'mongoose';
import { UserService } from '@app/services/user.service';


@Authorized()
@JsonController('/group/member')
export class GroupMemberController {
    constructor(private service: GroupService,private userService: UserService) {
    }

    private async checkManagePermission(groupId,userId){
        const checked = await this.service.checkGroupMemberPermission(groupId,userId,GroupRole.Admin) ;
        if(! checked) {
            throw new NotAcceptableError('group permission error');
        }
    }

    @Patch('/:id([0-9a-f]{24})')
    async update(@Param('id') id: string, @Body() dto: UpdateGroupMemberDto, @Req() request, @CurrentUser() currentUser) {
        const gm = await this.service.getMemberById(id) ;
        if(gm){

            await this.checkManagePermission(gm.groupId,currentUser.id) ;

            const userId = gm.userId as Types.ObjectId ;

            if(userId.equals(currentUser.id)){
                throw new NotAcceptableError('group member update self not allowed') ;
            }

            gm.groupRole = dto.groupRole ;

            await gm.save() ;

            return gm ;

        }

        
    }

    @Delete('/:id([0-9a-f]{24})')
    async delete(@Param('id') id: string, @Req() request, @CurrentUser() currentUser) {
        const gm = await this.service.getMemberById(id) ;
        if(gm) {

            await this.checkManagePermission(gm.groupId,currentUser.id) ;

            const userId = gm.userId as Types.ObjectId ;

            if(userId.equals(currentUser.id)){
                throw new NotAcceptableError('group member delete self not allowed') ;
            }

            await gm.remove() ;

            return gm ;
        }
    }



    @Post('/invitation/:id([0-9a-f]{24})')    
    async inviteMember(@Param('id') id: string, @Body() dto: CreateGroupMemberDto, @Req() request, @CurrentUser() currentUser) {
        await this.checkManagePermission(id,currentUser.id) ;

        const user = await this.userService.getUserByEmailForce(dto.email) ;

        return await this.service.inviteMember(Types.ObjectId(id),{userId: user._id,groupRole:dto.groupRole}) ;
    }

}
