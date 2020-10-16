import { NotificationSenderConfigInterface } from './types';
import { dbNotificationSender } from './dbNotificationSender';
import { mailNotificationSender } from './mailNotificationSender';

export * from './types';

export * from './dbNotificationSender';
export * from './mailNotificationSender';


export async function executeNotificationSend(cfg:NotificationSenderConfigInterface){
    const {executor,...options} = cfg ;
    switch(executor){
        case "db":
            await dbNotificationSender.execute(options);
            break;
        case "mail":
            await mailNotificationSender.execute(options);
            break;
        default:
            throw new Error('send not impl');
    }
    
}