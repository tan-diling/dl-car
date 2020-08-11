import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass } from '@typegoose/typegoose';

import { User } from './user';

export class Invitation {
  @prop()
  invitee: string;

  @prop({ref: User})
  inviter: Ref<User>;
      
  @prop()
  type: string; //enum:group user project

  @prop()
  message: any;
  
}


export const InvitationModel = getModelForClass(Invitation,{schemaOptions:{timestamps:true}});
