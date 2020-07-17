import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass } from '@typegoose/typegoose';
import { User } from './user';

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

  path() {
    return `/${this.folder}/${this.id}${this.type}`;
  }
  
  
}


export const PhotoModel = getModelForClass(Photo,{schemaOptions:{timestamps:true}});