import { ProjectRole } from '@app/defines';
// base entity define
export interface Entity {
    parents: Entity[] | string[];
    paren?: Entity;
    assignees: string[];
    deleted: boolean;
    // 0-draft,1-pending approval,2-update pending,10-in process,11-in review,12-rework pending,100-completed,101-canceled
    status: number;
    _id: string;
    title: string;
    description: string;
    creator: string;
    createdAt: string;
    updatedAt: string;
    type: string;
    seq?: number;

    children: Entity[];
}

// project 
export interface ProjectEntity extends Entity {
    key: string;
    logo?: string;
}

// goal
export interface GoalEntity extends Entity {
    roi?: number;

    notes?: string;

    approvedAt?: Date;

}

// requirement
export interface RequirementEntity extends Entity {

}

// deliverable
export interface DeliverableEntity extends Entity {
    severity?: number;

    priority?: number;

    tags?: string[];

}

// task
export interface TaskEntity extends Entity {

}


// project member
export interface ProjectMember {
    userId: string;
    projectRole: string;
}

// user
export interface CurrentUser {
    id: string;
    name: string;
    // email: string;
    projectRole: string;
}


// entity notification object, for expression ctx
export interface EntityContext<T extends Entity> {
    user: CurrentUser;
    members: ProjectMember[];
    entity: T;
    entityType: string;
    method: string;
    timestamp: number;
    req: { url?, body?, method, },
}

// expression eval macro 
export const entityContextMacro = {
    // 'PARENT': ctx => ctx.user.projectRole,
    'USER_PROJECT_ROLE': (ctx: EntityContext<Entity>) => ctx.user.projectRole,
    'USER_ID': (ctx: EntityContext<Entity>) => ctx.user.id,
    'MEMBER': (ctx: EntityContext<Entity>) => ctx.members.map(x => x.userId),
    'MEMBER_QA': (ctx: EntityContext<Entity>) => ctx.members.filter(x => x.projectRole == ProjectRole.QualityAssurance).map(x => x.userId),
    'MEMBER_DESIGNER': (ctx: EntityContext<Entity>) => ctx.members.filter(x => x.projectRole == ProjectRole.Designer).map(x => x.userId),
    'MEMBER_DEVELOPER': (ctx: EntityContext<Entity>) => ctx.members.filter(x => x.projectRole == ProjectRole.Developer).map(x => x.userId),
    'MEMBER_PM': (ctx: EntityContext<Entity>) => ctx.members.filter(x => x.projectRole == ProjectRole.ProjectManager).map(x => x.userId),
    'MEMBER_OWNER': (ctx: EntityContext<Entity>) => ctx.members.filter(x => x.projectRole == ProjectRole.ProjectOwner).map(x => x.userId),
    'MEMBER_APPEND': (ctx: EntityContext<Entity>) => ctx.method == 'member.append' ? [ctx.req.body?._user?._id] : [],
    'MEMBER_REMOVE': (ctx: EntityContext<Entity>) => ctx.method == 'member.remove' ? [ctx.req.body?._user?._id] : [],
    'ASSIGNEE_APPEND': (ctx: EntityContext<Entity>) => ctx.method == 'assignee.append' ? [ctx.req.body?._user?._id] : [],
    'ASSIGNEE_REMOVE': (ctx: EntityContext<Entity>) => ctx.method == 'assignee.remove' ? [ctx.req.body?._user?._id] : [],
};

