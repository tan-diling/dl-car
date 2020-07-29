import { UserModel, Operation, ModelQueryService  } from '@packages/mongoose';
import { DocumentType } from '@typegoose/typegoose' ;
import { NotFoundError, NotAcceptableError, UnauthorizedError } from 'routing-controllers';
import { GroupModel, Group, GroupMemberModel, GroupMember } from '../../model/group';
import { GroupRole, GroupMemberStatus } from '../constant';
/**
 * group service
 */
export class GroupService {

    private queryService= new ModelQueryService() ;
    constructor() {
    }


    async getGroupMembers(docs: DocumentType<Group> []){

        const ids = docs.map(x=>x._id) ;

        const pms = await GroupMemberModel.find({}).where('groupId').in(ids).exec() ;

        const convert = (groups:DocumentType<Group> [],members:DocumentType<GroupMember>[])=>{
            return docs.map(x=>{
                const memberList = members.filter(y=>y.groupId==x.id)                
                                        .map(z=>{
                                            return z.toJSON() ;                        
                                        }) ;
                    
                return {
                    ... x.toJSON(),
                    members:memberList 
                };       
            });
        };

        return convert(docs,pms) ;        
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
        const groupList =  await this.queryService.list(GroupModel,query) ;

        return await this.getGroupMembers(groupList as  DocumentType<Group>[]) ;
    }

    /**
     * get by id
     * @param id 
     */
    async getById(id:string){
        return await GroupModel.findById(id).exec() ;
    }

    /**
     * update info
     * @param id  id
     * @param dto 
     */
    async update(id:string,dto:any){
        const doc = await this.getById(id) ;
        if(doc){
            return UserModel.findByIdAndUpdate(id,dto,{new:true}).exec() ;            
        }

        return null ;
    }

    /**
     * delete user
     * @param id 
     * @param dto 
     */
    async delete(id){
        const doc = await this.getById(id) ;
        if(doc){
            doc.deleted = true ;
            return await doc.save() ;
        }

        return null ;
    }

 
}