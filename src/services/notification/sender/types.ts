import { Types } from 'mongoose';

export interface  NotificationSenderConfigInterface {
    executor:'db'|'mail'|'socket',
    receiver:Types.ObjectId,
    data?:{        
        event?:Types.ObjectId,
        template?:string,      
        topic?:string,
        data?:any,
    }
}

export interface NotificationSenderInterface {
    execute(data:{receiver,[key:string]:any}): void | Promise<void>;
}
