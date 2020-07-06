import { prop, Typegoose, ModelType, InstanceType, Ref, plugin } from 'typegoose';

import * as mongooseHidden from 'mongoose-hidden';

enum UserRole {
  admin ='admin',
  staff = 'staff',
  client='client',

}

@plugin(mongooseHidden({ defaultHidden: {  password: true } }))
class User extends Typegoose {
  @prop()
  name: string;

  @prop()
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
}

class LoginSession extends Typegoose {

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
 
export const UserModel = new User().getModelForClass(User);
  
export const LoginSessionModel = new LoginSession().getModelForClass(LoginSession);