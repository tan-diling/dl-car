import { ProjectRole } from '@app/defines';

export interface Entity {
    parents: Entity[];
    parent: Entity;
    assignees: string[];
    deleted: boolean;
    status: number;
    _id: string;
    title: string;
    description: string;
    creator: string;
    createdAt: string;
    updatedAt: string;
    type: string;
}

export interface ProjectMember {
    userId: string;
    projectRole: string;
}

export interface CurrentUser {
    id: string;
    name: string;
    projectRole: string;
}



export interface EntityContext<T extends Entity> {
    user: CurrentUser;
    members: ProjectMember[];
    entity: T;
    entityType: string;
    method: string;
    timestamp: number;
    req,
}


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
};

