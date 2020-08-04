import { ModelQueryService  } from '@app/modules/query';
import { DocumentType } from '@typegoose/typegoose' ;
import { NotFoundError, NotAcceptableError, UnauthorizedError, MethodNotAllowedError } from 'routing-controllers';
import { GroupModel, Group, GroupMemberModel, GroupMember } from '../../models/group';
import { GroupRole, GroupMemberStatus, RequestContext, RequestOperation, SiteRole } from '@app/defines';
import { model, Types } from 'mongoose';
import { UserModel } from '../../models/user';
/**
 * group service
 */
export class GroupService {

    childModels = [{name:"member",ref:"GroupMember",localField:"_id", foreignField:"groupId"} ] ;

    private queryService= new ModelQueryService() ;
    constructor() {
       
    }


    async checkPermission(ctx: RequestContext) {
        if (ctx.user?.role == SiteRole.Admin)
            return;


        switch (ctx.method) {
            case RequestOperation.CREATE:
                if(ctx.resourceId){
                    if( await this.checkGroupMemberPermission(ctx.resourceId,ctx.user.id,true)) {
                        throw new MethodNotAllowedError('permission check: member');
                    }

                }
                break;
            case RequestOperation.RETRIEVE:
                
                if (ctx.user?.id != ctx.filter?.memberUserId)
                    throw new MethodNotAllowedError('permission check: member');

                break;
            case RequestOperation.UPDATE:
                
                // // other site_user can update his/her self information
                // if (ctx.user?.id != ctx.filter?.owner)
                //     throw new MethodNotAllowedError('permission check error');

                // // user info:"role" , "defaultContact" maintained by 'admin'
                // if (ctx.dto?.role != null || ctx.dto?.defaultContact != null)
                //     throw new MethodNotAllowedError('permission check error');
                break;
            case RequestOperation.DELETE:
                if( await this.checkGroupMemberPermission(ctx.resourceId,ctx.user.id,true)) {
                    throw new MethodNotAllowedError('permission check: member');
                }
                break;
            default:
                throw new MethodNotAllowedError('permission check: server');
        }
    }

    private async checkGroupMemberPermission(groupId,userId,update=false){
        const gm = await GroupMemberModel.findOne({userId,groupId}).exec() ;
        if (gm){
            return update?gm.groupRole==GroupRole.Manager:true ;
        }        
    }

    async getGroupMembers(docs: DocumentType<Group> []){
        let objList = docs.map(x=>x.toObject());

        for(const element of this.childModels){
            const {name, ref, localField, foreignField } = element ;
            const childModel = model(ref) ;
            const values = docs.map(x=>x.get(localField)) ;

            const childList = await childModel.find().where(foreignField).in(values).exec() ;

            for(const obj of objList){
                let localValue = obj[localField] ;
               
                obj[name] = childList
                        .filter(x=> localValue?.equals ? localValue?.equals(x.get(foreignField)) : x.get(foreignField)==localValue)
                        .map(z=>z.toObject()) ;
            }
        };
        
        return objList ;
        // const ids = docs.map(x=>x._id) ;

        // const pms = await GroupMemberModel.find({}).where('groupId').in(ids).exec() ;

        // const convert = (groups:DocumentType<Group> [],members:DocumentType<GroupMember>[])=>{
        //     return docs.map(x=>{
        //         const memberList = members.filter(y=>y.groupId==x.id)                
        //                                 .map(z=>{
        //                                     return z.toJSON() ;                        
        //                                 }) ;
                    
        //         return {
        //             ... x.toJSON(),
        //             members:memberList 
        //         };       
        //     });
        // };

        // return convert(docs,pms) ;        
    }

    async getGroupMember(doc: DocumentType<Group>){

        return (await this.getGroupMembers([doc])) [0] ;
    }
    

    /**
     * create an new group
     * @param dto 
     */
    async create(dto: {name:string, description:string, owner:string, email:string }) {
        const {email,...groupDto} = dto ;
        // groupDto.owner = groupDto.owner || user._id

        const group = new GroupModel(groupDto) ;
        await group.save() ;

        await GroupMemberModel.create({
            groupId:group._id,
            userId: group.owner,
            email: dto.email,
            groupRole: GroupRole.Manager,
            status: GroupMemberStatus.Confirmed,
        }) ;

        // GroupModel.emit(Operation.Created, group) ;
        return await this.getGroupMember(group);
    }

    /**
     * user handle group invited, action accept or reject
     * @param dto 
     */
    async responseInvited( dto:{email:string, id:string, status?:string }) {

        // let user = await this.getById(dto.id) ;
        // if (user != null &&  user.email == dto.email ) {
        //     user.emailValidated = true ;
        //     await user.save() ;
        //     return ;
        // }

        // throw new NotAcceptableError('user id or email error') ;        
    }    

    /**
     *  list
     * @param query 
     */
    async list(query:any){
        let { memberUserId, ...filter } = query ;
        if(memberUserId){
            const pms = await GroupMemberModel.find({userId:memberUserId}).exec() ;
            if(pms.length==0) 
                return [] ;
            const ids = pms.map(x=>String(x.groupId)) ;
            filter = {...filter,_id:ids};
        }
        const groupList =  await this.queryService.list(GroupModel,filter) ;

        return await this.getGroupMembers(groupList as  DocumentType<Group>[]) ;
    }

    /**
     *  child model query
     * @param query 
     */
    async listMember(id:string){        
        return await GroupMemberModel.find({groupId:id}).populate("userId").exec();
    }
        

    /**
     *  child model create
     */ 
    async appendMember(id:string,dto){
        const group = await GroupModel.findById(id).exec() ;
        if( ! group ) return null;

        const groupId= group._id ;
        const {email,groupRole} = dto
        const user = await UserModel.findOne({email}).exec();
        const groupMember = await GroupMemberModel.findOneAndUpdate(
            { groupId,email },
            { groupId,email, groupRole, userId:user?._id },
            { upsert:true, new:true },
            ).exec();

        return groupMember ;

    }

    /**
     *  child model delete
     */
    async deleteMember(id:string,dto){

        const {email} = dto

        const groupMember = await GroupMemberModel.findOne({groupId:id,email}).exec();

        if(groupMember){
            await groupMember.remove();
        }
        return groupMember ;
    }

    /**
     * get by id
     * @param id 
     */
    async getById(id:string){
        const group = await GroupModel.findById(id).exec() ;
        if(group){
            return await this.getGroupMember(group) ;
        }
    }

    /**
     * update info
     * @param id  id
     * @param dto 
     */
    async update(id:string,dto:any){
        let doc = await this.getById(id) ;
        if(doc){
            doc = GroupModel.findByIdAndUpdate(id,dto,{new:true}).exec() ;  
            
            return doc ; 
        }
    }

    /**
     * delete user
     * @param id 
     * @param dto 
     */
    async delete(id){
        const doc =  await GroupModel.findById(id).exec() ; ;
        if(doc){
            doc.deleted = true ;
            return await doc.save() ;
        }

        return null ;
    }

 
}