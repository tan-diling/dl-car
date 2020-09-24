import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index, DocumentType, pre } from '@typegoose/typegoose';

import { User } from '../user';
import { ProjectMemberStatus } from '@app/defines';
import { ProjectStatus } from '@app/defines/projectStatus';
import { Resource, ResourceModel, ResourceRelatedBase } from './resource';

export class Attachment extends ResourceRelatedBase {

  @prop()
  ext:string;

  @prop()
  path:string;

  @prop()
  data?:Buffer;

}

export const AttachmentModel = getModelForClass(Attachment,{schemaOptions:{ timestamps:true }});
