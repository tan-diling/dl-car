
import { ProjectRole } from "./projectRole";
import { ResourceType } from './resourceType';


export enum ResourceStatus {
    Analysis = 0, 
    Development = 10, 
    Support=100 ,

    Draft=0, 
    PendingApproval=1, 
    InProgress=10, 
    InReview=11, 
    Completed=100, 
    Canceled=101,

    // Draft="Draft", 
    // PendingApproval="PendingApproval", 
    PendingFulfillment=10, 
    // InReview="InReview", 
    // Completed="Completed", 
    // Canceled="Canceled",

}


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

async function checkerChildrenFunction(doc, targetStatus:string| ProjectStatus) {
    const children:Array<{deleted:boolean,status}> = await doc.getChildren() ;
    const notFinishedChild = children.find(x =>(x.deleted == false )&&  (x.status in [Status.Completed, Status.Canceled]));
    return notFinishedChild == null ;
}

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


const deliverableStatusHandlers:Array<StatusHandler> = [{
    from: Status.Draft,
    handlers: [{
        to: Status.PendingApproval,
        projectRoles: [ProjectRole.ProjectManager,ProjectRole.QualityAssurance],
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
        projectRoles: [ProjectRole.ProjectManager,ProjectRole.QualityAssurance],
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}, {
    from: Status.InReview,
    handlers: [{
        to: Status.PendingFulfillment,
        projectRoles: [ProjectRole.ProjectManager,ProjectRole.QualityAssurance],
    }, {
        to: Status.Completed,
        projectRoles: [ProjectRole.ProjectManager,ProjectRole.QualityAssurance],
        checker: checkerChildrenFunction
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}
];



const taskStatusHandlers:Array<StatusHandler> = [{
    from: Status.Draft,
    handlers: [{
        to: Status.PendingApproval,
        projectRoles: [ProjectRole.ProjectManager,ProjectRole.Developer,ProjectRole.QualityAssurance],
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}, {
    from: Status.PendingApproval,
    handlers: [{
        to: Status.Draft,
        projectRoles: [ProjectRole.ProjectManager,ProjectRole.QualityAssurance],
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
        projectRoles: [ProjectRole.ProjectManager,ProjectRole.Developer,ProjectRole.QualityAssurance],
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}, {
    from: Status.InReview,
    handlers: [{
        to: Status.PendingFulfillment,
        projectRoles: [ProjectRole.ProjectManager,ProjectRole.Developer,ProjectRole.QualityAssurance],
    }, {
        to: Status.Completed,
        projectRoles: [ProjectRole.ProjectManager],
        // checker: checkerChildrenFunction
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

StatusHandlers.set(ResourceType.Deliverable, deliverableStatusHandlers) ;

StatusHandlers.set(ResourceType.Task, taskStatusHandlers) ;
