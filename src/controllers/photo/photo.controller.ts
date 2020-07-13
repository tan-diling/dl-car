import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, UploadedFile } from 'routing-controllers';

import * as fse from 'fs-extra';
import * as path from 'path';
import { PhotoDto } from './dto/photo.dto';
import { PhotoModel } from '@packages/mongoose';

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

@JsonController('/photo')
export class PhotoController{
    @Authorized()
    @Post()
    async upload(@UploadedFile("photo") file: any, @Body() dto:PhotoDto) {
        dto.album = dto.album || 'default' ;
        dto.name = dto.name || file.filename ; 
        dto.type = dto.type || file.mimetype ;
        // const obj =  Object.assign({name:file.filename,type:file.mimetype,album:'default'},dto) ;

        const photo = new PhotoModel(dto) ;

        if(file.buffer) {
            const filePath = path.join("./dist/upload",photo.path()) ;
            await fse.ensureFile(filePath) ;
            await fse.writeFile(filePath,file.buffer) ;
        }
        
        await photo.save() ;

        return photo ;
    }
    
}