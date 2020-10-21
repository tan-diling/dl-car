import { DocumentType } from '@typegoose/typegoose';
import { ModelQueryService } from '@app/modules/query';
import { NotFoundError, NotAcceptableError, UnauthorizedError } from 'routing-controllers';
import * as randToken from 'rand-token';
import { UserModel, User } from '../models/user';
import { RepoOperation, SiteRole } from '@app/defines';
import { Types } from 'mongoose';
import { ConversationModel, MessageModel, ConversationMemberModel, ConversationMember } from '@app/models';
import { compileFunction } from 'vm';
import { timingSafeEqual } from 'crypto';

/**
 * user service
 */
export class ConversationService {

    private queryService = new ModelQueryService();
    constructor() {
    }

    /**
     * get conversation list 
     * @param userId user id
     */
    async listByUser(user:Types.ObjectId) {
        const cms = await ConversationMemberModel.find({user,isDeleted:false}).exec() ;
        return ConversationModel.find().where("_id").in(cms.map(x=>x.conversation)).populate('members').exec() ;        
    }

    /**
     * get conversation by id 
     * 
     */
    async getById(id:string|Types.ObjectId) {
        return await ConversationModel.findById(id).populate('members').exec() ;        
    }

    async listMessage(conversation:Types.ObjectId) {
        await MessageModel.find(conversation).exec() ;
    }

    /**
     * create an new group conversation
     * @param dto 
     */
    async createGroupConversation(data:{title:string,image?:string}) {
        const conversation = await ConversationModel.create({...data,isGroup:true}) ;
        return conversation ;        
    }

    async updateConversation(id:string|Types.ObjectId,data:{title:string,image?:string}) {
        const conversation = await ConversationModel.findById(id).exec() ;
        if(conversation){
            conversation.title = data.title ;
            conversation.image = data.image ;
            await conversation.save();
            return conversation ;
        }
    }

    async appendMember(id:string|Types.ObjectId,users:string[]){
        const conversation = await ConversationModel.findById(id).exec() ;
        if(conversation ){
            if(! conversation.isGroup){
                throw new NotAcceptableError('not group conversation error');
            }

            for(const user of users){
                await ConversationMemberModel.findOneAndUpdate({user:user,conversation:conversation._id},{enter:new Date(),isDeleted:false},{upsert:true}).exec() ;
            }

            return conversation ;
        }
    }

    async removeMember(id:string|Types.ObjectId,users:string[]){
        const conversation = await ConversationModel.findById(id).exec() ;
        if(conversation){
            if(! conversation.isGroup){
                throw new NotAcceptableError('not group conversation error');
            }

            for(const user of users){
                await ConversationMemberModel.findOneAndUpdate({user:user,conversation:conversation._id},{leaveAt:new Date(),isDeleted:true}).exec() ;
            }

            return conversation ;
        }
    }

    async forceConversation(user1:string|Types.ObjectId,user2:string|Types.ObjectId) {
        const conversationList = await ConversationModel.find({isGroup:false}).populate('members').exec() ;        
        for(const conversation of conversationList){
            const members = conversation.members as Array<ConversationMember> ;
            const user1Member = members.find(x=>String(x.user)==String(user1)) ;
            const user2Member = members.find(x=>String(x.user)==String(user2)) ;

            if(user1  && user2){
                return conversation ;
            }
        }
 
        const conversation = await ConversationModel.create({isGroup:false})

        await ConversationMemberModel.create({user:user1,conversation:conversation._id}) ;
        await ConversationMemberModel.create({user:user2,conversation:conversation._id}) ;

        return conversation ;
    }


}