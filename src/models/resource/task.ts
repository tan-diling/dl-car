import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index, DocumentType, pre } from '@typegoose/typegoose';

import { Resource, ResourceModel } from './resource';


export class Task extends Resource {
  @prop()
  todoList? :string[]; 
}

export const TaskModel = getDiscriminatorModelForClass(ResourceModel,Task);
