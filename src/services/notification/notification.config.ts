import { Event, EventModel, Notification, NotificationModel } from '@app/models/notification';
import { DocumentType, types } from '@typegoose/typegoose';
import { Types, isValidObjectId } from 'mongoose';
import { InvitationContact, InvitationGroup, InvitationProject, Resource, ProjectMember } from '@app/models';
import Container from 'typedi';
import { NotificationTopic, NotificationAction, ProjectRole } from '@app/defines';
import { executeNotificationSend } from './sender';
import { Entity, EntityContext } from './entity/entityContext';
import { entityEntityExecuteEval } from './entity';
import { logger } from '@app/config';
import { GroupService } from '../group.service';
import { ContactService } from '../contact.service';

interface EventHandler {
    (ev: DocumentType<Event>): Promise<void>;
}
interface EventHandlerConfig {
    topic: string,
    actions: Array<{
        expressions: Array<{ property: string, value: string } | string>,
        action: EventHandler,
    }>
}

const invitationResponseNotifyForApiAction = async (ev: DocumentType<Event>) => {
    const inviteTypes: string[] = [
        NotificationTopic.Invitation,
    ];
    if (!inviteTypes.includes(ev.type)) {
        throw new Error("not support invite type");
    }
    const receiver = (ev.data as InvitationContact).sender as Types.ObjectId;

    if (receiver) {
        await executeNotificationSend({
            executor: 'db',
            receiver,
            event: ev,
        });
    }
}

function invitationNotifyForMailAction<T extends InvitationContact>() {

    const action = async (ev: DocumentType<Event>) => {
        const doc = (ev.data as T);
        await executeNotificationSend({
            executor: 'mail',
            receiver: doc.receiver as Types.ObjectId,
            event: ev,
            mailTemplate: 'invitation'
        });
    };

    return action;

}

const invitationContactNotifyForMailAction = invitationNotifyForMailAction();

const invitationGroupNotifyForMailAction = invitationNotifyForMailAction();

const invitationProjectNotifyForMailAction = invitationNotifyForMailAction();



//send notification to entity
const entityNotifyAction = async (ev: DocumentType<Event>) => {
    const ctx = (ev.data as EntityContext<Entity>);

    const configs = await entityEntityExecuteEval(ctx);

    for (const cfg of configs) {
        if (cfg.channel.includes('db')) {
            for (const user of cfg.receiver) {
                await executeNotificationSend(
                    {
                        executor: 'db',
                        receiver: new Types.ObjectId(user),
                        event: ev,

                    }

                );
            }
        }

        if (cfg.channel.includes('mail')) {
            for (const user of cfg.receiver) {
                await executeNotificationSend(
                    {
                        executor: 'mail',
                        receiver: new Types.ObjectId(user),
                        event: ev,
                        mailTemplate: 'entity'

                    }

                );
            }
        }
    }
};

//send notification for group
const groupNotifyAction = async (ev: DocumentType<Event>) => {
    if (ev.type != NotificationTopic.Group) {
        return;
    }

    let entity = ev.data.entity;
    let users = entity.members;

    if (!Array.isArray(users)) {
        const groupId = entity.groupId || entity._id;

        const groupServicer = Container.get(GroupService);
        entity = await groupServicer.getById(groupId);

        if (entity == null) {
            throw new Error(`group notify ${ev.data.req?.method} ${ev.data.req?.url}`);
        }

        ev.data.entity = entity;
        await ev.save();

        users = entity.members;

    }

    users = users.map(x => x.userId);
    for (const user of users) {
        await executeNotificationSend(
            {
                executor: 'db',
                receiver: new Types.ObjectId(user),
                event: ev,

            }

        );
    }


};

//send notification for contact
const contactNotifyAction = async (ev: DocumentType<Event>) => {
    if (ev.type != NotificationTopic.Contact) {
        return;
    }

    let entity = ev.data.entity;

    let users = [];
    if (Array.isArray(entity)) {
        users = entity;
    } else {
        users = [entity];
    }

    users = users.map(x => x.userId);
    for (const user of users) {
        if (!isValidObjectId(user)) {
            throw new Error(`contact notify ${ev.data.req?.method} ${ev.data.req?.url}`);
        }

        await executeNotificationSend(
            {
                executor: 'db',
                receiver: new Types.ObjectId(user),
                event: ev,
            }
        );
    }


};

//send notification for user
const userNotifyAction = async (ev: DocumentType<Event>) => {
    if (ev.type != NotificationTopic.User) {
        return;
    }

    let entity = ev.data.entity;

    const contactServicer = Container.get(ContactService);
    const users = await contactServicer.listContactUser(entity._id);

    for (const user of users) {

        await executeNotificationSend(
            {
                executor: 'db',
                receiver: new Types.ObjectId(user._id),
                event: ev,
            }
        );
    }

    // if (!Array.isArray(users)) {

};


export const notificationConfig: Array<EventHandlerConfig> = [];
notificationConfig.push(
    {
        topic: NotificationTopic.Invitation,
        actions: [
            {
                expressions: [NotificationAction.Invite],
                action: invitationContactNotifyForMailAction,
            }, {
                expressions: [NotificationAction.Accept],
                action: invitationResponseNotifyForApiAction,
            }, {
                expressions: [NotificationAction.Reject],
                action: invitationResponseNotifyForApiAction,
            },
        ]

    },
    {
        topic: NotificationTopic.Entity,
        actions: [
            {
                expressions: [],
                action: async (ev: DocumentType<Event>) => {
                    await entityNotifyAction(ev);
                },
            },

        ]
    },
    {
        topic: NotificationTopic.Group,
        actions: [
            {
                expressions: [],
                action: async (ev: DocumentType<Event>) => {
                    await groupNotifyAction(ev);
                },
            },

        ]
    },
    {
        topic: NotificationTopic.Contact,
        actions: [
            {
                expressions: [],
                action: async (ev: DocumentType<Event>) => {
                    await contactNotifyAction(ev);
                },
            },

        ]
    },
    {
        topic: NotificationTopic.User,
        actions: [
            {
                expressions: [],
                action: async (ev: DocumentType<Event>) => {
                    await userNotifyAction(ev);
                },
            },

        ]
    }
);

