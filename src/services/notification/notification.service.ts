import { DocumentType } from '@typegoose/typegoose';
import { ModelQueryService } from '@app/modules/query';
import { NotFoundError, NotAcceptableError, UnauthorizedError } from 'routing-controllers';
import * as randToken from 'rand-token';
import { UserModel, User } from '../../models/user';
import { RepoOperation, SiteRole, ActionStatus, NotificationAction, NotificationTopic, NotificationStatus } from '@app/defines';
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


    async status(dto: { id: string, status: string, userId?: string }) {
        const doc = await NotificationModel.findById(dto.id).exec();
        if (doc != null) {
            if (String(doc.receiver) != dto.userId) {
                throw new NotAcceptableError('current user permission limited')
            }

            doc.status = dto.status;
            doc.save();
            return doc;
        }
    }


    /**
     * action user by email     
     * @param query 
     */
    async list(query: any) {
        return await DbService.list(NotificationModel, query);
    }

    async deleteAllByReceiver(receiver: string | Types.ObjectId) {
        await NotificationModel.updateMany({ receiver: receiver }, { status: NotificationStatus.Deleted }).exec();
        return { user: receiver, time: Date.now() };
    }


    async publish(type: NotificationTopic | string, action: NotificationAction | string, data: any, sender: Types.ObjectId) {
        
        const ev = await EventModel.create({ sender, type, action, data })
        const expressionEval=(data) => {
            const expr = typeof(data)==typeof('')?{val:data,path:"action"}:data;
            const keys = String(expr.path).split('.') ;
            let v = ev ;
            for(const k of keys ){
                if(Object.keys(v).includes(k)){
                    v = v[k] ;
                }else{
                    return false ;
                }                
            }
            
            return String(v) == expr.val ;
        };
        for (const cfg of notificationConfig) {
            if (cfg.topic != type) continue;

            for (const actionConfig of cfg.actions) {
                const expressions = actionConfig.expressions ;
                
                if (expressions.every(x => expressionEval(x))) {
                    const cfgActions = await actionConfig.action(ev);
                    for (const cfgSender of cfgActions) {
                        try {
                            await executeNotificationSend(cfgSender);
                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            }
        }
    }


}

