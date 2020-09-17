import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect } from 'routing-controllers';
import { AbstractResourceController } from './abstractResource.controller';
import { ResourceType, RequestOperation } from '@app/defines';
import { Container } from 'typedi' ;
import { RequirementCreateDto, RequirementUpdateDto, DeliverableCreateDto, DeliverableUpdateDto, TaskCreateDto, TaskUpdateDto, EffortCreateDto, EffortUpdateDto } from './dto';
import { StatusDto } from './dto/project.dto';
import { DeliverableResourceService, TaskResourceService, EffortResourceService } from '@app/services/resource';

const type = ResourceType.Effort ;
@Authorized()
@JsonController('/resource')
export class EffortController extends AbstractResourceController{
    /**
     *
     */
    constructor() {
        super();
        this.resourceType = type;
        this.repoService = Container.get(EffortResourceService) ;
    }
 
    @Post(`/:parent([0-9a-f]{24})/${type}`)
    async create(@Param('parent') parent:string, @Body() dto:EffortCreateDto, @Req() request) {  
        const obj = { ...dto, creator: request?.user?.id} ;
        return await this.process(request,{
            method:RequestOperation.CREATE,
            dto:{parent, ...obj,}
        }) ;
    }
    
    @Get(`/:parent([0-9a-f]{24})/${type}`)
    async list(@Param('parent') parent:string, @QueryParams() query:any, @Req() request) {
        
        return await this.process(request,{       
            method:RequestOperation.RETRIEVE,
            filter:{...query,parent:parent},
            // dto
        }) ;

    }
        
    @Get(`/${type}/:id([0-9a-f]{24})`)
    async getById(@Param('id') id:string, @Req() request) {
        // return await this.repoService.get(id) ;
        return await this.process(request,{ 
            resourceId: id,      
            method:RequestOperation.RETRIEVE,
            filter:{_id:id, memberUserId:request.user.id},
            // dto
        }) ;

    }
    
    @Patch(`/${type}/:id([0-9a-f]{24})`)
    async update(@Param('id') id:string, @Body() dto:EffortUpdateDto, @Req() request, ) {
        return await this.process(request,{         
            resourceId: id,
            method:RequestOperation.UPDATE,    
            dto        
        }) ;
    }


    @Delete(`/${type}/:id([0-9a-f]{24})`)
    async delete(@Param('id') id:string, @Req() request,) {
        return await this.process(request,{           
            resourceId: id,
            method:RequestOperation.DELETE,            
        }) ;
    }

}