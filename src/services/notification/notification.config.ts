import { Event, EventModel, Notification, NotificationModel } from '@app/models/notification';
import { DocumentType, types } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InvitationContact, InvitationGroup, InvitationProject } from '@app/models';
import Container from 'typedi';
import { NotificationTopic, NotificationAction } from '@app/defines';
import { NotificationSenderConfigInterface } from './sender';

interface EventHandler {
    (ev: DocumentType<Event>): Promise<Array<NotificationSenderConfigInterface>>;
}
interface EventHandlerConfig {
    topic: string,
    expressions: Array<{ property: string, value: string }>
    action: EventHandler
}

const invitationResponseNotifyForApiAction = async (ev: DocumentType<Event>) => {

    const receiver = ev.type == NotificationTopic.InvitationContact ? (ev.data as InvitationContact).data.userId
        : ev.type == NotificationTopic.InvitationGroup ? (ev.data as InvitationGroup).data.userId
            : ev.type == NotificationTopic.InvitationProject ? (ev.data as InvitationProject).data.userId : null;

    const ret: Array<NotificationSenderConfigInterface> = [];

    if (receiver) {
        ret.push({
            executor: 'db',
            receiver,
            data: {
                event: ev._id,
            }

        });
    }

    return ret;
}

function invitationNotifyForMailAction<T extends InvitationContact>() {

    const action = async (ev: DocumentType<Event>) => {
        const doc = (ev.data as T);
        const ret: Array<NotificationSenderConfigInterface> = [];
        ret.push({
            executor: 'mail',
            receiver: doc.receiver as Types.ObjectId,
            data: {
                template: 'invitation',
                data: doc,
            }
        });

        return ret;
    };
    return action;
}

const invitationContactNotifyForMailAction = invitationNotifyForMailAction();

const invitationGroupNotifyForMailAction = invitationNotifyForMailAction();

const invitationProjectNotifyForMailAction = invitationNotifyForMailAction();


export const notificationConfig: Array<EventHandlerConfig> = [];
notificationConfig.push(
    {
        topic: NotificationTopic.InvitationContact,
        expressions: [{ property: 'action', value: NotificationAction.Invite }],
        action: invitationContactNotifyForMailAction,
    },

    {
        topic: NotificationTopic.InvitationContact,
        expressions: [{ property: 'action', value: NotificationAction.Accept }],
        action: invitationResponseNotifyForApiAction,
    },

    {
        topic: NotificationTopic.InvitationContact,
        expressions: [{ property: 'action', value: NotificationAction.Reject }],
        action: invitationResponseNotifyForApiAction,
    },

    {
        topic: NotificationTopic.InvitationGroup,
        expressions: [{ property: 'action', value: NotificationAction.Invite }],
        action: invitationGroupNotifyForMailAction,
    },

    {
        topic: NotificationTopic.InvitationGroup,
        expressions: [{ property: 'action', value: NotificationAction.Accept }],
        action: invitationResponseNotifyForApiAction,
    },

    {
        topic: NotificationTopic.InvitationGroup,
        expressions: [{ property: 'action', value: NotificationAction.Reject }],
        action: invitationResponseNotifyForApiAction,
    },

    //notification config define for Invitation Project
    {
        topic: NotificationTopic.InvitationProject,
        expressions: [{ property: 'action', value: NotificationAction.Invite }],
        action: invitationProjectNotifyForMailAction,
    },
    
    {
        topic: NotificationTopic.InvitationProject,
        expressions: [{ property: 'action', value: NotificationAction.Accept }],
        action: invitationResponseNotifyForApiAction,
    },

    {
        topic: NotificationTopic.InvitationProject,
        expressions: [{ property: 'action', value: NotificationAction.Reject }],
        action: invitationResponseNotifyForApiAction,
    },
);

