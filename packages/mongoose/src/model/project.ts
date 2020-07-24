import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { User } from './user';

export class Resource {

  @prop()
  creator?: Types.ObjectId ;


  @prop()
  parentId?: Types.ObjectId ;

  @prop({ default: false})
  deleted?: boolean ;

  @prop()
  createdAt?: Date;

  @prop()
  updatedAt?: Date;
}


export class Project extends Resource {


  @prop({required:true})
  title :string;

  @prop()
  description  :string;

  @prop()
  logo? :string;
  
  @prop()
  estimate? :number;

  @prop()
  deadline? :Date;
}

export class ProjectMember {

  @prop({ ref: User })
  userId: Ref<User>;;

  @prop({ ref: Project })
  projectId: Ref<Project>;;

  
  @prop()
  projectRole :string;
}



export const ProjectModel = getModelForClass(Project,{schemaOptions:{timestamps:true}});

export const ProjectMemberModel = getModelForClass(ProjectMember,{schemaOptions:{timestamps:true}});
