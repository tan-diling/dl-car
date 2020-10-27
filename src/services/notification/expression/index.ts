
import { entityConfig } from './entityConfig';

import { EntityNotifyExecutor, getEntityContext } from './expression';
import { NotificationService } from '../notification.service';
import { Container } from 'typedi';
import { NotificationTopic } from '@app/defines';

const executor = new EntityNotifyExecutor();
const notificationService = Container.get(NotificationService);
export const processEntityNotification = async (request, type, id, method) => {
    const ctx = await getEntityContext(request, type, id, method);

    {
        const { req, ...data } = ctx;
        const requestInfo = { method: request.method, body: request.body, url: request.url };

        await notificationService.publish(NotificationTopic.Entity, ctx.method, { ...data, req: requestInfo }, ctx.user.id);
    }
    // await executor.executeEval(ctx, entityConfig);

}