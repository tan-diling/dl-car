import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index, DocumentType, pre } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { User } from '../user';
import { ProjectMemberStatus } from '@app/defines';
import { ProjectStatus } from '@app/defines/projectStatus';

function relatedList(ref:string){
  return { 
    ref,
    localField:"_id",
    foreignField:"parent",
    match:{ deleted:false },
    options:{
      projection:{deleted:0},
    },
  }
}

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
  status?: number ;

  @prop({
    default:0,
    // select:false
  })

  seq?: number ;
  // @prop({ref:()=>Resource,type:[Types.ObjectId]})
  // children: Ref<Resource>[] ;

  ////////////////////////////////////////////////////////////////////////////////  
  @prop({ default:-1, select:false})
  totalEffort: number;
  
  @prop({ 
    ref:'ProjectMember',
    localField:"_id",
    foreignField:"projectId",
    // match:{ 
    //   deleted:false,      
    // },
    options:{
      populate:'userId' ,
    },
    
  })
  members: Ref<ProjectMember>[];

  @prop({ 
    ref:()=>Resource,
    localField:"_id",
    foreignField:"parents",
    match:(doc)=>{ 
      const index = doc.parents.length ;
      const key  = `parents.${index}`;
      const filter = {
        parents:{$size:index+1},
        deleted:false,
      } ; 
      filter[key] = doc._id ;
      return filter;
    },
  })
  children: Ref<Resource>[];

  // @prop({ 
  //   ref:'Comment',
  //   localField:"_id",
  //   foreignField:"parent",
  //   match:{ deleted:false },
  //   options:{
  //     projection:{deleted:0},
  //   },
  // })
  // comments: Ref<ResourceRelatedBase>[];

  @prop(relatedList('Comment'))
  comments: Ref<ResourceRelatedBase>[];


  @prop({ 
    ref:'CheckList',
    localField:"_id",
    foreignField:"parent",
    match:{ 
      deleted:false,      
    },
    
  })
  checklist: Ref<ResourceRelatedBase>[];

  @prop({ 
    ref:'Attachment',
    localField:"_id",
    foreignField:"parent",
    match:{ 
      deleted:false,    
    },

  })
  attachments: Ref<ResourceRelatedBase>[];

  async getMembers(this: DocumentType<Resource>) {
    const projectId = this.parents.length==0? this._id: this.parents[0] ;
    return await ProjectMemberModel.find({projectId}).exec() ;    
  }

  async getChildren(this: DocumentType<Resource>) {    
    const index = this.parents.length ;
    const key  = `parents.${index}`;
    const query = {} ; query[key] = this._id ;
    return await ResourceModel.find(query).exec() ;    
  }

  async getMemberProjectRole(this: DocumentType<Resource>,userId:string|Types.ObjectId) {
    const projectId = this.parents.length==0? this._id: this.parents[0] ;
    const pm = await ProjectMemberModel.findOne({projectId,userId}).exec() ;    
    return pm?.projectRole ;
  }



}


@index({  projectId: 1, userId: 1 }, { unique: true })
export class ProjectMember {

  @prop({ ref: User, required: true })
  userId: Ref<User>;;

  @prop({ ref: Resource, required: true })
  projectId: Ref<Resource>;
  
  @prop({ required: true })
  projectRole :string;

  @prop( { default: ProjectMemberStatus.Invited } )
  status? :string;
}


export const ResourceModel = getModelForClass(Resource,{schemaOptions:{ timestamps:true }});

export const ProjectMemberModel = getModelForClass(ProjectMember,{schemaOptions:{timestamps:true}});

export class ResourceRelatedBase{
  @prop({})
  title: string;

  @prop({required: true, ref:()=>Resource})
  parent: Ref<Resource>;
  
  @prop({ required: true } )
  creator: Types.ObjectId ;

  @prop({default:false})
  deleted?: boolean;

  @prop()
  createdAt?: Date;

  @prop()
  updatedAt?: Date;
}
