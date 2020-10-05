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



export enum InvitationType {
  Contact = "Contact",
  Group = "Group",
  Project = "Project",
}

export enum InvitationUserType {
  Internal,
  External,
}

interface ContactInvitationData {
  userId: Types.ObjectId;
  contact: Types.ObjectId;
}

interface GroupInvitationData {
  userId: Types.ObjectId;
  groupId: Types.ObjectId;
  groupRole?: string;
}

interface ProjectInvitationData {
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  projectRole?: string;
}

type InvitationData = ContactInvitationData | GroupInvitationData | ProjectInvitationData;

export class Invitation extends PendingAction {
  @prop()
  email?: string;

  @prop({ enum: InvitationType })
  inviteType: InvitationType; //enum:group，contact, project ,

  data: InvitationData;

  async changeStatus(this: DocumentType<Invitation>, status: ActionStatus) {
    await super.changeStatus(status);

    if (status == ActionStatus.Accepted) {
      switch (this.inviteType) {
        case InvitationType.Contact:
          {
            const { userId, contact } = this.data as ContactInvitationData;
            await Contact.appendContact(userId, contact);
          }
          break;

        case InvitationType.Group:
          {
            const { userId, groupId, groupRole } = this.data as GroupInvitationData;
            await GroupMember.appendMember(groupId, userId, groupRole);
          }
          break;

        case InvitationType.Project:
          {
            const { userId, projectId, projectRole } = this.data as ProjectInvitationData;
            await ProjectMember.appendMember(projectId, userId, projectRole);
          }
          break;
        default:
          throw new Error('not implemented');
      }
    }

    await this.save();
  }
}


export const PendingActionModel = getModelForClass(PendingAction, { schemaOptions: { timestamps: true } });


export const InvitationModel = getDiscriminatorModelForClass(PendingActionModel, Invitation);
