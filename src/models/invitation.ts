import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass } from '@typegoose/typegoose';

import { User } from './user';

export enum InvitationType{
  Contact = "Contact",
  Group = "Group",
  Project = "Project",
}

export enum InvitationUserType{
  Internal ,
  External ,
}

export enum InvitationStatus{
  Pending,
  Accepted ,
  Rejected ,
}

export class Invitation {
  @prop()
  email?: string;

  @prop()
  invitee?: Ref<User>;

  @prop({ref: User})
  inviter: Ref<User>;

  @prop({enum:InvitationUserType})
  userType:InvitationUserType;  //enum:external, internal ,

  @prop({enum:InvitationType})
  inviteType: InvitationType; //enum:group，contact, project ,

  @prop()
  data: any;
  
  @prop({enum:InvitationStatus})
  responseStatus?:InvitationStatus; //enum(pending,accept,reject)
}


export const InvitationModel = getModelForClass(Invitation,{schemaOptions:{timestamps:true}});
