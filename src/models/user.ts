import { prop, Ref, plugin, getModelForClass, DocumentType, getDiscriminatorModelForClass, index } from '@typegoose/typegoose';

import * as mongooseHidden from 'mongoose-hidden';
import { SiteRole } from '@app/defines';
import { Contact } from './contact';

// enum UserRole {
//   admin ='admin',
//   staff = 'staff',
//   client='client',
//   visitor='visitor',

// }

@index({ name: "text", email: "text", })
@plugin(mongooseHidden({ defaultHidden: { password: true } }))
export class User {
  @prop()
  name: string;

  @prop({ index: true })
  email: string;

  // @prop({default:UserRole.client, enum: UserRole })
  @prop({ default: SiteRole.Client })
  role?: string;

  @prop()
  password: string;

  @prop({ default: "" })
  image?: string;

  @prop()
  company?: string;

  @prop({ default: "" })
  job?: string;

  @prop({ default: "" })
  phone?: string;

  @prop({ default: "" })
  department?: string;

  @prop()
  emailValidated: boolean;

  @prop({ required: false, default: false })
  deleted?: boolean;

  @prop({ required: false, default: false })
  defaultContact?: boolean;

  @prop({ required: false, default: true })
  defaultContactAccept?: boolean;

  @prop({ required: false, default: false })
  forbiddenMailNotification?: boolean;

  @prop({
    ref: "Contact",
    localField: "_id",
    foreignField: "user",
    // match:{ 
    //   deleted:false,    
    // },
    options: {
      populate: "contact",
    },

  })
  contacts: Ref<Contact>[];

  isNormal() {
    return this.emailValidated &&
      (!this.deleted) &&
      this.role != '';
  }

  getBaseInfo(this: DocumentType<User>) {
    return {
      _id: this._id,
      name: this.name,
      email: this.email,
      image: this.image,
    }
  }


  static
    async findByMail(email: string) {
    return await UserModel.findOne({
      email: { $regex: new RegExp('^' + email + '$', 'i') },
      deleted: false,
    }).exec();
  }

}

export class LoginSession {

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

export const UserModel = getModelForClass(User, { schemaOptions: { timestamps: true } });

export const LoginSessionModel = getModelForClass(LoginSession);