
import { Event, EventModel, Notification, NotificationModel } from '@app/models/notification';
import { DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InvitationContact, InvitationGroup, InvitationProject } from '@app/models';
import Container from 'typedi';
import { NotificationTopic, NotificationAction } from '@app/defines';

interface NotificationSenderInterface {
    execute(data?: any): void | Promise<void>;
}

class DbNotificationSender implements NotificationSenderInterface {
    async execute(data: { receiver: Types.ObjectId, event: Types.ObjectId, message?: string }) {
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

const invitationResponseNotifyForApiAction = async (ev: DocumentType<Event>) => {
    
    const receiver = ev.type == NotificationTopic.InvitationContact ? (ev.data as InvitationContact).data.userId 
        : ev.type == NotificationTopic.InvitationGroup ? (ev.data as InvitationGroup).data.userId 
        : ev.type == NotificationTopic.InvitationProject ? (ev.data as InvitationProject).data.userId:null  ;
        
    if(receiver)    
    {        
        await dbNotificationSender.execute({
            receiver,
            event: ev._id,
            // message: ``
        });
    }
}


export const notificationConfig: Array<EventHandlerConfig> = [];
notificationConfig.push(
    {
        topic: NotificationTopic.InvitationContact,
        expressions: [{ property: 'action', value: NotificationAction.Accept }],
        action: invitationResponseNotifyForApiAction ,
    },

    {
        topic: NotificationTopic.InvitationContact,
        expressions: [{ property: 'action', value: NotificationAction.Reject }],
        action: invitationResponseNotifyForApiAction ,
    },

    {
        topic: NotificationTopic.InvitationGroup,
        expressions: [{ property: 'action', value: NotificationAction.Accept }],
        action: invitationResponseNotifyForApiAction ,
    },

    {
        topic: NotificationTopic.InvitationGroup,
        expressions: [{ property: 'action', value: NotificationAction.Reject }],
        action: invitationResponseNotifyForApiAction ,
    },

    {
        topic: NotificationTopic.InvitationProject,
        expressions: [{ property: 'action', value: NotificationAction.Accept }],
        action: invitationResponseNotifyForApiAction ,
    },

    {
        topic: NotificationTopic.InvitationProject,
        expressions: [{ property: 'action', value: NotificationAction.Reject }],
        action: invitationResponseNotifyForApiAction ,
    },
);

