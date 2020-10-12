import { prop, Ref, plugin, getModelForClass, getDiscriminatorModelForClass } from '@typegoose/typegoose';

import { User } from './user';
import { Types } from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';
import { ActionStatus } from '@app/defines';
import { Contact } from './contact';
import { GroupMember } from './group';
import { ProjectMember } from './resource';


export class PendingAction {

  @prop({ alias: 'type' })
  __t?: string;

  @prop({ ref: () => User })
  receiver: Ref<User>;

  @prop({ 
    ref: () => User,
    options: { projection:{ name:1, email:1}}
  })
  sender?: Ref<User>;

  @prop()
  data: any;

  @prop({ default: false })
  isResponded?: boolean;

  @prop({ enum: ActionStatus, default: ActionStatus.Pending })
  status?: ActionStatus; //enum(pending,accept,reject)

  @prop({ default: false })
  deleted?: boolean;

  @prop()
  createdAt?: Date;

  @prop()
  updatedAt?: Date;

  async changeStatus(status: ActionStatus) {
    if (this.status != ActionStatus.Pending) {
      throw new Error("status error");
    }

    this.status = status;
    // await this.save() ;

    // this.emit(`${this.__t}_status`,this) ;
  }
}



// export enum InvitationType {
//   Contact = "Contact",
//   Group = "Group",
//   Project = "Project",
// }

export enum InvitationUserType {
  Internal,
  External,
}

interface ContactInvitationData {
  // @prop({ ref: () => User })
  userId: Types.ObjectId;
  contact: Types.ObjectId;
  name?: string;
}

interface GroupInvitationData {
  userId: Types.ObjectId;
  groupId: Types.ObjectId;
  groupRole?: string;
  name?: string;
}

interface ProjectInvitationData {
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  projectRole?: string;
  name?: string;
}

type InvitationData = ContactInvitationData | GroupInvitationData | ProjectInvitationData;

export class InvitationContact extends PendingAction {
  // @prop()
  // email?: string;

  // @prop({ enum: InvitationType })
  // inviteType: InvitationType; //enum:group，contact, project ,

  data: ContactInvitationData;

  async changeStatus(this: DocumentType<InvitationContact>, status: ActionStatus) {
    await super.changeStatus(status);

    if (status == ActionStatus.Accepted) {
      
            const { userId, contact } = this.data;
            await Contact.appendContact(userId, contact);            
    }

    await this.save();
  }

 
}

export class InvitationGroup extends PendingAction {
  // @prop()
  // email?: string;

  // @prop({ enum: InvitationType })
  // inviteType: InvitationType; //enum:group，contact, project ,

  data: GroupInvitationData;

  async changeStatus(this: DocumentType<InvitationGroup>, status: ActionStatus) {
    await super.changeStatus(status);

    if (status == ActionStatus.Accepted) {                
      const { userId, groupId, groupRole } = this.data;
      await GroupMember.appendMember(groupId, userId, groupRole);          
        
    }

    await this.save();
  }

 
}

export class InvitationProject extends PendingAction {
  // @prop()
  // email?: string;

  // @prop({ enum: InvitationType })
  // inviteType: InvitationType; //enum:group，contact, project ,

  data: ProjectInvitationData;

  async changeStatus(this: DocumentType<InvitationProject>, status: ActionStatus) {
    await super.changeStatus(status);

    if (status == ActionStatus.Accepted) {
      
          
            const { userId, projectId, projectRole } = this.data ;
            await ProjectMember.appendMember(projectId, userId, projectRole);
          
      
    }

    await this.save();
  }

 
}


export const PendingActionModel = getModelForClass(PendingAction, { schemaOptions: { timestamps: true } });


export const InvitationContactModel = getDiscriminatorModelForClass(PendingActionModel, InvitationContact);


export const InvitationGroupModel = getDiscriminatorModelForClass(PendingActionModel, InvitationGroup);


export const InvitationProjectModel = getDiscriminatorModelForClass(PendingActionModel, InvitationProject);