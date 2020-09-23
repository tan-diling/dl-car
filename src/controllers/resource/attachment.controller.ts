import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect, UseInterceptor, Action, UseAfter, UploadedFile, NotAcceptableError } from 'routing-controllers';
import { AbstractResourceController } from './abstractResource.controller';
import { ResourceType, RequestOperation } from '@app/defines';
import { Container } from 'typedi' ;
import { AttachmentResourceService } from '@app/services/resource';

import * as fse from 'fs-extra';
import * as path from 'path';
import * as moment from 'moment';
import { ATTACH_BASE_PATH } from '@app/config';
import * as mongoose  from 'mongoose';

export const fileUploadOptions =  {        
    limits: {
        // fieldNameSize: 255,
        fields: 1,
        fileSize: 1024 * 1024 * 2
    }
};

const type = ResourceType.Attachment ;
@Authorized()
@JsonController('/resource')
export class AttachmentController extends AbstractResourceController{
    /**
     *
     */
    constructor() {
        super();
        this.resourceType = type;
        this.repoService = Container.get(AttachmentResourceService) ;
    }

    
    async saveAttachment( file: any) {
        const fileName = file.originalname ;
        const extName  = path.extname(fileName).toLowerCase() ;
        
        const folder =  moment().format('yyyyMMDD') ;

        if(file.buffer) {
            const relatedFilePath = path.join(folder,String(mongoose.Types.ObjectId()),extName) ;
            const filePath = path.join(ATTACH_BASE_PATH,relatedFilePath) ;
            await fse.ensureFile(filePath) ;
            await fse.writeFile(filePath,file.buffer) ;

            return { title:fileName,filename:relatedFilePath} ;
        }  else {
            throw new NotAcceptableError('file error') ;

        }
        
    }
 
    @Post(`/:parent([0-9a-f]{24})/${type}`)
    async create(@Param('parent') parent:string, @UploadedFile("file",{options:fileUploadOptions}) file, @Req() request) {  
        const obj =await this.saveAttachment(file) ;
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
        
    // @Get(`/${type}/:id([0-9a-f]{24})`)
    // async getById(@Param('id') id:string, @Req() request) {
    //     // return await this.repoService.get(id) ;
    //     return await this.process(request,{ 
    //         resourceId: id,      
    //         method:RequestOperation.RETRIEVE,
    //         filter:{_id:id, memberUserId:request.user.id},
    //         // dto
    //     }) ;

    // }
    
    // @Patch(`/${type}/:id([0-9a-f]{24})`)
    // async update(@Param('id') id:string, @Body() dto:CommentUpdateDto, @Req() request, ) {
    //     return await this.process(request,{         
    //         resourceId: id,
    //         method:RequestOperation.UPDATE,    
    //         dto        
    //     }) ;
    // }

    @Delete(`/${type}/:id([0-9a-f]{24})`)
    async delete(@Param('id') id:string, @Req() request,) {
        return await this.process(request,{           
            resourceId: id,
            method:RequestOperation.DELETE,            
        }) ;
    }

}