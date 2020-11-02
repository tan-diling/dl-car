import { processEntityNotification } from '@app/services/notification/entity';
import { Action } from 'routing-controllers';
import { ResourceType } from '@app/defines';

type EntityMethodType = 'created' | 'updated' | 'deleted' | 'status' | 'assignee.append' | 'assignee.remove';

export function entityNotificationInterceptor(method: EntityMethodType = 'updated', options: { id?, type?: string, desc?: string } = {}) {
    const it = async (action: Action, content: any) => {
        if (content) {
            const id = content[options.id || "_id"];
            const type = options.type || content.type;
            console.log(`entityInterceptor ${type}: ${id}, ${method}`);

            await processEntityNotification(action.request, type, id, method);

        }

        return content;
    }

    return it;
}

export const projectMemberNotification = async (method: "member.append" | "member.remove", req, project, user) => {

    const id = project;
    const type = ResourceType.Project;
    console.log(`projectMemberNotification  ${id}, ${method} ${user}`);

    await processEntityNotification({ ...req, body: { ...req.body, _user: user } }, type, id, method);

}