import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index } from '@typegoose/typegoose';
import { User } from './user';
import { Types } from 'mongoose';



@index({ user: 1, contact: 1,}, { unique: true })
export class Contact {
  @prop({ref:()=>User})
  user:  Ref<User> ;

  @prop({ref:()=>User})
  contact: Ref<User> ;
  
  @prop()
  meta: any ;
  
};


export const ContactModel = getModelForClass(Contact);
