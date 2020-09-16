import { Model, Document, Types } from 'mongoose';
import { RepoCRUDInterface, MemberStatus } from '@app/defines';
import { ResourceType, ProjectRole, RepoOperation } from '@app/defines';
import { ProjectModel, ProjectMemberModel, Project, ProjectMember } from '../models';
import { ModelQueryService  } from '../modules/query';
import { ReturnModelType, types } from '@typegoose/typegoose';
import { ForbiddenError, NotAcceptableError } from 'routing-controllers';
import { UserModel } from '@app/models/user';
import { ResourceService } from './resource/resource.service';

export class ProjectResourceService extends ResourceService<Project>{
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

        const pms = await ProjectMemberModel.find({}).where('projectId').in(ids).populate('userId','name email').exec() ;

        const convert = (projects:(Project&Document) [],member:(ProjectMember&Document)[])=>{
            return projects.map(x=>{
                return {... x.toJSON(),
                    member:member
                        .filter(y=>y.projectId==x.id)
                        .map(z=>{
                            return {
                                "user":z.userId,
                                "projectRole":z.projectRole,
                                "status":z.status,
                            };
                        })
                };
                }) ;      
        };

        return convert(docs,pms) ;        

    }

    /**
     * get one project with member
     * @param doc project document
     * @return project document with members info
     */
    async getProjectMember(doc:(Project&Document) ){
        return (await this.getProjectMembers([doc]))[0] ;        
    }

    /** list project info */
    async list(filter) {
        let {memberUserId,...query} = filter ;

        if(memberUserId){
            const pmList = await ProjectMemberModel.find({userId:memberUserId}).exec() ;
            if (pmList.length == 0) return [] ;
            const projectIds = pmList.map(x=>x.projectId) ;
            query = {...query,_id:projectIds};
        }

        const l = await super.list(query) ;

        return await this.getProjectMembers(l) ;

    }

    /** get project info */
    async get(filter) {
   
        const l = await super.get(filter) ;
        if(l){
            return await this.getProjectMember(l) ;
        }

    }

    /**
     * config project members
     * @param project project document
     * @param member members
     */
    async setProjectMember(project:Project&Document,member:{userId,projectRole}[]){

        // check user validate
        const userIds = member.map(x=>Types.ObjectId(x.userId)) ;
        
        if (member.length != await UserModel.find({}).where('_id').in(userIds).countDocuments().exec()){
            throw new NotAcceptableError('member_invalid');
        }

        // make sure project.creator is project manager        
            {
                member.push({
                    userId:project.creator, 
                    projectRole:ProjectRole.ProjectManager,
                }) ;
            } 

            userIds.push(project.creator) ;
                
        // remove project member        
        for(const pm  of await ProjectMemberModel.find({projectId:project._id}).where('userId').nin(userIds).exec()) {            
            await pm.remove() ;            
        };

        // append or insert
        for(const projectMember of member ){
            const projectMemberFilter = {projectId:project._id,userId:projectMember.userId} ;
            let pm = await ProjectMemberModel.findOne(projectMemberFilter).exec() ;

            if(pm) {
                if(pm.projectRole != projectMember.projectRole) {                
                    pm.projectRole = projectMember.projectRole ;                
                    await pm.save();
                }
            }else{

                pm = await ProjectMemberModel.create( {...projectMemberFilter,projectRole:projectMember.projectRole});
            
                ProjectMemberModel.emit(RepoOperation.Created, pm) ;
            }

            if(pm.userId == project.creator && pm.status!=MemberStatus.Confirmed ){
                pm.status = MemberStatus.Confirmed ;
                await pm.save() ;                
            }
            
        }        

    }    


    /** create project  */
    async create(dto){
        const project = await super.create(dto) ;

        const members = [];

        await this.setProjectMember(project,members);

        return await this.getProjectMember(project)  ;

    }    

    /** update project info */
    async update(id,dto) {
        const {member,...projectDto} = dto ;

        const project = await super.update(id,projectDto) ;

        if (project && member){
            await this.setProjectMember(project, member);   
            
            return await this.getProjectMember(project)  ;
        } else {
            return project ;
        }
               
    };

    async memberConfirm(dto:{id:string,userId:string,status}){
        const pm = await ProjectMemberModel.findOne({projectId:dto.id, userId:dto.userId}).exec() ;
        if(pm ){
            pm.status = dto.status || MemberStatus.Confirmed ;
            await pm.save() ;

            return pm ;
        }

    }
}

