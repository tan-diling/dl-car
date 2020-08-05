import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect } from 'routing-controllers';
import { AbstractResourceController } from './abstractResource.controller';
import { createResourceRepoService } from '../../services/resource.service';
import { ProjectCreateDto, ProjectUpdateDto, ProjectMemberConfirmDto } from './dto/project.dto';
import { ResourceType, RequestOperation } from '@app/defines';

@Authorized()
@JsonController('/resource/project')
export class ProjectController extends AbstractResourceController{

    /**
     *
     */
    constructor() {
        super();
        this.resourceType = ResourceType.Project;
        this.repoService = createResourceRepoService(this.resourceType) ;       
    }
 
    @Post()
    async create(@Body() dto:ProjectCreateDto, @Req() request) {  
        const obj = { ...dto, creator: request?.user?.id} ;
        return await this.process(request,{
            method:RequestOperation.CREATE,
            dto:obj,
        }) ;
    }
    
    @Get()
    async list(@QueryParams() query:any, @Req() request) {
        
        return await this.process(request,{       
            method:RequestOperation.RETRIEVE,
            filter:query,
            // dto
        }) ;

    }

        
    @Get('/:id([0-9a-f]{24})')
    async getById(@Param('id') id:string, @Req() request) {
        return await this.process(request,{ 
            resourceId: id,      
            method:RequestOperation.RETRIEVE,
            filter:{_id:id},
            // dto
        }) ;

    }

    
    @Patch('/:id([0-9a-f]{24})')
    async update(@Param('id') id:string, @Body() dto:ProjectUpdateDto, @Req() request, ) {
        return await this.process(request,{         
            resourceId: id,
            method:RequestOperation.UPDATE,    
            dto        
        }) ;
    }


    @Delete('/:id([0-9a-f]{24})')
    async delete(@Param('id') id:string,@Req() request,) {
        return await this.process(request,{           
            resourceId: id,
            method:RequestOperation.DELETE,            
        }) ;
    }

    // @Authorized("NONE")
    // @Get('/member/confirm') 
    // async memberConfirm( @QueryParams() dto:ProjectMemberConfirmDto)
    // {
    //     //return await this.service.(dto)  
    //     return await this.process(request,{           
    //         resourceId: id,
    //         method:Operation.DELETE,            
    //     }) ;  

    // }

}