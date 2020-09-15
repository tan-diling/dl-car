
import { ProjectRole } from "./projectRole";
import { ResourceType } from './resourceType';

export enum ProjectStatus {
    Analysis="Analysis", 
    Development="Development", 
    Support="Support" ,

    Draft="Draft", 
    PendingApproval="PendingApproval", 
    InProgress="InProgress", 
    InReview="InReview", 
    Completed="Completed", 
    Canceled="Canceled",

    // Draft="Draft", 
    // PendingApproval="PendingApproval", 
    PendingFulfillment="PendingFulfillment", 
    // InReview="InReview", 
    // Completed="Completed", 
    // Canceled="Canceled",

}

const Status = ProjectStatus;

interface checkerFunction {
    (doc, status:string|ProjectStatus): Promise<boolean>|boolean;
}

const checkerChildrenFunction:checkerFunction = (doc, targetStatus:string| ProjectStatus) => doc.children.all(x => x.status in [Status.Completed, Status.Canceled]);

interface StatusHandler {
    from:string,
    handlers:Array<{
        to:string,
        projectRoles:Array<string>,
        checker?:checkerFunction
    }>
}


const projectStatusHandlers: Array<StatusHandler> = [{
    from: Status.Analysis,
    handlers: [{
        to: Status.Development,
        projectRoles: [ProjectRole.ProjectManager, ProjectRole.ProjectOwner],
    },]
}, {
    from: Status.Development,
    handlers: [{
        to: Status.Support,
        projectRoles: [ProjectRole.ProjectManager],
        checker: checkerChildrenFunction
    }]
}];


const goalStatusHandlers:Array<StatusHandler> = [{
    from: Status.Draft,
    handlers: [{
        to: Status.PendingApproval,
        projectRoles: [ProjectRole.ProjectManager],
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}, {
    from: Status.PendingApproval,
    handlers: [{
        to: Status.Draft,
        projectRoles: [ProjectRole.ProjectManager],
    }, {
        to: Status.InProgress,
        projectRoles: [ProjectRole.ProjectManager],
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}, {
    from: Status.InProgress,
    handlers: [{
        to: Status.InReview,
        projectRoles: [ProjectRole.ProjectManager],
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}, {
    from: Status.InReview,
    handlers: [{
        to: Status.InProgress,
        projectRoles: [ProjectRole.ProjectManager],
    }, {
        to: Status.Completed,
        projectRoles: [ProjectRole.ProjectManager],
        checker: checkerChildrenFunction
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}
];

const requirementStatusHandlers:Array<StatusHandler> = [{
    from: Status.Draft,
    handlers: [{
        to: Status.PendingApproval,
        projectRoles: [ProjectRole.ProjectManager],
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}, {
    from: Status.PendingApproval,
    handlers: [{
        to: Status.Draft,
        projectRoles: [ProjectRole.ProjectManager],
    }, {
        to: Status.PendingFulfillment,
        projectRoles: [ProjectRole.ProjectManager],
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}, {
    from: Status.PendingFulfillment,
    handlers: [{
        to: Status.InReview,
        projectRoles: [ProjectRole.ProjectManager],
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}, {
    from: Status.InReview,
    handlers: [{
        to: Status.PendingFulfillment,
        projectRoles: [ProjectRole.ProjectManager],
    }, {
        to: Status.Completed,
        projectRoles: [ProjectRole.ProjectManager],
        checker: checkerChildrenFunction
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}
];

export const StatusHandlers = new Map<string,Array<StatusHandler>>() ;

StatusHandlers.set(ResourceType.Project,projectStatusHandlers) ;

StatusHandlers.set(ResourceType.Goal,goalStatusHandlers) ;

StatusHandlers.set(ResourceType.Requirement,requirementStatusHandlers) ;

StatusHandlers.set(ResourceType.Deliverable, projectStatusHandlers) ;

StatusHandlers.set(ResourceType.Task, projectStatusHandlers) ;
