import { DocumentType } from '@typegoose/typegoose' ;
import { ModelQueryService  } from '@app/modules/query';
import { NotFoundError, NotAcceptableError, UnauthorizedError } from 'routing-controllers';
import * as randToken from 'rand-token';
import { UserModel, User } from '../models/user';
import { RepoOperation, SiteRole, ActionStatus } from '@app/defines';
import { PendingActionModel } from '@app/models';
import { DbService } from './db.service';
import { Types } from 'mongoose';
import { EventModel } from '@app/models/notification';

/**
 * Invitation service
 */
export class NotificationService {


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
     

   async publish(type:string,action:string,data:any,sender:Types.ObjectId) {
       const ev = await EventModel.create({sender,type,action,data})

   }


 
}