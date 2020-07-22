import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { User } from './user';

export class Resource {

  @prop({ default: false})
  parentId?: Types.ObjectId ;

  @prop({ default: false})
  deleted?: boolean ;

  @prop()
  createdAt?: Date;

  @prop()
  updatedAt?: Date;
}


enum ProjectRole {
  admin ='admin',
  staff = 'staff',
  client='client',
  visitor='visitor',

}

export class Project extends Resource {

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

  
  @prop({default:ProjectRole.visitor, enum: ProjectRole })
  projectRole :ProjectRole;
}



export const ProjectModel = getModelForClass(Project,{schemaOptions:{timestamps:true}});
