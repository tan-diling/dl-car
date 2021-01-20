import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect, UseInterceptor, UseBefore } from 'routing-controllers';

import { ResourceType, RequestOperation } from '@app/defines';
import { Container } from 'typedi';
import { RequirementCreateDto, RequirementUpdateDto, DeliverableCreateDto, DeliverableUpdateDto } from './dto';
import { StatusDto } from './dto/project.dto';
import { DeliverableResourceService } from '@app/services/resource';
import { entityNotificationInterceptor } from '@app/middlewares/entity.interceptor';
import { checkResourcePermission } from '@app/middlewares/resourcePermission.middleware';

const type = ResourceType.Deliverable;
@JsonController('/resource')
export class DeliverableController {
    /**
     *
     */
    service = Container.get(DeliverableResourceService);

    @UseBefore(...checkResourcePermission({ type, method: RequestOperation.CREATE }))
    @UseInterceptor(entityNotificationInterceptor('created'))
    @Post(`/:parent([0-9a-f]{24})/${type}`)
    async create(@Param('parent') parent: string, @Body() dto: DeliverableCreateDto, @Req() request) {
        const obj = { ...dto, creator: request?.user?.id };
        return await this.service.create({ parent, ...obj, });
    }

    @UseBefore(...checkResourcePermission({ type, method: RequestOperation.RETRIEVE }))
    @Get(`/:parent([0-9a-f]{24})/${type}`)
    async list(@Param('parent') parent: string, @QueryParams() query: any, @Req() request) {

        return await this.service.list({ ...query, parents: parent });

    }


    @UseBefore(...checkResourcePermission({ type, method: RequestOperation.RETRIEVE }))
    @Get(`/${type}/:id([0-9a-f]{24})`)
    async getById(@Param('id') id: string, @Req() request) {
        // return await this.repoService.get(id) ;
        return await this.service.get({
            _id: id,
            populate: "children,parents,comments,attachments,checklist"
        });

    }

    @UseBefore(...checkResourcePermission({ type, method: RequestOperation.UPDATE }))
    @UseInterceptor(entityNotificationInterceptor('updated'))
    @Patch(`/${type}/:id([0-9a-f]{24})`)
    async update(@Param('id') id: string, @Body() dto: DeliverableUpdateDto, @Req() request, ) {
        return await this.service.update(id, dto);
    }

    @UseBefore(...checkResourcePermission({ type, method: RequestOperation.UPDATE }))
    @UseInterceptor(entityNotificationInterceptor('status'))
    @Patch(`/${type}/:id([0-9a-f]{24})/status`)
    async status(@Param('id') id: string, @Body() dto: StatusDto, @Req() request, ) {
        return await this.service.status({ id, ...dto, userId: request.user.id });
    }

    @UseBefore(...checkResourcePermission({ type, method: RequestOperation.DELETE }))
    @UseInterceptor(entityNotificationInterceptor('deleted'))
    @Delete(`/${type}/:id([0-9a-f]{24})`)
    async delete(@Param('id') id: string, @Req() request, ) {
        return await this.service.delete(id);
    }

}