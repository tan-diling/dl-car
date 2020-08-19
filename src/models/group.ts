import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { User } from './user';
import { GroupMemberStatus } from '@app/defines';

export class Group  {

  @prop({required:true})
  name :string;
  
  @prop()
  description  :string;

  @prop({ required: true } )
  owner: Types.ObjectId ;

  @prop({ default: false})
  deleted?: boolean ;
}

@index({  groupId: 1, userId: 1 }, { unique: true })
export class GroupMember {
  @prop({ ref: Group, required: true })
  groupId: Ref<Group>;;
  
  @prop({  required: true })
  email: string;

  @prop({ ref: User })
  userId: Ref<User>;

  
  @prop({ required: true })
  groupRole :string;
  
  @prop( { default: GroupMemberStatus.Invited } )
  status: string ;
}


export const GroupModel = getModelForClass(Group,{schemaOptions:{timestamps:true}});

export const GroupMemberModel = getModelForClass(GroupMember,{schemaOptions:{timestamps:true}});
