import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index, DocumentType, pre } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { User } from './user';
import { ProjectMemberStatus } from '@app/defines';
import { ProjectStatus } from '@app/defines/projectStatus';

@pre<Resource>('save', async function() { 
  if (this.isNew && this.parents.length>0) {
    const rootId = this.parents[0] ;
    
    const root = await ResourceModel.findById(rootId,{seq:1}).exec() ;
    
    root.seq = root.seq + 1 ;
    await root.save() ;

    this.seq = root.seq ;
    
  }      
})
export class Resource {

  @prop({alias:'type'})
  __t:string;

  type: string ;

  @prop({required:true})
  title :string;

  @prop()
  description  :string;

  @prop({ required: true } )
  creator: Types.ObjectId ;

  @prop({ref:()=>Resource,type:[Types.ObjectId]})
  parents: Ref<Resource>[] ;

  @prop({ref:()=>User,type:[Types.ObjectId]})
  assignees: Ref<User>[] ;

  @prop({ default: false})
  deleted: boolean ;

  @prop()
  estimate?: number;

  @prop()
  deadline?: Date;

  @prop()
  createdAt?: Date;

  @prop()
  updatedAt?: Date;

  @prop()
  completedAt?: Date;

  @prop({ default: ProjectStatus.Draft })
  status?: string ;

  @prop({
    default:0,
    // select:false
  })

  seq?: number ;
  // @prop({ref:()=>Resource,type:[Types.ObjectId]})
  // children: Ref<Resource>[] ;

  @prop({ default:0 })
  totalEffort: number;

  async getMembers(this: DocumentType<Resource>) {
    const projectId = this.parents.length==0? this._id: this.parents[0] ;
    return await ProjectMemberModel.find({projectId}).exec() ;    
  }

  async getChildren(this: DocumentType<Resource>) {    
    return await ResourceModel.find({parents:this._id}).exec() ;    
  }

  async getMemberProjectRole(this: DocumentType<Resource>,userId:string|Types.ObjectId) {
    const projectId = this.parents.length==0? this._id: this.parents[0] ;
    const pm = await ProjectMemberModel.findOne({projectId,userId}).exec() ;    
    return pm?.projectRole ;
  }
}


export class Project extends Resource {

  @prop()
  key :string;

  @prop()
  logo? :string;  
}

export class Goal extends Resource {

  @prop()
  roi? :number;

  @prop()
  notes? :string;  

  @prop()
  approvalAt? :Date;  
}

export class Requirement extends Resource {
}

export class Deliverable extends Resource {
  @prop()
  severity? :number;

  @prop()
  priority? :number;  

  @prop()
  tags? :string[]; 

  @prop()
  steps? :string; 

  @prop()
  result? :string; 
}

export class Task extends Resource {
  @prop()
  todoList? :string; 
}


@index({  projectId: 1, userId: 1 }, { unique: true })
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


export const ResourceModel = getModelForClass(Resource,{schemaOptions:{ timestamps:true }});

export const ProjectModel = getDiscriminatorModelForClass(ResourceModel,Project);

export const GoalModel = getDiscriminatorModelForClass(ResourceModel,Goal);

export const RequirementModel = getDiscriminatorModelForClass(ResourceModel,Requirement);

export const DeliverableModel = getDiscriminatorModelForClass(ResourceModel,Deliverable);

export const TaskModel = getDiscriminatorModelForClass(ResourceModel,Task);

export const ProjectMemberModel = getModelForClass(ProjectMember,{schemaOptions:{timestamps:true}});
