import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { User } from './user';
import { ProjectMemberStatus } from '@app/defines';

export class Resource {

  @prop({ required: true } )
  creator?: Types.ObjectId ;

  @prop()
  type?: string ;

  @prop()
  parent?: Types.ObjectId[] ;

  @prop()
  assignee?: Types.ObjectId[] ;

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
  key :string;

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

  @prop({ ref: User, required: true })
  userId: Ref<User>;;

  @prop({ ref: Project, required: true })
  projectId: Ref<Project>;;
  
  @prop({ required: true })
  projectRole :string;

  @prop( { default: ProjectMemberStatus.Invited } )
  status? :string;
}


export const ResourceModel = getModelForClass(Resource,{schemaOptions:{timestamps:true}});

export const ProjectModel = getDiscriminatorModelForClass(ResourceModel,Project);

export const ProjectMemberModel = getModelForClass(ProjectMember,{schemaOptions:{timestamps:true}});
