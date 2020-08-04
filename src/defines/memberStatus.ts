
/**
 * group role ,define model 'GroupMember' , field 'status'
 */
export enum MemberStatus{
    Invited = "invited",
    Refused = "refused",
    Confirmed = "confirmed"
}

export const GroupMemberStatus = MemberStatus;

export const ProjectMemberStatus = MemberStatus;