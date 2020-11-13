import { Types } from 'mongoose';
import { Event } from '@app/models/notification'

export interface NotificationSenderOptions {
    receiver: Types.ObjectId,
    event: Event,
    mailTemplate?: string,
    skipMailCheck?: boolean,

    // [key:string]:any,
}

export interface NotificationSenderConfigInterface extends NotificationSenderOptions {
    executor: 'db' | 'mail' | 'socket',

    // [key:string]:any,
}

export interface NotificationSenderInterface {
    execute(data: NotificationSenderOptions): void | Promise<void>;
}
