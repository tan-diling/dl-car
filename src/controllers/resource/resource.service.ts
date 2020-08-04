import { Model, Document, Types } from 'mongoose';
import { RepoCRUDInterface } from './dto/types';
import { ResourceType, ProjectRole } from '@app/defines';
import { ProjectModel, ProjectMemberModel, Project, ProjectMember } from '../../models/project';
import { ModelQueryService  } from '../../modules/query';
import { ReturnModelType } from '@typegoose/typegoose';
import { ForbiddenError, NotAcceptableError } from 'routing-controllers';
import { UserModel } from '@app/models/user';

// function createRepoService<T extends Document>(
//     model: Model<T>,
//   ): RepoCRUDInterface
//   {
//       const queryService = new ModelQueryService() ;


//     const create = async (dto) => {
//           return await model.create(dto) ;
//     };

//     const list = async (filter) => {         
//         return await queryService.list(model,filter) ;
//     };

//     const remove = async (id) => {
//         const m =  await model.findById(id).exec() ;
//         if(m) {

        
//             if(model.schema.path('deleted')){
//                 m.set('deleted',true) ;
//                 await m.save() ;
            
//             } else {
//                 await m.remove() ;
//             }        
//         }

//         return m ;
//     };

//     const update = async (id,dto) => {
//         const doc =  await model.findById(id).exec() ;
//         if ( doc )
//             return await model.findByIdAndUpdate(id,dto,{new:true}) ;

//         return null ;
//     };


//     return { create,list,delete:remove,update} ;

//   }

const queryService= new ModelQueryService() ;  
class ResourceService<T > implements RepoCRUDInterface {    

    model: Model<T & Document>;

    async create(dto){
        return await this.model.create(dto) ;
    } 

    async list(filter) {
        return await queryService.list(this.model,filter) ;        
    }

    async delete(id) {
        const m =  await this.model.findById(id).exec() ;
        if(m) {        
            if(this.model.schema.path('deleted')){
                m.set('deleted',true) ;
                await m.save() ;
            
            } else {
                await m.remove() ;
            }        
        }

        return m ;    
    }

    async update(id,dto) {
        const doc =  await this.model.findById(id).exec() ;
        if ( doc )
            return await this.model.findByIdAndUpdate(id,dto,{new:true}) ;

        return null ;
    };
}  


class ProjectResourceService extends ResourceService<Project>{
    /**
     *
     */
    constructor() {
        super();
        this.model = ProjectModel ;        
    }

    /**
     * get projects with member
     * @param docs project documents
     * @return project documents with members info
     */
    async getProjectMembers(docs:(Project&Document) []){

        const ids = docs.map(x=>x._id) ;

        const pms = await ProjectMemberModel.find({}).where('projectId').in(ids).exec() ;

        const convert = (projects:(Project&Document) [],members:(ProjectMember&Document)[])=>{
            return projects.map(x=>{
                return {... x.toJSON(),
                    members:members
                        .filter(y=>y.projectId==x.id)
                        .map(z=>{
                            return {"userId":z.userId,"projectRole":z.projectRole};
                        })
                };
                }) ;      
        };

        return convert(docs,pms) ;        

    }

    /**
     * get one project with member
     * @param docs project document
     * @return project document with members info
     */
    async getProjectMember(docs:(Project&Document) ){
        return (await this.getProjectMembers([docs]))[0] ;        
    }

    /** list project info */
    async list(filter) {
        let {memberUserId,query} = filter ;

        if(memberUserId){
            const pmList = await ProjectMemberModel.find({userId:memberUserId}).exec() ;
            const projectIds = pmList.map(x=>x.projectId) ;
            query = {...query,_id:projectIds};
        }

        const l = await super.list(query) ;

        return await this.getProjectMembers(l) ;

    }

    /**
     * config project members
     * @param project project document
     * @param members members
     */
    async setProjectMember(project:Project&Document,members:{userId,projectRole}[]){

        // check user validate
        const userIds = members.map(x=>Types.ObjectId(x.userId)) ;
        if (members.length != await UserModel.find({}).where('_id').in(userIds).countDocuments().exec()){
            throw new NotAcceptableError('member_invalid');
        }

        // make sure project.creator is project manager
        const id = project._id ;
        if (null == members.find(x=>Types.ObjectId(x.userId) == project.creator)){
            members.push({userId:project.creator,projectRole:ProjectRole.ProjectManager})
        }
        // remove project member
        for(const pm  of await ProjectMemberModel.find({projectId:id})) {
            if(null == members.find(x=>x.userId==pm.userId)){
                await pm.remove() ;
            }
        };

        // append or insert
        for(const projectMember of members ){
            const projectMemberFilter = {projectId:id,userId:projectMember.userId} ;
            const pm = await ProjectMemberModel.findOne(projectMemberFilter).exec() ;
            if(pm) {
                pm.projectRole = projectMember.projectRole ;                
                await pm.save();
            }
            else
            {
                await ProjectMemberModel.create( {...projectMemberFilter,projectRole:projectMember.projectRole});
            }
        }        

    }    


    /** create project  */
    async create(dto){
        const project = await super.create(dto) ;

        const members = [{userId:project.creator,projectRole:ProjectRole.ProjectManager}];

        await this.setProjectMember(project,members);

        return await this.getProjectMember(project)  ;

    }    

    /** update project info */
    async update(id,dto) {
        const {members,...projectDto} = dto ;
        const project = await super.update(id,projectDto) ;

        if (members){

            await this.setProjectMember(project, members);
           
        }
       
        return await this.getProjectMember(project)  ;
    };
}


export function createResourceRepoService(
    resourceType: ResourceType| string ,
  ): RepoCRUDInterface
  {
      if (resourceType == ResourceType.Project) {
        //   const projectRepoService = createRepoService (ProjectModel) ;  
        //   const projectMemberRepoService = createRepoService (ProjectMemberModel) ;  
          
        //   const projectService  = {...projectRepoService,}
          
          return new ProjectResourceService() ;
      }
    
  }  

