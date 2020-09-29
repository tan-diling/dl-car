import { DocumentType } from '@typegoose/typegoose' ;
import { ModelQueryService  } from '@app/modules/query';
import { NotFoundError, NotAcceptableError, UnauthorizedError } from 'routing-controllers';
import * as randToken from 'rand-token';
import { UserModel, User } from '../models/user';
import { RepoOperation, SiteRole, ActionStatus } from '@app/defines';
import { Contact,ContactModel, InvitationType, InvitationModel, PendingAction } from '@app/models';
import { DbService } from './db.service';
import { UserService } from './user.service';
import { Container } from 'typedi';
import { Types } from 'mongoose';

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
        await Contact.removeContact(userId,id) ; 
        return {result:true};
    }


    private async inviteContactByUser(userId:string,contact:DocumentType<User>){
        const contactUser = await ContactModel.findOne({userId,contact}).exec() ;

        if (contactUser!=null){
            throw new NotAcceptableError("contact Exists") ;            
        }

        const pendingInvitation = {
            receiver:contact._id,
            inviteType: InvitationType.Contact,
            data: {
                userId:Types.ObjectId(userId),
                contact:contact._id,
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

        
        return await this.inviteContactByUser(dto.userId,contactUser) ;

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