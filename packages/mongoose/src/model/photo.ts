import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass } from '@typegoose/typegoose';

class Photo {
  @prop()
  name: string;

  @prop()
  album: string;    

  @prop()
  title?: string;

  @prop()
  description? : string ;

  @prop()
  type?: string ;

  path() {
    return `/${this.album}/${this.name}`;
  }
  
}


export const PhotoModel = getModelForClass(Photo);