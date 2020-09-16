import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index, DocumentType, pre } from '@typegoose/typegoose';

import { User } from '../user';
import { ProjectMemberStatus } from '@app/defines';
import { ProjectStatus } from '@app/defines/projectStatus';
import { Resource, ResourceModel } from './resource';

export class Project extends Resource {

  @prop()
  key :string;

  @prop()
  logo? :string;  
}

export const ProjectModel = getDiscriminatorModelForClass(ResourceModel,Project);

