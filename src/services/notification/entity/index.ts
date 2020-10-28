
import { entityConfig } from './entityConfig';

import { EntityNotifyExecutor, getEntityContext } from './expression';
import { NotificationService } from '../notification.service';
import { Container } from 'typedi';
import { NotificationTopic } from '@app/defines';


const executor = new EntityNotifyExecutor();

export const processEntityNotification = async (request, type, id, method) => {
    const ctx = await getEntityContext(request, type, id, method);


    {
        const { req, ...data } = ctx;
        const requestInfo = { method: request.method, body: request.body, url: request.url };

        if (ctx.method == "updated") {
            const { assignees, _assignees } = requestInfo.body;
            if (Array.isArray(assignees) && Array.isArray(_assignees)) {
                ctx.method = "assignee.append";
                if (assignees.length < _assignees.length) {
                    ctx.method = "assignee.remove";
                }
            }
        }


        const notificationService = Container.get(NotificationService);
        await notificationService.publish(NotificationTopic.Entity, ctx.method, { ...data, req: requestInfo }, ctx.user.id);
    }
    // await executor.executeEval(ctx, entityConfig);

}


export const entityEntityExecuteEval = async ctx => {
    return await executor.executeEval(ctx, entityConfig);
}
