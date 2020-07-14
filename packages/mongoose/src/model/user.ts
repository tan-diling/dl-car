import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass } from '@typegoose/typegoose';

import * as mongooseHidden from 'mongoose-hidden';

enum UserRole {
  admin ='admin',
  staff = 'staff',
  client='client',

}

@plugin(mongooseHidden({ defaultHidden: {  password: true } }))
class User {
  @prop()
  name: string;

  @prop({ unique: true })
  email: string;    

  @prop({default:'client',enum: UserRole })
  role?: string;

  @prop()
  password : string ;

  @prop()
  logo?: string;  

  @prop()
  company?: string;
  
  @prop()
  job?: string;    

  @prop()
  phone?: string;  
  
  @prop()
  department?: string;
  
  @prop()
  emailValidated : boolean ;

  @prop({ required: false, default: false})
  deleted?: boolean ;


  @prop({ required: false, default: false})
  defaultContact?: boolean ;

  isNormal() {
    return (this.emailValidated && (!this.deleted));
  }
}

class LoginSession{

  @prop({ ref: User })
  user: Ref<User>;
 
  @prop()
  device: string;
  
  @prop()
  refreshToken: string;

  @prop()
  ip?: string;

  @prop()
  accessTime?: Date;
  
  @prop()
  refreshTime?: Date;
  
};


export const UserModel = getModelForClass(User);

export const LoginSessionModel = getModelForClass(LoginSession);