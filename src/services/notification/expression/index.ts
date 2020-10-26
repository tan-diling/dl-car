
import { entityConfig } from './entityConfig';

import { EntityNotifyExecutor, getEntityContext } from './expression';

const executor = new EntityNotifyExecutor();
export const processEntityNotification = async (req, id, method) => {
    const ctx = await getEntityContext(req, id, method);


    await executor.executeEval(ctx, entityConfig);

}