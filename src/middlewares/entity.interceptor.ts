import { processEntityNotification } from '@app/services/notification/expression';
import { Action } from 'routing-controllers';

export function entityNotificationInterceptor(method: 'created' | 'updated' | 'deleted' = 'updated') {
    const it = async (action: Action, content: any) => {
        if (content) {
            const id = content._id;
            console.log(`entityInterceptor ${content.type}: ${id}, ${method}`);

            await processEntityNotification(action.request, id, method);
        }

        return content;
    }

    return it;
}