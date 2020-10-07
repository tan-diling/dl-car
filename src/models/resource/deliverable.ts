import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index, DocumentType, pre } from '@typegoose/typegoose';

import { User } from '../user';
import { ProjectMemberStatus } from '@app/defines';
import { ProjectStatus } from '@app/defines/projectStatus';
import { Resource, ResourceModel } from './resource';



export class Deliverable extends Resource {
  @prop()
  severity? :number;

  @prop()
  priority? :number;  

  @prop({ type: String })
  tags? :string[]; 

}


export const DeliverableModel = getDiscriminatorModelForClass(ResourceModel,Deliverable);

