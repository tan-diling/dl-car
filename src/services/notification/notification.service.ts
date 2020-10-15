import { DocumentType } from '@typegoose/typegoose' ;
import { ModelQueryService  } from '@app/modules/query';
import { NotFoundError, NotAcceptableError, UnauthorizedError } from 'routing-controllers';
import * as randToken from 'rand-token';
import { UserModel, User } from '../../models/user';
import { RepoOperation, SiteRole, ActionStatus, NotificationAction, NotificationTopic } from '@app/defines';
import { PendingActionModel } from '@app/models';
import { DbService } from '../db.service';
import { Types } from 'mongoose';
import { EventModel, NotificationModel } from '@app/models/notification';
import { notificationConfig } from './notification.config';
import { NotificationSenderInterface, executeNotificationSend } from './sender';

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
     
    async publish(type:NotificationTopic|string,action:NotificationAction|string,data:any,sender:Types.ObjectId) {
        const ev = await EventModel.create({sender,type,action,data})
        for(const cfg of notificationConfig){
            if(cfg.topic!=type) continue ;

            if(cfg.expressions.every(x=>String(ev[x.property])==x.value)){               
                const cfgActions = await cfg.action(ev) ;
                for(const cfgSender of cfgActions){
                    try{
                        await executeNotificationSend(cfgSender) ;
                    }catch(err){
                        console.log(err) ;
                    }
                }
            }
        }
    }

 
}

