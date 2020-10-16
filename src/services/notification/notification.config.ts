import { Event, EventModel, Notification, NotificationModel } from '@app/models/notification';
import { DocumentType, types } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InvitationContact, InvitationGroup, InvitationProject, Resource, ProjectMember } from '@app/models';
import Container from 'typedi';
import { NotificationTopic, NotificationAction, ProjectRole } from '@app/defines';
import { NotificationSenderConfigInterface } from './sender';

interface EventHandler {
    (ev: DocumentType<Event>): Promise<Array<NotificationSenderConfigInterface>>;
}
interface EventHandlerConfig {
    topic: string,
    actions: Array<{
        expressions: Array<{ property: string, value: string }|string>,
        action: EventHandler,
    }>
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

//send notification to project_manager
const projectNotifyToProjectAdminAction =  async (ev: DocumentType<Event>) => {
    const doc = (ev.data as Resource);
    const ret: Array<NotificationSenderConfigInterface> = [];

    const members = doc.members as Array<ProjectMember> ;
    members.filter(x=>x.projectRole==ProjectRole.ProjectManager)
        .forEach(x=>{ ret.push({
            executor: 'db',
            receiver: x.userId as Types.ObjectId,
            data: {
                event:ev._id
            }
        }); }) ;
    

    return ret;
};


//send notification to project assignee
const projectNotifyToAssigneeAction =  async (ev: DocumentType<Event>) => {
    const doc = (ev.data as Resource);
    const ret: Array<NotificationSenderConfigInterface> = [];

    doc.assignees
        .forEach(x=>{ ret.push({
            executor: 'db',
            receiver: x as Types.ObjectId,
            data: {
                event:ev._id
            }
        }); }) ;
    

    return ret;
};


export const notificationConfig: Array<EventHandlerConfig> = [];
notificationConfig.push(
    {
        topic: NotificationTopic.InvitationContact,
        actions: [
            {
                expressions: [{ property: 'action', value: NotificationAction.Invite }],
                action: invitationContactNotifyForMailAction,

            },
            {
                expressions: [{ property: 'action', value: NotificationAction.Accept }],
                action: invitationResponseNotifyForApiAction,
            },

            {
                expressions: [{ property: 'action', value: NotificationAction.Reject }],
                action: invitationResponseNotifyForApiAction,
            },
        ]

    },

    {
        topic: NotificationTopic.InvitationGroup,
        actions: [
            {
                expressions: [{ property: 'action', value: NotificationAction.Invite }],
                action: invitationGroupNotifyForMailAction,
            },

            {
                expressions: [{ property: 'action', value: NotificationAction.Accept }],
                action: invitationResponseNotifyForApiAction,
            },

            {
                expressions: [{ property: 'action', value: NotificationAction.Reject }],
                action: invitationResponseNotifyForApiAction,
            },
        ]
    },
    //notification config define for Invitation Project
    {
        topic: NotificationTopic.InvitationProject,
        actions: [
            {
                expressions: [{ property: 'action', value: NotificationAction.Invite }],
                action: invitationProjectNotifyForMailAction,
            },

            {
                expressions: [{ property: 'action', value: NotificationAction.Accept }],
                action: invitationResponseNotifyForApiAction,
            },

            {

                expressions: [{ property: 'action', value: NotificationAction.Reject }],
                action: invitationResponseNotifyForApiAction,
            },
        ]
    },

    {
        topic: NotificationTopic.Project,
        actions: [
            {
                expressions:  [ NotificationAction.Created ],
                action: async (ev: DocumentType<Event>) => {
                    const doc = (ev.data as Resource);
                    const ret: Array<NotificationSenderConfigInterface> = [];

                    ret.push(... await projectNotifyToProjectAdminAction(ev));
                            
                    return ret;
                },
             
            },

            {
                expressions: [ NotificationAction.Updated ],
                action:  async (ev: DocumentType<Event>) => {
                    const doc = (ev.data as Resource);
                    const ret: Array<NotificationSenderConfigInterface> = [];
                    
                    ret.push(... await projectNotifyToProjectAdminAction(ev));
                    ret.push(... await projectNotifyToAssigneeAction(ev));
                            
                    return ret;
                },
            },

            {
                expressions: [NotificationAction.Status ],
                action:  async (ev: DocumentType<Event>) => {
                    const doc = (ev.data as Resource);
                    const ret: Array<NotificationSenderConfigInterface> = [];
                    
                    ret.push(... await projectNotifyToProjectAdminAction(ev));
                    ret.push(... await projectNotifyToAssigneeAction(ev));
                            
                    return ret;
                },
            },

            {
                expressions: [NotificationAction.Deleted ],
                action:  async (ev: DocumentType<Event>) => {
                    const doc = (ev.data as Resource);
                    const ret: Array<NotificationSenderConfigInterface> = [];
                    
                    ret.push(... await projectNotifyToProjectAdminAction(ev));
                    ret.push(... await projectNotifyToAssigneeAction(ev));
                            
                    return ret;
                },
            },
        ]
    }
);

