import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass, modelOptions, getName ,mongoose} from '@typegoose/typegoose';

export const  virtualToJSON= {
      virtuals: true,
      transform:(doc,ret,options)=>{ 
        delete ret.id;
        delete ret.__v;
        for(const key of Object.keys(ret)) {
          const obj = ret[key] ;
          if (doc.populated(key) && key.endsWith("Id") && obj?._id){
            ret[key] = obj._id;
            ret[key.substr(0,key.length-2)] = obj ;
          }
        }        
      }
    };

