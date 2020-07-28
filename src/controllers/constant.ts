/**
 * user role, define model 'User', field 'role'
 */
export enum SiteRole {
    admin = 'admin',
    client = 'client',
    staff = 'staff',
    visitor = 'visitor',
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
    project = 'project',    
    goal = 'goal', 
    requirement = 'requirement', 
    task= 'task' ,
    workLog = 'workLog',
}

/**
 * group role ,define model 'GroupMember' , field 'groupRole'
 */
export enum GroupRole{
    manager = "group_manager",
    member = "group_member"
}

/**
 * group role ,define model 'GroupMember' , field 'status'
 */
export enum GroupMemberStatus{
    invited = "invited",
    refused = "refused",
    confirmed = "confirmed"
}

