import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index, DocumentType, pre } from '@typegoose/typegoose';

import { User } from '../user';
import { ProjectMemberStatus } from '@app/defines';
import { ProjectStatus } from '@app/defines/projectStatus';
import { Resource, ResourceModel, ResourceRelatedBase } from './resource';

export class CheckList extends ResourceRelatedBase {

  @prop()
  title:string;

  @prop()
  content:string;

  @prop()
  done:boolean;  

}

export const CheckListModel = getModelForClass(CheckList,{schemaOptions:{ timestamps:true }});
