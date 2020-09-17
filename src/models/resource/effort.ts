import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index, DocumentType, pre } from '@typegoose/typegoose';

import { User } from '../user';
import { ProjectMemberStatus } from '@app/defines';
import { ProjectStatus } from '@app/defines/projectStatus';
import { Resource, ResourceModel, ResourceRelatedBase } from './resource';

export class Effort extends ResourceRelatedBase {

  @prop()
  title:string;

  // @prop()
  // results:string;  

  @prop()
  startAt:Date;  

  @prop()
  effort:number;  
}

export const EffortModel = getModelForClass(Effort,{schemaOptions:{ timestamps:true }});
