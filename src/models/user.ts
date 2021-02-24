import { prop, Ref, plugin, getModelForClass, DocumentType, getDiscriminatorModelForClass, index, mongoose } from '@typegoose/typegoose';
import { Strategy } from "passport-local";
import { Document, UpdateQuery } from "mongoose";
import * as mongooseHidden from 'mongoose-hidden';
import * as passportLocalMongoose  from 'passport-local-mongoose';

import * as moment from 'moment';
import * as randToken from 'rand-token';

import { SiteRole } from '@app/defines';


export class Profile {
    @prop()
    name: string;

    @prop({ default: "" })
    phone?: string;
  
    @prop({ index: true })
    email: string;
 
    @prop({ default: "" })
    image?: string;
  
    @prop()
    age?: string;
  
    @prop({ default: "" })
    region?: string;            
}

@plugin(passportLocalMongoose, {
  usernameField: "phone",
  session: false,
})
export class User {
  @prop()
  name: string;

  @prop()
  phone: string;
  
  @prop()
  password: string;

  @prop({ default: SiteRole.Client })
  role?: string;

  @prop({ required: false, default: false })
  deleted?: boolean;

  static createStrategy: () => Strategy;
  static register: (user: UpdateQuery<DocumentType<User>>, password: string) => Promise<DocumentType<User>>;
  static serializeUser: ()=>(user, cb: (err: any, id?: any) => void) => void;
  static deserializeUser: ()=> (username: string, cb: (err: any, user?: any) => void) => void;

  static async buildSession(sess: UpdateQuery<DocumentType<Session>>, forceNew: boolean = false) {
    const { user, ...data } = sess;

    let session: DocumentType<Session>;
    if (forceNew) {
      session = new SessionModel(sess);
      // await session.save();
    } else {
      session = await SessionModel.findOne({ user: sess.user }).exec();
      if (session == null) {
        session = new SessionModel(sess);
        // await session.save();
      }
    }

    session.expiredAt = moment().add(1, 'day').toDate();
    session.refreshToken = randToken.uid(64);

    session.save();

    await session.populate('user').execPopulate();

    return session;

  }

  // static async refresh(this: DocumentType<Session>, forceNew: boolean = false) {
  //   const session = this;

  //   session.expiredAt = moment().add(1, 'day').toDate();
  //   if (forceNew) {
  //     session.refreshToken = randToken.uid(64);
  //   }
  //   await session.save();

  // }

  // findByUsername(username: string, selectHashSaltFields: boolean): Query<T>;
  
}
// const User = new mongoose.Schema({});

// User.plugin(passportLocalMongoose);

// @index({ name: "text", email: "text", })
// @plugin(mongooseHidden({ defaultHidden: { password: true } }))
// export class UserProfile {
//   @prop()
//   name: string;

//   @prop({ index: true })
//   email: string;

//   // @prop({default:UserRole.client, enum: UserRole })
//   @prop({ default: SiteRole.Client })
//   role?: string;

//   @prop()
//   password: string;

//   @prop({ default: "" })
//   image?: string;

//   @prop()
//   company?: string;

//   @prop({ default: "" })
//   job?: string;

//   @prop({ default: "" })
//   phone?: string;

//   @prop({ default: "" })
//   department?: string;

//   @prop()
//   emailValidated: boolean;

//   @prop({ required: false, default: false })
//   deleted?: boolean;

//   @prop({ required: false, default: false })
//   defaultContact?: boolean;

//   @prop({ required: false, default: true })
//   defaultContactAccept?: boolean;

//   @prop({ required: false, default: false })
//   forbiddenMailNotification?: boolean;



//   isNormal() {
//     return this.emailValidated &&
//       (!this.deleted) &&
//       this.role != '';
//   }

//   getBaseInfo(this: DocumentType<User>) {
//     return {
//       _id: this._id,
//       name: this.name,
//       email: this.email,
//       image: this.image,
//     }
//   }


//   static
//     async findByMail(email: string) {
//     return await UserModel.findOne({
//       email: { $regex: new RegExp('^' + email + '$', 'i') },
//       deleted: false,
//     }).exec();
//   }

// }

export class Session {

  @prop({ ref: User })
  user: Ref<User>;

  @prop()
  device: string;

  @prop()
  ip?: string;

  @prop()
  refreshToken: string;

  @prop({ default: Date.now })
  expiredAt: Date;

  @prop()
  createdAt?: Date;

  @prop()
  updatedAt?: Date;

};

// export const UserModel = mongoose.model('User', User);

export const UserModel = getModelForClass(User, { schemaOptions: { timestamps: true } });


export const SessionModel = getModelForClass(Session);