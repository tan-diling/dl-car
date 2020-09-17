import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index, DocumentType, pre } from '@typegoose/typegoose';

import { User } from '../user';
import { ProjectMemberStatus } from '@app/defines';
import { ProjectStatus } from '@app/defines/projectStatus';
import { Resource, ResourceModel, ResourceRelatedBase } from './resource';

export class Comment extends ResourceRelatedBase {

  @prop()
  title:string;

  @prop()
  content:string;  

}

export const CommentModel = getModelForClass(Comment,{schemaOptions:{ timestamps:true }});
