
import { Action } from 'routing-controllers';
import { Container } from 'typedi';
import { NotificationService } from '@app/services';

import { DocumentType, isDocument } from '@typegoose/typegoose';
import { projectMemberNotification } from './entity.interceptor';
import { InvitationProject, UserModel } from '@app/models';
import { ActionStatus, NotificationTopic, NotificationAction } from '@app/defines';

async function processActionNotification(type: string, method: string, data: { entity, req, method, user }, user: string) {
    if (type == NotificationTopic.Invitation && method == NotificationAction.Status) {
        const doc = data.entity as DocumentType<InvitationProject>;
        if (doc.status == ActionStatus.Accepted) {
            if (doc.data.projectId && doc.data.userId) {
                const user = await UserModel.findById(doc.sender).exec();
                await projectMemberNotification(NotificationAction.MemberAppend, { ...data.req, body: {}, user: { id: String(doc.sender), name: user?.name } }, doc.data.projectId, doc.data.userId);
            }
        }

        return true;
    }
}


export function notificationInterceptor(type: NotificationTopic, method: NotificationAction, ) {
    const it = async (action: Action, content: any) => {
        if (content) {
            const user = action.request?.user;
            const req = {

                url: action.request?.url,
                method: action.request?.method,
                body: action.request?.body,

            };

            const data = {
                user,
                // type,
                method,
                entity: content,
                req,
            };

            const handled = await processActionNotification(type, method, data, user.id);
            if (!handled) {

                const notificationService = Container.get(NotificationService);
                await notificationService.publish(type, method, data, user.id);
            }
        }

        return content;
    }

    return it;
}
