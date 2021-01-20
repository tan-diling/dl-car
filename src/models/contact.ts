import { prop, Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index } from '@typegoose/typegoose';
import { User } from './user';
import { Types } from 'mongoose';
import { stringify } from 'querystring';



@index({ userId: 1, contact: 1, }, { unique: true })
export class Contact {
  @prop({ ref: () => User })
  userId: Ref<User>;

  @prop({ ref: () => User })
  contact: Ref<User>;

  @prop()
  meta?: any;

  static async appendContact(user: string | Types.ObjectId, contact: string | Types.ObjectId) {
    const ret = [];

    if (String(user) != String(contact)) {
      {
        const filter = { userId: user, contact };
        const c = await ContactModel.findOne(filter).exec();

        if (c == null) {
          ret.push(await ContactModel.create(filter));
        }
      }

      {
        const filter = { userId: contact, contact: user };
        const c = await ContactModel.findOne(filter).exec();
        if (c == null) {
          ret.push(await ContactModel.create(filter));
        }
      }
    }
    return ret;
  }

  static async removeContact(user: string | any, contact: string | any) {
    const ret = []

    {
      const filter = { userId: user, contact };
      ret.push(await ContactModel.findOneAndRemove(filter).exec());

    }

    {
      const filter = { userId: contact, contact: user };
      ret.push(await ContactModel.findOneAndRemove(filter).exec());
    }
    return ret;
  }

};


export const ContactModel = getModelForClass(Contact, { schemaOptions: { timestamps: true } });
