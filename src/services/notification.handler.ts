
import { Event,EventModel,Notification,NotificationModel } from '@app/models/notification';

interface EventHandler {
    (ev:Event):void | Promise<void>;
}
interface EventHandlerConfig {
    topic:string,
    expressions:Array<{property:string,value:string}>
    action: EventHandler
}

const notificationConfig:Array<EventHandlerConfig> =[];
notificationConfig.push({
    topic: 'Invitation',
    expressions:[ { property:'action', value:'created' } ],    
    action: async (ev:Event)=>{
    
    //    const invitation = event.data as Invitation ;
    
    // 　 DbNotificationSender.send({recevicer:event.data.invitee ,eventId:event._id}) ;
          
    //      SocketNotificationSender.send({userId:
    // invitation.invitee,  topic: 'notification.invation',message:`${invitee.name} invited  ${inviter.name} `}) ;
             
      
     },
    });

    