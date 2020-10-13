
import { Event, EventModel, Notification, NotificationModel } from '@app/models/notification';
import { DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InvitationContact } from '@app/models';
import Container from 'typedi';

export enum NotificationTopic{
    InvitationContact="InvitationContact",
    InvitationGroup="InvitationGroup",
    InvitationProject="InvitationProject",
}

export enum NotificationAction{
    
    Accept="Accepted",
    Reject="Rejected",
}


interface NotificationSenderInterface {
    execute(data?: any): void | Promise<void>;
}

class DbNotificationSender implements NotificationSenderInterface {
    async execute(data: { receiver: Types.ObjectId, event: Types.ObjectId, message: string }) {
        await NotificationModel.create(data);
    }
}

const dbNotificationSender = Container.get(DbNotificationSender);

interface EventHandler {
    (ev: DocumentType<Event>): void | Promise<void>;
}
interface EventHandlerConfig {
    topic: string,
    expressions: Array<{ property: string, value: string }>
    action: EventHandler
}

export const notificationConfig: Array<EventHandlerConfig> = [];
notificationConfig.push(
    {
        topic: NotificationTopic.InvitationContact,
        expressions: [{ property: 'action', value: NotificationAction.Accept }],
        action: async (ev: DocumentType<Event>) => {
            // if(ev.data.__t =="InvitationContact") 
            {
                const doc = ev.data as InvitationContact;
                const receiver = doc.data.userId as Types.ObjectId;
                await dbNotificationSender.execute({
                    receiver,
                    event: ev._id,
                    message: ``
                });
            }
        },
    },

    {
        topic: NotificationTopic.InvitationContact,
        expressions: [{ property: 'action', value: NotificationAction.Reject }],
        action: async (ev: DocumentType<Event>) => {
            // if(ev.data.__t =="InvitationContact") 
            {
                const doc = ev.data as InvitationContact;
                const receiver = doc.data.userId as Types.ObjectId;
                await dbNotificationSender.execute({
                    receiver,
                    event: ev._id,
                    message: ``
                });
            }
        },
    },
);

