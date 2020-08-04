/**
 * in project
 * ```
 * npm install ./packages/login
 * ```
 */

require('module-alias/register') ;

import {BackendServer } from 'src/modules/web';
import { JsonController, Get, Post, UploadedFile, Body } from 'routing-controllers';
import bodyParser = require('body-parser');
import { IsString, IsOptional } from 'class-validator';

const server = BackendServer.getInstance() ;

class PhotoDto {
    @IsString()
    @IsOptional()
    name:string;
    album:string;
    title:string;
    description:string;
    type:string;
}

// // to keep code clean better to extract this function into separate file
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
//         fileSize: 1024 * 1024 * 2
//     }
// };


@JsonController('/photo')
class PhotoController{
    @Post()
    async upload(@UploadedFile("photo") file: any,@Body() dto:PhotoDto) {
        const obj =  Object.assign({name:file.filename,type:file.mimetype,album:'default'},dto) ;

        return obj ;
    }
    
}

server.registerController(PhotoController);

server.start() ;