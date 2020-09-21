import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass } from '@typegoose/typegoose';

import { User } from './user';

enum EventType {
  Invitation, 
  InvitationResponse,
  ContactAdded,
  ContactRemoved,

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

export class Event {  

  @prop({ref: User})
  sender: Ref<User>;

  @prop()
  type: EventType; //enum ('Invitation',

  @prop()
  data:any;

  @prop()
  createdAt?: Date;

  @prop()
  updatedAt?: Date;

}

enum NotificationStatus{
  init="",
  read='read',
  deleted='deleted'
}

export class Notification {  

  @prop()
  receiver: Ref<User>;

  @prop({ref: User})
  event: Ref<Event>;

  @prop({})
  message: string;
  
  @prop({})
  status:NotificationStatus;  //enum('', 'read','deleted'),

  @prop()
  createdAt?: Date;

  @prop()
  updatedAt?: Date;

}


export const EventModel = getModelForClass(Event,{schemaOptions:{timestamps:true}});
export const NotificationModel = getModelForClass(Notification,{schemaOptions:{timestamps:true}});
