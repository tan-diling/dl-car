import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass } from '@typegoose/typegoose';

import { User } from './user';
import { Types } from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';
import { ActionStatus } from '@app/defines';
import { stringify } from 'querystring';


export class PendingAction {

  @prop({alias:'type'})
  __t?:string;
  
  @prop()
  receiver: Ref<User>;
   
  @prop()
  data: any;
  
  @prop({default:false})
  isReplied?:boolean;

    
  @prop({enum:ActionStatus,default:ActionStatus.Pending})
  status?:ActionStatus; //enum(pending,accept,reject)

  @prop({default:false})
  deleted?: boolean;

  @prop()
  createdAt?: Date;

  @prop()
  updatedAt?: Date;

  async changeStatus( status:ActionStatus){
    if(this.status!=ActionStatus.Pending){
      throw new Error("status error") ;
    }

    this.status = status ;
    // await this.save() ;

    // this.emit(`${this.__t}_status`,this) ;
  }
}



export enum InvitationType{
  Contact = "Contact",
  Group = "Group",
  Project = "Project",
}

export enum InvitationUserType{
  Internal ,
  External ,
}

interface ContactInvitationData {
  userId:Types.ObjectId;
  contact:Types.ObjectId;
}

interface GroupInvitationData {
  userId:Types.ObjectId;
  groupId:Types.ObjectId;
  groupRole:string;
}

interface ProjectInvitationData {
  userId:Types.ObjectId;
  groupId:Types.ObjectId;
  groupRole:string;
}

type InvitationData = ContactInvitationData | GroupInvitationData | ProjectInvitationData ;

export class Invitation extends PendingAction {
  @prop()
  email?: string;

  @prop({enum:InvitationType})
  inviteType: InvitationType; //enum:group，contact, project ,
  
  data:InvitationData;

  async changeStatus(this: DocumentType<Invitation>,status:ActionStatus){
    await super.changeStatus(status) ;
   
    if(status==ActionStatus.Accepted ){
      switch (this.inviteType) {
        case InvitationType.Contact:          
          const {userId,contact} = this.data as ContactInvitationData;          
  
          break ;

      }
    } 
  }
}


export const PendingActionModel = getModelForClass(PendingAction,{schemaOptions:{timestamps:true}});


export const InvitationModel = getDiscriminatorModelForClass(PendingActionModel,Invitation);
