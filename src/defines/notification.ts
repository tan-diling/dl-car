export enum NotificationStatus {
    Unread = "unread",
    Read = 'read',
    Deleted = 'deleted'
}

export enum NotificationTopic {
    Invitation = "Invitation",
    Project = "Project",
    Entity = "Entity",
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
    Member = "member",
    Assignee = "assignee",
}

