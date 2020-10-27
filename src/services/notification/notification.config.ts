import { Event, EventModel, Notification, NotificationModel } from '@app/models/notification';
import { DocumentType, types } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InvitationContact, InvitationGroup, InvitationProject, Resource, ProjectMember } from '@app/models';
import Container from 'typedi';
import { NotificationTopic, NotificationAction, ProjectRole } from '@app/defines';
import { executeNotificationSend } from './sender';
import { Entity, EntityContext } from './expression/entityContext';
import { entityEntityExecuteEval } from './expression';

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
        // NotificationTopic.InvitationContact, 
        // NotificationTopic.InvitationGroup, 
        // NotificationTopic.InvitationProject
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


//send notification to project_manager
const projectNotifyToProjectManagerAction = async (ev: DocumentType<Event>) => {
    const doc = (ev.data as Resource);

    const members = doc.members as Array<ProjectMember>;
    for (const x of members.filter(x => x.projectRole == ProjectRole.ProjectManager)) {
        await executeNotificationSend(
            {
                executor: 'db',
                receiver: x.userId as Types.ObjectId,
                event: ev,

            }
        );
    }
};


//send notification to project assignee
const projectNotifyToAssigneeAction = async (ev: DocumentType<Event>) => {
    const doc = (ev.data as Resource);
    for (const x of doc.assignees) {
        await executeNotificationSend({
            executor: 'db',
            receiver: x as Types.ObjectId,
            event: ev,
        });
    }
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
    // {
    //     topic: NotificationTopic.InvitationContact,
    //     actions: [
    //         {
    //             expressions: [{ property: 'action', value: NotificationAction.Invite }],
    //             action: invitationContactNotifyForMailAction,
    //         },{
    //             expressions: [{ property: 'action', value: NotificationAction.Accept }],
    //             action: invitationResponseNotifyForApiAction,
    //         },{
    //             expressions: [{ property: 'action', value: NotificationAction.Reject }],
    //             action: invitationResponseNotifyForApiAction,
    //         },
    //     ]

    // },

    // {
    //     topic: NotificationTopic.InvitationGroup,
    //     actions: [
    //         {
    //             expressions: [{ property: 'action', value: NotificationAction.Invite }],
    //             action: invitationGroupNotifyForMailAction,
    //         },{
    //             expressions: [{ property: 'action', value: NotificationAction.Accept }],
    //             action: invitationResponseNotifyForApiAction,
    //         },{
    //             expressions: [{ property: 'action', value: NotificationAction.Reject }],
    //             action: invitationResponseNotifyForApiAction,
    //         },
    //     ]
    // },
    // //notification config define for Invitation Project
    // {
    //     topic: NotificationTopic.InvitationProject,
    //     actions: [
    //         {
    //             expressions: [{ property: 'action', value: NotificationAction.Invite }],
    //             action: invitationProjectNotifyForMailAction,
    //         },{
    //             expressions: [{ property: 'action', value: NotificationAction.Accept }],
    //             action: invitationResponseNotifyForApiAction,
    //         },{
    //             expressions: [{ property: 'action', value: NotificationAction.Reject }],
    //             action: invitationResponseNotifyForApiAction,
    //         },
    //     ]
    // },

    {
        topic: NotificationTopic.Entity,
        actions: [
            {
                expressions: [],
                action: async (ev: DocumentType<Event>) => {
                    await entityNotifyAction(ev);
                },
            },
            // {
            //     expressions: [NotificationAction.Created],
            //     action: async (ev: DocumentType<Event>) => {
            //         await projectNotifyToProjectManagerAction(ev);
            //     },
            // }, {
            //     expressions: [NotificationAction.Updated],
            //     action: async (ev: DocumentType<Event>) => {
            //         await projectNotifyToProjectManagerAction(ev);
            //         await projectNotifyToAssigneeAction(ev);
            //     },
            // }, {
            //     expressions: [NotificationAction.Status],
            //     action: async (ev: DocumentType<Event>) => {
            //         await projectNotifyToProjectManagerAction(ev);
            //         await projectNotifyToAssigneeAction(ev);
            //     },
            // }, {
            //     expressions: [NotificationAction.Deleted],
            //     action: async (ev: DocumentType<Event>) => {
            //         await projectNotifyToProjectManagerAction(ev);
            //         await projectNotifyToAssigneeAction(ev);
            //     },
            // },
        ]
    }
);

