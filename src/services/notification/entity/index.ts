
import { entityConfig } from './entityConfig';

import { EntityNotifyExecutor, getEntityContext } from './expression';
import { NotificationService } from '../notification.service';
import { Container } from 'typedi';
import { NotificationTopic } from '@app/defines';
import { UserService } from '@app/services/user.service';


const executor = new EntityNotifyExecutor();
const userService = Container.get(UserService);

export const processEntityNotification = async (request, type, id, method) => {
    const ctx = await getEntityContext(request, type, id, method);

    if (ctx != null) {
        const { req, ...data } = ctx;
        const requestInfo = { method: request.method, body: request.body, url: request.url };

        if (ctx.method == "updated") {
            const { assignees, _assignees } = requestInfo.body;
            if (Array.isArray(assignees) && Array.isArray(_assignees)) {

                ctx.method = "assignee.append";

                if (assignees.length < _assignees.length) {
                    ctx.method = "assignee.remove";
                    requestInfo.body._user = _assignees.find(x => !assignees.includes(x));
                } else {
                    requestInfo.body._user = assignees.find(x => !_assignees.includes(x));
                }
            }
        }

        if (requestInfo.body?._user) {
            const user = await userService.getById(requestInfo.body?._user);
            if (user) {
                requestInfo.body._user = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                };
            } else {
                requestInfo.body._user = null;
            }
        }

        const notificationService = Container.get(NotificationService);
        await notificationService.publish(NotificationTopic.Entity, ctx.method, { ...ctx, req: requestInfo }, ctx.user.id);
    }
    // await executor.executeEval(ctx, entityConfig);

}


export const entityEntityExecuteEval = async ctx => {
    return await executor.executeEval(ctx, entityConfig);
}
