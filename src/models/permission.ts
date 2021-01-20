import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass } from '@typegoose/typegoose';


export class FieldPolicy{

    @prop({required:true})
    name :string;
  
    @prop()
    policy: number
}

export class PermissionPolicy {


    @prop({required:true})
    resource :string;
  
    @prop()
    role :string;
  
    @prop()
    scope  :number;
  
    @prop()
    logo? :string;
    
    @prop()
    fields :FieldPolicy[];
  
  }

export const PermissionPolicyModel = getModelForClass(PermissionPolicy);
