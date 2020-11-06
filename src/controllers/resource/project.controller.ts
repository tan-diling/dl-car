import { Request, Response, NextFunction } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect, UseInterceptor, UseBefore } from 'routing-controllers';

import { ProjectResourceService } from '../../services/project.resource.service';
import { ProjectCreateDto, ProjectUpdateDto, ProjectMemberConfirmDto, ProjectMemberDto } from './dto/project.dto';
import { ResourceType, RequestOperation, SiteRole } from '@app/defines';
import { Container } from 'typedi';
import { entityNotificationInterceptor } from '@app/middlewares/entity.interceptor';
import { checkResourcePermission } from '@app/middlewares/resourcePermission.middleware';

const type = ResourceType.Project;

// @Authorized()
@JsonController('/resource/project')
export class ProjectController {

    /**
     *
     */
    repoService = Container.get(ProjectResourceService);

    @UseBefore(...checkResourcePermission({ type, method: RequestOperation.CREATE }))
    @Post()
    @UseInterceptor(entityNotificationInterceptor('created'))
    async create(@Body() dto: ProjectCreateDto, @Req() request) {
        const obj = { ...dto, creator: request.user?.id };
        return await this.repoService.create(obj);

    }

    @UseBefore(...checkResourcePermission({ type, method: RequestOperation.RETRIEVE }))
    @Get()
    async list(@QueryParams() query: any, @Req() request) {
        return await this.repoService.list(query);
    }

    // @UseBefore(...checkResourcePermission({ type, method: RequestOperation.RETRIEVE }))
    @Authorized()
    @Get('/by_member')
    async listByMember(@QueryParams() query: any, @Req() request) {

        return await this.repoService.listByMember(request.user.id, query);

    }

    @UseBefore(...checkResourcePermission({ type, }))
    @Get('/:id([0-9a-f]{24})')
    async getById(@Param('id') id: string, @Req() request) {
        return await this.repoService.get({ _id: id, populate: "children,comments,attachments" });
    }


    @UseBefore(...checkResourcePermission({ type, method: RequestOperation.UPDATE }))
    @UseInterceptor(entityNotificationInterceptor())
    @Patch('/:id([0-9a-f]{24})')
    async update(@Param('id') id: string, @Body() dto: ProjectUpdateDto, @Req() request, ) {
        return await this.repoService.update(id, dto);
    }

    @UseBefore(...checkResourcePermission({ type, method: RequestOperation.DELETE }))
    @Delete('/:id([0-9a-f]{24})')
    @UseInterceptor(entityNotificationInterceptor('deleted'))
    async delete(@Param('id') id: string, @Req() request, ) {
        return await this.repoService.delete(id);
    }
}