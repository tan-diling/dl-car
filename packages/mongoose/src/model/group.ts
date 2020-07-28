import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { User } from './user';

export class Group  {

  @prop({required:true})
  name :string;
  
  @prop()
  description  :string;

  @prop({ required: true } )
  creator: Types.ObjectId ;
}

export class GroupMember {

  @prop({ ref: User, required: true })
  userId: Ref<User>;;

  @prop({ ref: Group, required: true })
  groupId: Ref<Group>;;
  
  @prop({ required: true })
  groupRole :string;
  
  @prop()
  status: string ;
}



export const GroupModel = getModelForClass(Group,{schemaOptions:{timestamps:true}});

export const GroupMemberModel = getModelForClass(GroupMember,{schemaOptions:{timestamps:true}});
