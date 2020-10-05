import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect, NotAcceptableError } from 'routing-controllers';
import { AbstractResourceController } from './abstractResource.controller';
import { ProjectResourceService } from '../../services/project.resource.service';
import { ProjectMemberDto, ProjectMemberUpdateDto } from './dto/project.dto';
import { ResourceType, RequestOperation, ProjectRole } from '@app/defines';
import { Container } from 'typedi' ;
import { ProjectPermissionService } from '@app/services/projectPermission.service';
import { Types } from 'mongoose';

@Authorized()
@JsonController('/resource/member')
export class ProjectMemberController {
    /**
     *
     */
    constructor(
        private permissionService:ProjectPermissionService,
        private service:ProjectResourceService,
        ) {
        
    }
    

    private async checkMemberPermission(projectId,userId){
        
        const checked = await this.permissionService.validatePermissionRole(projectId,userId,ProjectRole.ProjectManager,ProjectRole.ProjectOwner) ;
        if(! checked) {
            throw new NotAcceptableError('project permission error');
        }
    }

    @Post('/invitation/:id([0-9a-f]{24})')    
    async inviteMember(@Param('id') id: string, @Body() dto: ProjectMemberDto, @Req() request, @CurrentUser() currentUser) {
        await this.checkMemberPermission(id,currentUser.id) ;

        return await this.service.inviteProjectMember({
            projectId:Types.ObjectId(id),
            userId: Types.ObjectId(dto.userId),
            projectRole:dto.projectRole,
        }) ;
    }

  
    @Patch('/:id([0-9a-f]{24})')
    async update(@Param('id') id:string, @Body() dto:ProjectMemberUpdateDto, @Req() request, @CurrentUser() currentUser ) {
        const pm = await this.service.getProjectMemberById(id) ;      
        if(pm) {

            await this.checkMemberPermission(pm.projectId,currentUser.id) ;

            const userId = pm.userId as Types.ObjectId ;

            if(userId.equals(currentUser.id)){
                throw new NotAcceptableError('project member update self not allowed') ;
            }
            pm.projectRole = dto.projectRole

            await pm.save() ;

            return pm ;
        }
    }

    @Delete('/:id([0-9a-f]{24})')
    async delete(@Param('id') id:string, @Req() request, @CurrentUser() currentUser) {
        const pm = await this.service.getProjectMemberById(id) ;
        if(pm) {

            await this.checkMemberPermission(pm.projectId,currentUser.id) ;

            const userId = pm.userId as Types.ObjectId ;

            if(userId.equals(currentUser.id)){
                throw new NotAcceptableError('project member delete self not allowed') ;
            }

            await pm.remove() ;

            return pm ;
        }
      
    }



}