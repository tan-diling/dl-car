import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass, types, mapProp } from '@typegoose/typegoose';
import { User } from './user';
import { Types } from 'mongoose';

class Photo {
  // @prop()
  // name: string;
  id:string ;
  
  @prop()
  folder?: string;    

  @prop()
  title?: string;

  @prop()
  description? : string ;

  @prop()
  type?: string ;

  @prop({ ref: User })
  owner?: Ref<User>;

  @prop({ type: Types.ObjectId })
  maps?: Map<string, Types.ObjectId>;
  

  path() {
    return `/${this.folder}/${this.id}${this.type}`;
  }
  
  
}


export const PhotoModel = getModelForClass(Photo,{schemaOptions:{timestamps:true}});