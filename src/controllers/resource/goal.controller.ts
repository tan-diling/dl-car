import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect, UseInterceptor } from 'routing-controllers';
import { AbstractResourceController } from './abstractResource.controller';
import { ResourceType, RequestOperation } from '@app/defines';
import { Container } from 'typedi';
import { GoalResourceService } from '@app/services/resource/goal.resource.service';
import { GoalCreateDto, GoalUpdateDto } from './dto/goal.dto';
import { StatusDto } from './dto/project.dto';
import { entityNotificationInterceptor } from '@app/middlewares/entity.interceptor';

const type = 'goal';
@Authorized()
@JsonController('/resource')
export class GoalController extends AbstractResourceController {
    /**
     *
     */
    constructor() {
        super();
        this.resourceType = ResourceType.Goal;
        this.repoService = Container.get(GoalResourceService);
        this.queryOptions = { get: { populate: "children,parents,comments,attachments" } };
    }

    @UseInterceptor(entityNotificationInterceptor('created'))
    @Post(`/:parent([0-9a-f]{24})/${type}`)
    async create(@Param('parent') parent: string, @Body() dto: GoalCreateDto, @Req() request) {
        const obj = { ...dto, creator: request?.user?.id };
        return await this.process(request, {

            method: RequestOperation.CREATE,
            dto: { parent, ...obj, }
        });
    }

    @Get(`/:parent([0-9a-f]{24})/${type}`)
    async list(@Param('parent') parent: string, @QueryParams() query: any, @Req() request) {

        return await this.process(request, {
            method: RequestOperation.RETRIEVE,
            filter: { ...query, parents: parent },
            // dto
        });

    }



    @Get(`/${type}/:id([0-9a-f]{24})`)
    async getById(@Param('id') id: string, @Req() request) {
        // return await this.repoService.get(id) ;
        return await this.process(request, {
            resourceId: id,
            method: RequestOperation.RETRIEVE,
            filter: { _id: id, memberUserId: request.user.id },
            // dto
        });

    }

    @UseInterceptor(entityNotificationInterceptor())
    @Patch(`/${type}/:id([0-9a-f]{24})`)
    async update(@Param('id') id: string, @Body() dto: GoalUpdateDto, @Req() request, ) {
        return await this.process(request, {
            resourceId: id,
            method: RequestOperation.UPDATE,
            dto
        });
    }

    @UseInterceptor(entityNotificationInterceptor('status'))
    @Patch(`/${type}/:id([0-9a-f]{24})/status`)
    async status(@Param('id') id: string, @Body() dto: StatusDto, @Req() request, ) {
        return await this.process(request, {
            resourceId: id,
            method: 'status',
            dto: { ...dto, userId: request.user.id }
        });
    }

    @UseInterceptor(entityNotificationInterceptor('deleted'))
    @Delete(`/${type}/:id([0-9a-f]{24})`)
    async delete(@Param('id') id: string, @Req() request, ) {
        return await this.process(request, {
            resourceId: id,
            method: RequestOperation.DELETE,
        });
    }

}