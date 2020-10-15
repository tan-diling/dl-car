import { NotificationSenderConfigInterface } from './types';
import { dbNotificationSender } from './dbNotificationSender';
import { mailNotificationSender } from './mailNotificationSender';

export * from './types';

export * from './dbNotificationSender';
export * from './mailNotificationSender';


export async function executeNotificationSend(cfg:NotificationSenderConfigInterface){
    const {executor,receiver,data} =cfg ;
    
    switch(executor){
        case "db":
            await dbNotificationSender.execute({receiver,event:data.event});
            break;
        case "mail":
            await mailNotificationSender.execute({receiver,template:data.template,data:data.data});
            break;
        default:
            throw new Error('send not impl');
    }
    
}