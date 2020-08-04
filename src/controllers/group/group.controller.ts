import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect } from 'routing-controllers';

import * as moment from 'moment';
import { GroupUpdateDto, GroupCreateDto, CreateGroupMemberDto, DeleteGroupMemberDto, GroupMemberInvitedResponseDto } from './dto/group.dto';
import { GroupService } from './group.service';
import { SiteRole, RequestContext, RequestOperation } from '@app/defines';


const resourceType = 'group' ;

@Authorized()
@JsonController('/group')
export class GroupController {
    constructor(private service: GroupService) {
    }

    // async checkPermission(ctx: RequestContext) {

    //     return await this.service.checkPermission(ctx) ;

    //     switch (ctx.method) {
    //         case RequestOperation.CREATE:
    //             break;
    //         case RequestOperation.RETRIEVE:
    //             if (ctx.user?.role == 'admin')
    //                 return;

    //             if (ctx.user?.id != ctx.filter?.memberUserId)
    //                 throw new MethodNotAllowedError('permission check error');

    //             break;
    //         case RequestOperation.UPDATE:
    //             // 'admin' site_user can update all
    //             if (ctx.user?.role == 'admin')
    //                 return;

    //             // // other site_user can update his/her self information
    //             // if (ctx.user?.id != ctx.filter?.owner)
    //             //     throw new MethodNotAllowedError('permission check error');

    //             // // user info:"role" , "defaultContact" maintained by 'admin'
    //             // if (ctx.dto?.role != null || ctx.dto?.defaultContact != null)
    //             //     throw new MethodNotAllowedError('permission check error');
    //             break;
    //         case RequestOperation.DELETE:
    //             if (ctx.user?.id == ctx.filter?.owner)
    //                 throw new MethodNotAllowedError('permission check: cannot delete self');
    //             break;
    //         default:
    //             throw new InternalServerError('check permission error');
    //     }
    // }

    async processRequest(ctx: RequestContext) {
        await this.service.checkPermission(ctx) ;

        if (ctx.request.path.endsWith('member')) {            
            switch (ctx.method) {
                case RequestOperation.CREATE:
                    return await this.service.appendMember(ctx.filter.id, ctx.dto);
                    break;
                case RequestOperation.RETRIEVE:
                    return this.service.listMember(ctx.filter.id);
                    break;
                case RequestOperation.DELETE:
                    return await this.service.deleteMember(ctx.filter.id, ctx.dto);
                    break;
                case RequestOperation.UPDATE:


                    break;
            }

        }
        else 
        {
            switch (ctx.method) {
                case RequestOperation.CREATE:

                    return await this.service.create(ctx.dto);
                    break;
                case RequestOperation.RETRIEVE:
              
                    return await this.service.list(ctx.filter);
                    break;
                case RequestOperation.DELETE:

                    return await this.service.delete(ctx.filter.id);
                    break;
                case RequestOperation.UPDATE:

                    return await this.service.update(ctx.filter.id, ctx.dto);
                    break;
            }
        }
    }

    @Post()
    async create(@Body() dto: GroupCreateDto, @Req() request, @CurrentUser() currentUser) {
        return await this.processRequest({
            resourceType,
            request,
            method: RequestOperation.CREATE,
            user: currentUser,
            filter: query,
            dto: { owner: currentUser.id, email: currentUser.email, ...dto }
        });

    }

    @Get()
    async list(@QueryParams() query: any, @Req() request, @CurrentUser() currentUser) {
        return await this.processRequest({
            resourceType,
            request,
            method: RequestOperation.RETRIEVE,
            user: currentUser,
            filter: query,
            // dto
        });

    }


    @Patch('/:id([0-9a-f]{24})')
    async update(@Param('id') id: string, @Body() dto: GroupUpdateDto, @Req() request, @CurrentUser() currentUser) {
        return await this.processRequest({
            resourceType,
            request,
            method: RequestOperation.UPDATE,
            user: currentUser,
            resourceId: id,
            filter: { id },
            dto
        });
        // return await this.service.update(id,dto) ;
    }

    @Delete('/:id([0-9a-f]{24})')
    async delete(@Param('id') id: string, @Req() request, @CurrentUser() currentUser) {
        return await this.processRequest({
            resourceType,
            request,
            method: RequestOperation.DELETE,
            user: currentUser,
            resourceId: id,
            filter: { id },
            // dto
        });
        // return await this.service.delete(id) ;
    }


    @Get('/:id([0-9a-f]{24})/member')
    async getMember(@Param('id') id: string, @QueryParams() query: any, @Req() request, @CurrentUser() currentUser) {
        return await this.processRequest({
            resourceType,
            request,
            method: RequestOperation.RETRIEVE,
            user: currentUser,
            resourceId: id,
            filter: { id },
            // dto
        });

        // return await this.service.list(query) ;
    }

    @Delete('/:id([0-9a-f]{24})/member')
    async deleteMember(@Param('id') id: string, @Req() request, @CurrentUser() currentUser, @Body() dto: DeleteGroupMemberDto) {
        return await this.processRequest({
            resourceType,
            request,
            method: RequestOperation.DELETE,
            user: currentUser,
            resourceId: id,
            filter: { id },
            dto
        });
        // return await this.service.delete(id) ;
    }

    @Post('/:id([0-9a-f]{24})/member')
    async createMember(@Param('id') id: string, @Body() dto: CreateGroupMemberDto, @Req() request, @CurrentUser() currentUser) {
        return await this.processRequest({
            resourceType,
            request,
            method: RequestOperation.CREATE,
            user: currentUser,
            resourceId: id,
            filter: { id },
            dto
        });

    }

    @Post('/invite_response')
    async inviteResponse( @Body() dto:GroupMemberInvitedResponseDto,@CurrentUser() currentUser)
    {
        return await this.service.responseInvited({...dto,email:currentUser.email})
    }

}
