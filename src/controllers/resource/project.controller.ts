import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect } from 'routing-controllers';
import { AbstractResourceController } from './abstractResource.controller';
import { ProjectResourceService } from '../../services/project.resource.service';
import { ProjectCreateDto, ProjectUpdateDto, ProjectMemberConfirmDto, ProjectMemberDto } from './dto/project.dto';
import { ResourceType, RequestOperation } from '@app/defines';
import { Container } from 'typedi' ;

@Authorized()
@JsonController('/resource/project')
export class ProjectController extends AbstractResourceController{

    /**
     *
     */
    constructor() {
        super();
        this.resourceType = ResourceType.Project;
        this.repoService = Container.get(ProjectResourceService) ;
        this.queryOptions = {get:{populate:"children"}} ;
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

    @Get('/by_member')
    async listByMember(@QueryParams() query:any, @Req() request) {
        
        return await this.process(request,{       
            method:RequestOperation.RETRIEVE,
            filter:{...query,memberUserId:request.user.id},
            // dto
        }) ;

    }

        
    @Get('/:id([0-9a-f]{24})')
    async getById(@Param('id') id:string, @Req() request) {
        // return await this.repoService.get(id) ;
        return await this.process(request,{ 
            resourceId: id,      
            method:RequestOperation.RETRIEVE,
            filter:{_id:id, memberUserId:request.user.id, populate:'children'},
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
    async delete(@Param('id') id:string, @Req() request,) {
        return await this.process(request,{           
            resourceId: id,
            method:RequestOperation.DELETE,            
        }) ;
    }


    @Patch('/:id([0-9a-f]{24})/member')
    async updateMember(@Param('id') id:string, @Body({ type: ProjectMemberDto }) dto:ProjectMemberDto[], @Req() request, ) {
        return await this.process(request,{         
            resourceId: id,
            method:RequestOperation.UPDATE,    
            dto:{member:dto}
        }) ;
    }


    @Patch('/:id([0-9a-f]{24})/member_confirm')
    async memberConfirm(@Param('id') id:string, @Req() request, @Body() dto:ProjectMemberConfirmDto)
    {
        
        return await this.process(request,{           
            resourceId: id,
            method:"memberConfirm",            
            dto: {userId:request.user.id , ...dto}
        }) ;  

    }

}