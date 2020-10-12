import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass, modelOptions } from '@typegoose/typegoose';

import { User } from './user';

enum EventType {
  InvitationSending, //sb invite you to join his
  InvitationAccepted,
  InvitationRejected,

  GroupMemberAdded,
  GroupMemberRemoved,

  ProjectMemberAdded,
  ProjectMemberRemoved,

  ProjectStatus,

  GoalStatus,

  RequirementStatus,

  DeliverableStatus,

  TaskStatus,
}

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

export class InvitationEvent extends Event{  

}

enum NotificationStatus{
  Unread="unread",
  Read='read',
  Deleted='deleted'
}

export class Notification {  

  @prop()
  receiver: Ref<User>;

  @prop({ref: User})
  event: Ref<Event>;

  @prop({})
  message: string;

  @prop({enum:NotificationStatus})
  status:NotificationStatus;  //enum('unread', 'read','deleted'),

  @prop()
  createdAt?: Date;

  @prop()
  updatedAt?: Date;

}


export const EventModel = getModelForClass(Event,{schemaOptions:{timestamps:true}});


export const NotificationModel = getModelForClass(Notification,{schemaOptions:{timestamps:true}});
