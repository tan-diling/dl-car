import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, UploadedFile, Controller, NotFoundError, Res, NotAcceptableError } from 'routing-controllers';

import * as fse from 'fs-extra';
import * as path from 'path';
import { PhotoDto } from './dto/photo.dto';
import { PhotoModel } from '@packages/mongoose';
import * as util from 'util';
import { config_get } from '@packages/core';
import * as moment from 'moment';

const allowedFileExtNameList =[".jpg",".gif",".png"] ;

export const fileUploadOptions =  {        
    limits: {
        // fieldNameSize: 255,
        fields: 1,
        fileSize: 1024 * 1024 * 2
    }
};

export const PHOTO_BASE_PATH = config_get("photo.path","./dist/upload") ;

@JsonController('/image')
export class PhotoController{
    @Authorized()
    @Post()
    async upload(@UploadedFile("photo",{options:fileUploadOptions}) file: any, @Body({required:false}) dto:PhotoDto,@CurrentUser() currentUser:any) {
        const fileName = file.originalname ;
        const extName  = path.extname(fileName).toLowerCase() ;
        if(! allowedFileExtNameList.includes(extName))
            throw new NotAcceptableError("file_invalid") ;

        dto.folder = dto.folder || moment().format('yyyyMMDD') ;
        dto.title = dto.title || fileName ; 
        dto.type = dto.type || extName ;
              
        const photo = new PhotoModel({...dto,owner:currentUser.id}) ;

        if(file.buffer) {
            const filePath = path.join(PHOTO_BASE_PATH,photo.path()) ;
            await fse.ensureFile(filePath) ;
            await fse.writeFile(filePath,file.buffer) ;
        }
        
        await photo.save() ;

        return {...photo.toJSON(),url:"/image"+photo.path() } ;
    }

}


@Controller('/image')
export class ImageController{

    @Get('/:id([0-9a-f]{24})')
    async getImage(@Param('id') id:string, @Res() res: Response) {
        const photo = await PhotoModel.findById(id) ;
        
        if(photo) {
            const filePath = path.join(__dirname,'../../../', PHOTO_BASE_PATH,photo.path()) ;
            
            console.log('File: ', filePath);
            
            // res.sendFile(filePath,);            

            await util.promisify<void, void>(()=>{
                res.sendFile(filePath)
            })();
            
            return res ;
            // throw null ;
            
        }
        
        return null ;
    }
    

}