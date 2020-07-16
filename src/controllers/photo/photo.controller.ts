import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, UploadedFile, Controller, NotFoundError, Res, NotAcceptableError } from 'routing-controllers';

import * as fse from 'fs-extra';
import * as path from 'path';
import { PhotoDto } from './dto/photo.dto';
import { PhotoModel } from '@packages/mongoose';
import * as util from 'util';
import { config_get } from '@packages/core';

// export const fileUploadOptions = () => {
//     storage: multer.diskStorage({
//         destination: (req: any, file: any, cb: any) => { ...
//         },
//         filename: (req: any, file: any, cb: any) => { ...
//         }
//     }),
//     fileFilter: (req: any, file: any, cb: any) => { ...
//     },
//     limits: {
//         fieldNameSize: 255,
//         fileSize: 1024 * 1024 * 5
//     }
// };

export const PHOTO_BASE_PATH = config_get("photo.path","./dist/upload") ;

@JsonController('/photo')
export class PhotoController{
    @Authorized()
    @Post()
    async upload(@UploadedFile("photo") file: any, @Body({required:false}) dto:PhotoDto) {
        dto.album = dto.album || 'default' ;
        dto.name = dto.name || file.originalname ; 
        dto.type = dto.type || file.mimetype ;
        // const obj =  Object.assign({name:file.filename,type:file.mimetype,album:'default'},dto) ;

        let existPhoto = await PhotoModel.findOne({name:dto.name,album:dto.album}).exec() ;

        if(existPhoto){
            throw new NotAcceptableError("photo exists")
        }

        const photo = new PhotoModel(dto) ;

        if(file.buffer) {
            const filePath = path.join(PHOTO_BASE_PATH,photo.path()) ;
            await fse.ensureFile(filePath) ;
            await fse.writeFile(filePath,file.buffer) ;
        }
        
        await photo.save() ;

        return photo ;
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