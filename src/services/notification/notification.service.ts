import { DocumentType } from '@typegoose/typegoose' ;
import { ModelQueryService  } from '@app/modules/query';
import { NotFoundError, NotAcceptableError, UnauthorizedError } from 'routing-controllers';
import * as randToken from 'rand-token';
import { UserModel, User } from '../../models/user';
import { RepoOperation, SiteRole, ActionStatus } from '@app/defines';
import { PendingActionModel } from '@app/models';
import { DbService } from '../db.service';
import { Types } from 'mongoose';
import { EventModel, NotificationModel } from '@app/models/notification';
import { notificationConfig } from './notification.handler';

/**
 * Notification service
 */
export class NotificationService {


    async status(dto:{id:string,status:string,userId?:string}){        
        const doc = await NotificationModel.findById(dto.id).exec() ;
        if(doc !=null){
            if(String(doc.receiver) != dto.userId) {
                throw new NotAcceptableError('current user permission limited')
            }
            
            doc.status = dto.status ;
            doc.save();
            return doc ;
        }
    }


    /**
     * action user by email     
     * @param query 
     */
    async list(query:any){
        return await DbService.list(NotificationModel,query) ;
    }
     
   async publish(type:string,action:string,data:any,sender:Types.ObjectId) {
       const ev = await EventModel.create({sender,type,action,data})
       for(const handler of notificationConfig){
           if(handler.topic!=type) continue ;

           if(handler.expressions.every(x=>String(ev[x.property])==x.value)){               
               await handler.action(ev) ;
           }
       }
   }
 
}

