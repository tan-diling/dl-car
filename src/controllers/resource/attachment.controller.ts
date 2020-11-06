import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, Res, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect, UseInterceptor, Action, UseAfter, UploadedFile, NotAcceptableError, UseBefore } from 'routing-controllers';

import { ResourceType, RequestOperation } from '@app/defines';
import { Container } from 'typedi';
import { AttachmentResourceService } from '@app/services/resource';

import * as fse from 'fs-extra';
import * as path from 'path';
import * as moment from 'moment';
import { ATTACH_BASE_PATH } from '@app/config';
import * as mongoose from 'mongoose';
import * as util from 'util';
import { checkResourcePermission } from '@app/middlewares/resourcePermission.middleware';

export const fileUploadOptions = {
    limits: {
        // fieldNameSize: 255,
        fields: 1,
        fileSize: 1024 * 1024 * 2
    }
};

async function downloadAttachment(res: Response, relatedPath: string, name: string) {
    const filePath = getAttachAbsolutePath(relatedPath);
    if (fse.pathExistsSync(filePath)) {

        await util.promisify(res.download).bind(res)(filePath, name);
        // await util.promisify<void, void>(()=>{
        //     res.download(filePath,name) ;
        // })();

        return res;
    }

}

function getAttachAbsolutePath(relatedPath: string) {
    if (relatedPath.startsWith(ATTACH_BASE_PATH)) {
        return relatedPath;
    }
    return path.join(ATTACH_BASE_PATH, relatedPath);
}

const type = ResourceType.Attachment;
@JsonController('/resource')
export class AttachmentController {
    /**
     *
     */
    repoService = Container.get(AttachmentResourceService);


    async saveAttachment(file: any) {
        const fileName = file.originalname;
        const extName = path.extname(fileName).toLowerCase();


        if (file.buffer) {
            const _id = mongoose.Types.ObjectId();
            const folder = moment(_id.getTimestamp()).format('yyyyMMDD');
            const relatedFilePath = path.join(folder, String(_id) + extName);
            const fullFilePath = getAttachAbsolutePath(relatedFilePath);
            await fse.ensureFile(fullFilePath);
            await fse.writeFile(fullFilePath, file.buffer);

            return { _id, title: fileName, ext: extName, path: relatedFilePath };
        } else {
            throw new NotAcceptableError('file error');

        }

    }

    @Post(`/:parent([0-9a-f]{24})/${type}`)
    @UseBefore(...checkResourcePermission({ id: 'parent' }))
    async create(@Param('parent') parent: string, @UploadedFile("file", { options: fileUploadOptions }) file: any, @Req() request) {
        const dto = await this.saveAttachment(file);
        const obj = { ...dto, creator: request?.user?.id };
        return await this.repoService.create({ parent, ...obj, });
    }

    @Get(`/:parent([0-9a-f]{24})/${type}`)
    @UseBefore(...checkResourcePermission({ id: 'parent' }))
    async list(@Param('parent') parent: string, @QueryParams() query: any, @Req() request) {
        return await this.repoService.list({ ...query, parent: parent });
    }

    @Get(`/${type}/:id([0-9a-f]{24})/download`)
    @UseBefore(...checkResourcePermission({ type }))
    async download(@Param('id') id: string, @Req() request, @Res() res: Response) {
        const doc = await this.repoService.get(id);

        if (doc) {
            return await downloadAttachment(res, doc.path, doc.title);
        }

    }

    // @Patch(`/${type}/:id([0-9a-f]{24})`)
    // async update(@Param('id') id:string, @Body() dto:CommentUpdateDto, @Req() request, ) {
    //     return await this.process(request,{         
    //         resourceId: id,
    //         method:RequestOperation.UPDATE,    
    //         dto        
    //     }) ;
    // }

    @Delete(`/${type}/:id([0-9a-f]{24})`)
    @UseBefore(...checkResourcePermission({ type }))
    async delete(@Param('id') id: string, @Req() request, ) {
        return await this.repoService.delete(id);
    }

}