import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass, modelOptions } from '@typegoose/typegoose';

import { User } from './user';
import { NotificationStatus } from '@app/defines';

// enum EventType {
//   InvitationSending, //sb invite you to join his
//   InvitationAccepted,
//   InvitationRejected,

//   GroupMemberAdded,
//   GroupMemberRemoved,

//   ProjectMemberAdded,
//   ProjectMemberRemoved,

//   ProjectStatus,

//   GoalStatus,

//   RequirementStatus,

//   DeliverableStatus,

//   TaskStatus,
// }

// type InvitationData = 
@modelOptions({ options: { allowMixed:0}})
export class Event {  

  // @prop({ alias: 'type' })
  // __t?: string;

  

  @prop({ref: User})
  sender: Ref<User>;

  @prop()
  type: string;

  @prop()
  action: string;

  @prop()
  data?:any;

  @prop()
  createdAt?: Date;

  @prop()
  updatedAt?: Date;

}

export class Notification {  

  @prop({ref: User})
  receiver: Ref<User>;

  @prop({ref: Event})
  event: Ref<Event>;

  @prop({})
  message: string;

  @prop({enum:NotificationStatus,default:NotificationStatus.Unread})
  status?:string;  //enum('unread', 'read','deleted'),

  @prop()
  createdAt?: Date;

  @prop()
  updatedAt?: Date;

}


export const EventModel = getModelForClass(Event,{schemaOptions:{timestamps:true}});


export const NotificationModel = getModelForClass(Notification,{schemaOptions:{timestamps:true}});
