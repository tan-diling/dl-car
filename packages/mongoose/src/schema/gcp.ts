import { prop, Typegoose, ModelType, InstanceType, Ref } from 'typegoose';

class User extends Typegoose {
  @prop()
  name: string;

  @prop()
  email: string;    

  @prop()
  role: string;

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
  refreshToken: String;

  @prop()
  ip?: string;
  
};
 
const UserModel = new User().getModelForClass(User);
  
const LoginSessionModel = new LoginSession().getModelForClass(LoginSession);