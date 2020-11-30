import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect, UseInterceptor, Action, UseAfter, UseBefore, Controller } from 'routing-controllers';

import { ResourceType, RequestOperation } from '@app/defines';
import { Container } from 'typedi';
import { RequirementCreateDto, RequirementUpdateDto, DeliverableCreateDto, DeliverableUpdateDto, TaskCreateDto, TaskUpdateDto, EffortCreateDto, EffortUpdateDto } from './dto';
import { StatusDto } from './dto/project.dto';
import { DeliverableResourceService, TaskResourceService, EffortResourceService } from '@app/services/resource';
import { Effort, EffortModel } from '@app/models';
import { isDocument, DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { checkResourcePermission } from '@app/middlewares/resourcePermission.middleware';
import { effortInterceptor } from '@app/middlewares/effort.interceptor';


const type = ResourceType.Effort;
@JsonController('/resource')
export class EffortController {
    /**
     *
     */
    repoService = Container.get(EffortResourceService);

    @UseBefore(...checkResourcePermission({ id: 'parent', }))
    @UseInterceptor(effortInterceptor())
    @Post(`/:parent([0-9a-f]{24})/${type}`)
    async create(@Param('parent') parent: string, @Body() dto: EffortCreateDto, @Req() request) {
        const obj = {
            ...dto,
            creator: request?.user?.id,
        };

        obj.assignee = obj.assignee || obj.creator;

        return await this.repoService.create({ parent, ...obj, });
    }

    @UseBefore(...checkResourcePermission({ id: 'parent', }))
    @Get(`/:parent([0-9a-f]{24})/${type}`)
    async list(@Param('parent') parent: string, @QueryParams() query: any, @Req() request) {

        return await this.repoService.list({ ...query, parent: parent, populate: "creator" });

    }

    @UseBefore(...checkResourcePermission({ type, }))
    @Get(`/${type}/:id([0-9a-f]{24})`)
    async getById(@Param('id') id: string, @Req() request) {
        // return await this.repoService.get(id) ;
        return await this.repoService.get(id);

    }

    @UseBefore(...checkResourcePermission({ type, }))
    @UseInterceptor(effortInterceptor())
    @Patch(`/${type}/:id([0-9a-f]{24})`)
    async update(@Param('id') id: string, @Body() dto: EffortUpdateDto, @Req() request, ) {
        return await this.repoService.update(id, dto);
    }


    @UseBefore(...checkResourcePermission({ type, }))
    @UseInterceptor(effortInterceptor())
    @Delete(`/${type}/:id([0-9a-f]{24})`)
    async delete(@Param('id') id: string, @Req() request, ) {
        return await this.repoService.delete(id);
    }

}