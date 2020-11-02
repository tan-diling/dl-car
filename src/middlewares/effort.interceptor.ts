
import { Action } from 'routing-controllers';
import { DocumentType, isDocument } from '@typegoose/typegoose';
import { Effort, EffortModel } from '@app/models';
import { Types } from 'mongoose';
import { logger } from '@app/config';
import * as util from 'util';


export function effortInterceptor() {
    const it = async (action: Action, content: any) => {
        if (content) {
            const effort = content as DocumentType<Effort>;
            if (effort.schema === EffortModel.schema) {

                await Effort.setTotalEffortInvalid(effort.parent as Types.ObjectId);
                // .catch(err => {
                //     logger.error(err);
                // });

            }
        }

        return content;
    };

    // util.callbackify(it);

    return it;
}
