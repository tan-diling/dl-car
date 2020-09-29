import { DocumentType } from '@typegoose/typegoose' ;
import { ModelQueryService  } from '@app/modules/query';
import { NotFoundError, NotAcceptableError, UnauthorizedError } from 'routing-controllers';
import * as randToken from 'rand-token';
import { UserModel, User } from '../models/user';
import { RepoOperation, SiteRole, ActionStatus } from '@app/defines';
import { Invitation,InvitationModel, InvitationType,  PendingActionModel, ContactModel } from '@app/models';
import { userCheck } from '@app/loaders/startup/passport';
import { EmailBatch } from '@app/models/email';
import { UserService } from './user.service';
import { Container } from 'typedi';
import { UserProfileUpdateDto } from '@app/controllers/user/dto/user.dto';
import { Types } from 'mongoose';
import { DbService } from './db.service';

/**
 * Invitation service
 */
export class ActionService {


    // private userService:UserService= Container.get(UserService) ;

    // private async inviteContactByUser(userId:string,contact:DocumentType<User>){
    //     const contactUser = await ContactModel.findOne({userId,contact}).exec() ;

    //     if (contactUser!=null){
    //         throw new NotAcceptableError("contact Exists") ;            
    //     }

    //     const pendingInvitation = {
    //         receiver:contact._id,
    //         inviteType: InvitationType.Contact,
    //         data: {
    //             userId:Types.ObjectId(userId),
    //             contact:contact._id,
    //         },
    //     } ;

    //     const invitation = await InvitationModel.findOne({...pendingInvitation,status:ActionStatus.Pending}).exec() ;
    //     if (invitation!=null){
    //         throw new NotAcceptableError("Invitation Exists") ;            
    //     }
            
    //     return await InvitationModel.create(pendingInvitation) ;          
    // }

    // /**
    //  * invite user by email
    //  * @param dto 
    //  */
    // async inviteContact(dto: {userId,email}) {
    //     const defaultInvitationUser = {name:'Invitation User',company:'',role:SiteRole.Client} ;
    //     let contactUser = await this.userService.getByEmail(dto.email);        

    //     if (contactUser == null){
    //         contactUser = await this.userService.create({...defaultInvitationUser, email:dto.email}) ;
    //     } 

        
    //     return await this.inviteContactByUser(dto.userId,contactUser) ;

    // }

    // /**
    //  * invite user by email
    //  * @param dto 
    //  */
    // async addDefaultContact(userId:string) {
    //     const user = await this.userService.getById(userId) ;
    //     let n = 0 ;
    //     for(const user of await UserModel.find({defaultContact:true}).exec()){
    //         if(user.deleted==false && user.defaultContactAccept==true ){
    //             await this.createUserContact(userId,user._id) ;                
    //             // UserCo
    //             n++ ;
    //         }
    //     }

    //     return n ;        
    // }

    // private async createUserContact(user:string,contact:string) {
    //     {
    //     const filter = {userId:user,contact};
    //     const c = await ContactModel.findOne(filter).exec() ;
    //     if(c == null){
    //         return await ContactModel.create(filter);
    //         }
    //     }

    //     {
    //         const filter = {userId:contact,contact:user};
    //         const c = await ContactModel.findOne(filter).exec() ;
    //         if(c == null){
    //             return await ContactModel.create(filter);
    //         }
    //     }
    //     return ;
    // }

    // private async removeUserContact(user:string,contact:string) {
    //     {
    //         const filter = {userId:user,contact};
    //         await ContactModel.findOneAndRemove(filter).exec() ;
        
    //     }

    //     {
    //         const filter = {userId:contact,contact:user};
    //         await ContactModel.findOneAndRemove(filter).exec() ;            
    //     }
    //     return ;
    // }

    async status(dto:{id:string,status:ActionStatus,userId?:string}){        
        const action = await PendingActionModel.findById(dto.id).exec() ;
        if(action !=null){
            if(String(action.receiver) != dto.userId) {
                throw new NotAcceptableError('current user permission limited')
            }
            await action.changeStatus(dto.status) ;
            
            return action ;
        }
    }


    /**
     * action user by email     
     * @param query 
     */
    async list(query:any){
        return await DbService.list(PendingActionModel,query) ;
    }
     


 
}