
import { Action } from 'routing-controllers';
import { DocumentType, isDocument } from '@typegoose/typegoose';
import { projectMemberNotification } from './entity.interceptor';
import { InvitationProject } from '@app/models';
import { ActionStatus } from '@app/defines';

type ActionMethodType = 'created' | 'updated' | 'deleted' | 'status';

export function actionNotificationInterceptor(method: ActionMethodType = 'status') {
    const it = async (action: Action, content: any) => {
        const doc = content as DocumentType<InvitationProject>;
        if (doc.status == ActionStatus.Accepted) {
            if (doc.data.projectId && doc.data.userId) {
                await projectMemberNotification('member.append', action.request, doc.data.projectId, doc.data.userId);
            }
        }

        return content;
    }

    return it;
}
