import { DocumentType } from '@typegoose/typegoose' ;
import { ModelQueryService  } from '@app/modules/query';
import { NotFoundError, NotAcceptableError, UnauthorizedError } from 'routing-controllers';
import * as randToken from 'rand-token';
import { UserModel, User } from '../models/user';
import { RepoOperation, SiteRole, ActionStatus } from '@app/defines';
import { Contact,ContactModel, InvitationType, InvitationModel, PendingAction, GroupMemberModel } from '@app/models';
import { DbService } from './db.service';
import { UserService } from './user.service';
import { Container } from 'typedi';
import { Types } from 'mongoose';
import { GroupService } from './group.service';

/**
 * Contact service
 */
export class ContactService {

    private userService= Container.get(UserService) ;


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
        const l = await InvitationModel.find({"data.userId":Types.ObjectId(userId),inviteType: InvitationType.Contact,status:ActionStatus.Pending}).exec() ;
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


    private async inviteContactByUser(userId:string,contactUser:Types.ObjectId){
        // const contactUserObjectId = Types.ObjectId(contactUser) ;
        if(userId== String(contactUser)){
            throw new NotAcceptableError("contact add self error") ;            
        }

        const contact = await ContactModel.findOne({userId,contact:contactUser}).exec() ;

        if (contact!=null){
            throw new NotAcceptableError("contact Exists") ;            
        }

        const pendingInvitation = {
            receiver:contactUser,
            inviteType: InvitationType.Contact,
            data: {
                userId:Types.ObjectId(userId),
                contact:contactUser,
            },
        } ;

        const invitation = await InvitationModel.findOne({...pendingInvitation,status:ActionStatus.Pending}).exec() ;
        if (invitation!=null){
            throw new NotAcceptableError("Invitation Exists") ;            
        }
            
        return await InvitationModel.create(pendingInvitation) ;          
    }

    /**
     * invite sb to user's contact by email
     * @param dto 
     */
    async inviteContact(dto: {userId,email}) {
        const defaultInvitationUser = {name:'Invitation User',company:'',role:SiteRole.Client} ;
        let contactUser = await this.userService.getByEmail(dto.email);        

        if (contactUser == null){
            contactUser = await this.userService.create({...defaultInvitationUser, email:dto.email}) ;
        } 

        
        return await this.inviteContactByUser(dto.userId,contactUser._id) ;

    }

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
     * invite user by email
     * @param dto 
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