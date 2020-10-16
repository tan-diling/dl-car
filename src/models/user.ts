import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index } from '@typegoose/typegoose';

import * as mongooseHidden from 'mongoose-hidden';
import { SiteRole } from '@app/defines';
import { Contact } from './contact';

// enum UserRole {
//   admin ='admin',
//   staff = 'staff',
//   client='client',
//   visitor='visitor',

// }

@index({ name: "text", email: "text",})
@plugin(mongooseHidden({ defaultHidden: {  password: true } }))
export class User {
  @prop()
  name: string;

  @prop({ unique: true })
  email: string;    

  // @prop({default:UserRole.client, enum: UserRole })
  @prop({default:SiteRole.Client})
  role?: string;

  @prop()
  password: string ;

  @prop({default:""})
  image?: string;  

  @prop()
  company?: string;
  
  @prop({default:""})
  job?: string;    

  @prop({default:""})
  phone?: string;  
  
  @prop({default:""})
  department?: string;
  
  @prop()
  emailValidated : boolean ;

  @prop({ required: false, default: false})
  deleted?: boolean ;

  @prop({ required: false, default: false})
  defaultContact?: boolean ;

  @prop({ required: false, default: true})
  defaultContactAccept?: boolean ;

  @prop({ 
    ref:"Contact",
    localField:"_id",
    foreignField:"user",
    // match:{ 
    //   deleted:false,    
    // },
    options:{
      populate:"contact",
    },

  })
  contacts: Ref<Contact>[];

  isNormal() {
    return (this.emailValidated && (!this.deleted));
  }


  static 
  async findByMail(email:string){
    return await UserModel.findOne({email:{$regex:new RegExp('^'+email+'$','i')}}).exec() ;
  }
  
}

export class LoginSession{

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