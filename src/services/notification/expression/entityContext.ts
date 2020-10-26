export interface Entity {
    parents: Entity[];
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
    email: string;
    image: string;
    projectRole: string;
}


export enum EntityContextMacro {
    'CURRENT_USER' = 'user',
    'ENTITY' = 'entity',
    'ENTITY_PARENT' = 'entity.parent',
}

export interface EntityContext<T extends Entity> {
    user: CurrentUser;
    members: ProjectMember[];
    entity: T;
    timestamp: number;
    req,
}

