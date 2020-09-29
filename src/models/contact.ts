import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index } from '@typegoose/typegoose';
import { User } from './user';
import { Types } from 'mongoose';



@index({ userId: 1, contact: 1,}, { unique: true })
export class Contact {
  @prop({ref:()=>User})
  userId:  Ref<User> ;

  @prop({ref:()=>User})
  contact: Ref<User> ;
  
  @prop()
  meta?: any ;

  static async appendContact(user:string,contact:string) {
      {
      const filter = {userId:user,contact};
      const c = await ContactModel.findOne(filter).exec() ;
      if(c == null){
          await ContactModel.create(filter);
        }
      }

      {
          const filter = {userId:contact,contact:user};
          const c = await ContactModel.findOne(filter).exec() ;
          if(c == null){
              await ContactModel.create(filter);
          }
      }
      return ;  
  }

  static async removeContact(user:string|any,contact:string|any) {
    {
        const filter = {userId:user,contact};
        await ContactModel.findOneAndRemove(filter).exec() ;
    
    }

    {
        const filter = {userId:contact,contact:user};
        await ContactModel.findOneAndRemove(filter).exec() ;            
    }
    return ;
  }
  
};


export const ContactModel = getModelForClass(Contact);
