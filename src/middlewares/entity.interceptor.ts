import { processEntityNotification } from '@app/services/notification/expression';
import { Action } from 'routing-controllers';

export function entityNotificationInterceptor(method: 'created' | 'updated' | 'deleted' | 'status' | 'member' = 'updated') {
    const it = async (action: Action, content: any) => {
        if (content) {
            const id = content._id;
            const type = content.type;
            console.log(`entityInterceptor ${type}: ${id}, ${method}`);

            await processEntityNotification(action.request, type, id, method);
        }

        return content;
    }

    return it;
}