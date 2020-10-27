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
    user: string;
    projectRole: string;
}

export interface CurrentUser {
    id: string;
    name: string;
    projectRole: string;
}


export const entityContextMacro = {
    // 'PARENT': ctx => ctx.user.projectRole,
    'USER_PROJECT_ROLE': ctx => ctx.user.projectRole,
    'USER_ID': ctx => ctx.user.id,
    'MEMBER': ctx => ctx.members.map(x => x.user),
    'MEMBER_QA': ctx => ctx.members.filter(x => x.projectRole == ProjectRole.QualityAssurance).map(x => x.user),
    'MEMBER_DESIGNER': ctx => ctx.members.filter(x => x.projectRole == ProjectRole.Designer).map(x => x.user),
    'MEMBER_DEVELOPER': ctx => ctx.members.filter(x => x.projectRole == ProjectRole.Developer).map(x => x.user),
    'MEMBER_PM': ctx => ctx.members.filter(x => x.projectRole == ProjectRole.ProjectManager).map(x => x.user),
    'MEMBER_OWNER': ctx => ctx.members.filter(x => x.projectRole == ProjectRole.ProjectOwner).map(x => x.user),
};

export interface EntityContext<T extends Entity> {
    user: CurrentUser;
    members: ProjectMember[];
    entity: T;
    entityType: string;
    method: string;
    timestamp: number;
    req,
}


