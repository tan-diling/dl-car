import { prop, Ref, plugin, getModelForClass, DocumentType, getDiscriminatorModelForClass, index, mongoose, ReturnModelType } from '@typegoose/typegoose';
import { Strategy } from "passport-local";
import { Document, Query, UpdateQuery } from "mongoose";
import * as mongooseHidden from 'mongoose-hidden';
import * as passportLocalMongoose  from 'passport-local-mongoose';

import * as moment from 'moment';
import * as randToken from 'rand-token';

import { SiteRole } from '@app/defines';


export class Profile {
    @prop()
    name?: string;
  
    @prop({  })
    sex?: string;
 
    @prop({ default: "" })
    image?: string;
  
    @prop()
    ageGroup?: string;
  
    @prop({ default: "" })
    region?: string;            
}

@plugin(passportLocalMongoose, {
  usernameField: "phone",
  session: false,
})
export class User {
  
  @prop()
  phone: string;
  
  @prop()
  password: string;

  @prop()
  profile: Profile ;

  @prop({ default: SiteRole.Client })
  role?: string;

  @prop({ required: false, default: false })
  deleted?: boolean;

  static createStrategy: () => Strategy;
  static register: (user: UpdateQuery<DocumentType<User>>, password: string) => Promise<DocumentType<User>>;
  // static serializeUser: ()=>(user, cb: (err: any, id?: any) => void) => void;
  // static deserializeUser: ()=> (username: string, cb: (err: any, user?: any) => void) => void;

  static async findByKey(
    this:ReturnModelType<typeof User>,
    phone: string
  ){
    return await this.findOne({phone}).exec()
  };

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

  
  static async buildSession(
    this: ReturnModelType<typeof Session>,
    sess: UpdateQuery<DocumentType<Session>>, 
    forceNew: boolean = false
  ) {
    const { user, ...data } = sess;

    let session: DocumentType<Session>;
    if (forceNew) {
      session = new this(sess);
      // await session.save();
    } else {
      session = await this.findOne({ user: sess.user }).exec();
      if (session == null) {
        session = new this(sess);
        // await session.save();
      }
    }

    session.expiredAt = moment().add(1, 'day').toDate();
    session.refreshToken = randToken.uid(64);

    session.save();

    await session.populate('user').execPopulate();

    return session;

  }
};

// export const UserModel = mongoose.model('User', User);

export const UserModel = getModelForClass(User, { schemaOptions: { timestamps: true } });


export const SessionModel = getModelForClass(Session);