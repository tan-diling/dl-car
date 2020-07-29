/**
 * user role, define model 'User', field 'role'
 */
export enum SiteRole {
    Admin = 'admin',
    Client = 'client',
    Staff = 'staff',
    Visitor = 'visitor',
}

/**
 * project role ,define model 'ProjectMember' , field 'projectRole'
 */
export enum ProjectRole {
    ProjectManager = 'project_manager',
    QualityAssurance ='project_qa',
    Developer = 'project_develop',
    Designer = 'project_Designer',
}

/**
 * resource type define
 */
export enum ResourceType {
    Project = 'project',    
    Goal = 'goal', 
    Requirement = 'requirement', 
    Task= 'task' ,
    WorkLog = 'workLog',
}

/**
 * group role ,define model 'GroupMember' , field 'groupRole'
 */
export enum GroupRole{
    Manager = "group_manager",
    Member = "group_member"
}

/**
 * group role ,define model 'GroupMember' , field 'status'
 */
export enum GroupMemberStatus{
    Invited = "invited",
    Refused = "refused",
    Confirmed = "confirmed"
}

