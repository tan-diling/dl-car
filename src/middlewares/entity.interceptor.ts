import { processEntityNotification } from '@app/services/notification/entity';
import { Action } from 'routing-controllers';

type EntityMethodType = 'created' | 'updated' | 'deleted' | 'status' | 'assignee.append' | 'assignee.remove' | 'member.append' | 'member.remove';

export function entityNotificationInterceptor(method: EntityMethodType = 'updated', options: { id?, type?} = {}) {
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