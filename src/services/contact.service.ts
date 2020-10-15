import { DocumentType } from '@typegoose/typegoose' ;
import { ModelQueryService  } from '@app/modules/query';
import { NotFoundError, NotAcceptableError, UnauthorizedError } from 'routing-controllers';
import * as randToken from 'rand-token';
import { UserModel, User } from '../models/user';
import { RepoOperation, SiteRole, ActionStatus, ResourceType, NotificationAction, NotificationTopic } from '@app/defines';
import { Contact,ContactModel,  InvitationContactModel, PendingAction, GroupMemberModel } from '@app/models';
import { DbService } from './db.service';
import { UserService } from './user.service';
import { Container } from 'typedi';
import { Types } from 'mongoose';
import { ActionService } from './action.service';
/**
 * Contact service
 */
export class ContactService {

    private userService= Container.get(UserService) ;

    private actionService= Container.get(ActionService) ;


    /**
     *  list
     * @param query 
     */
    async list(query:any){        
        return await DbService.list(ContactModel,query) ;
    }

     /**
     *  list
     * @param query 
     */
    async listContact(userId:string){        
        return {
            contacts:await this.listContactUser(userId),
            invitation: await this.listPendingActionUser(userId),
        }
    }

    /**
     *  contact list
     * @param query 
     */
    async listContactUser(userId:string){   
        const l = await ContactModel.find({userId}).exec() ;
        return UserModel.find().where('_id').in(l.map(x=>x.contact));
    }
    
    async listPendingActionUser(userId:string){   
        const l = await InvitationContactModel.find({"data.userId":Types.ObjectId(userId),status:ActionStatus.Pending}).exec() ;
        return UserModel.find().where('_id').in(l.map(x=>x.receiver));
    }

    /**
     * delete an new user
     * @param dto 
     */
    async delete(userId:string,id:string) {
        const contactUser = await ContactModel.findOne({userId,contact:id}).exec() ;

        if (contactUser==null){
            return {result:false} ;            
        }
        
        await Contact.removeContact(userId,id) ; 
        return {result:true};
    }


    /**
     * invite contact user to user's contact 
     * @param inviter user id who is send out invitation
     * @param invitee user id who is being invited
     */
    private async inviteContactByUser(inviter:string,invitee:Types.ObjectId){
        // const contactUserObjectId = Types.ObjectId(contactUser) ;
        if(inviter== String(invitee)){
            throw new NotAcceptableError("contact add self error") ;            
        }

        const user = await this.userService.getById(inviter) ;

        if (user == null){
            throw new NotAcceptableError("user not exists") ;            
        }



        const contact = await ContactModel.findOne({userId: inviter,contact:invitee}).exec() ;

        if (contact!=null){
            throw new NotAcceptableError("contact exists") ;            
        }

        const invitationData = {
                userId:user._id,
                contact:invitee,        
        } ;

        const invitation = await InvitationContactModel.findOne({data:invitationData, status:ActionStatus.Pending}).exec() ;
        if (invitation!=null){
            throw new NotAcceptableError("Invitation Exists") ;            
        }
        
        return await this.actionService.create(InvitationContactModel,{
            receiver:invitee,
            data: {
                userId:user._id,
                contact:invitee,
                name: user.name,
            },
            sender: user._id
        
        }) ;       
        
    }

    /**
     * invite sb to user's contact by email
     * @param dto 
     */
    async inviteContact(dto: {userId,email}) {
        const contactUser = await this.userService.getUserByEmailForce(dto.email) ;        
        
        return await this.inviteContactByUser(dto.userId,contactUser._id) ;

    }

    /**
     * invite all group member to user's contact
     * @param userId user id
     * @param groupId group id
     */
    async inviteContactByGroup(userId:string, groupId:string) {
        const gmList = await GroupMemberModel.find({groupId,}).exec() ;
        
        const contactInfo = await this.listContact(userId);

        let result = [] ;

        for(const gm of gmList){
            const contactUser = gm.userId as Types.ObjectId;
            //skip self
            if(contactUser.equals(userId)) continue ;

            //skip already exists contact
            const existContact = null != contactInfo.contacts.find(x=>contactUser.equals(x._id)) ;
            if(existContact) continue ;

            //skip already exists invitation
            const existInvitation = null != contactInfo.invitation.find(x=>contactUser.equals(x._id)) ;
            if(existInvitation) continue ;

            try {
                const invitation = await this.inviteContactByUser(userId,contactUser) ;
                result.push(invitation) ;
            }catch(err) {
                console.error("inviteGroup "+String(err));
            }

            
        }
        
        return result ;
    }

    /**
     * all all defaultContact users to user' contact
     * @param userId user id 
     */
    async addDefaultContact(userId:string) {
        const user = await this.userService.getById(userId) ;
        let n = 0 ;
        for(const user of await UserModel.find({defaultContact:true}).exec()){
            if(user.isNormal() && user.defaultContactAccept==true ){
                await Contact.appendContact(userId,user._id) ;                
                // UserCo
                n++ ;
            }
        }

        return n ;        
    }

 
}