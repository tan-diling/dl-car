import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index, DocumentType, pre } from '@typegoose/typegoose';

import { User } from '../user';
import { ProjectMemberStatus } from '@app/defines';
import { ProjectStatus } from '@app/defines/projectStatus';
import { Resource, ResourceModel } from './resource';


export class Goal extends Resource {

  @prop()
  roi? :number;

  @prop()
  notes? :string;  

  @prop()
  approvalAt? :Date;  
}

export const GoalModel = getDiscriminatorModelForClass(ResourceModel,Goal);
