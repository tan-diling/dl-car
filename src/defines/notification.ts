export enum NotificationStatus {
    Unread = "unread",
    Read = 'read',
    Deleted = 'deleted'
}

export enum NotificationTopic {
    Invitation = "Invitation",
    // Project = "Project",
    Entity = "Entity",
    User = "User",
    Group = "Group",
    Contact = "Contact",
    Notification = "Notification",
    // InvitationContact="InvitationContact",
    // InvitationGroup="InvitationGroup",
    // InvitationProject="InvitationProject",
}

export enum NotificationAction {
    Invite = "Invited",
    Accept = "Accepted",
    Reject = "Rejected",

    Created = "created",
    Updated = "updated",
    Deleted = "deleted",
    Status = "status",
    MemberAppend = "member.append",
    MemberUpdated = "member.updated",
    MemberRemove = "member.remove",
    AssigneeAppend = "assignee.append",
    AssigneeRemove = "assignee.remove",
    Assignee = "assignee",
    Member = "member",
}

