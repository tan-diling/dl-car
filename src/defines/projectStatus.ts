
import { ProjectRole } from "./projectRole";
import { ResourceType } from './resourceType';

export enum ProjectStatus {
    Analysis = 0, 
    Development = 10, 
    Support=100 ,

    Draft=0, 
    PendingApproval=1, 
    UpdatePending=2,
    InProgress=10, 
    InReview=11,
    ReworkPending=12, 
    Completed=100, 
    Canceled=101,

    // Draft="Draft", 
    // PendingApproval="PendingApproval", 
    PendingFulfillment=10, 
    QAInProgress=11, 
    // Completed="Completed", 
    // Canceled="Canceled",


    TaskOpen=1, 
    TaskPlanned=4, 
    FixPending=12,

}



// export enum ProjectStatus {
//     Analysis="Analysis", 
//     Development="Development", 
//     Support="Support" ,

//     Draft="Draft", 
//     PendingApproval="PendingApproval", 
//     InProgress="InProgress", 
//     InReview="InReview", 
//     Completed="Completed", 
//     Canceled="Canceled",

//     // Draft="Draft", 
//     // PendingApproval="PendingApproval", 
//     PendingFulfillment="PendingFulfillment", 
//     // InReview="InReview", 
//     // Completed="Completed", 
//     // Canceled="Canceled",

// }



interface checkerFunction {
    (doc, status:ProjectStatus): Promise<boolean>|boolean;
}

async function checkerChildrenFunction(doc, targetStatus:ProjectStatus) {
    const children:Array<{deleted:boolean,status}> = await doc.getChildren() ;
    const notFinishedChild = children.find(x =>(x.deleted == false )&&  (x.status in [Status.Completed, Status.Canceled]));
    return notFinishedChild == null ;
}

interface StatusHandler {
    from:ProjectStatus,
    handlers:Array<{
        to:ProjectStatus,
        projectRoles:Array<string>,
        checker?:checkerFunction
    }>
}

const Status = ProjectStatus;

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
        to: Status.UpdatePending,
        projectRoles: [ProjectRole.ProjectManager],
    }, {
        to: Status.InProgress,
        projectRoles: [ProjectRole.ProjectManager],
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}, {
    from: Status.UpdatePending,
    handlers: [{
        to: Status.PendingApproval,
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
        to: Status.ReworkPending,
        projectRoles: [ProjectRole.ProjectManager],
    }, {
        to: Status.Completed,
        projectRoles: [ProjectRole.ProjectManager],
        checker: checkerChildrenFunction
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}, {
    from: Status.ReworkPending,
    handlers: [{
        to: Status.InReview,
        projectRoles: [ProjectRole.ProjectManager],
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
        to: Status.UpdatePending,
        projectRoles: [ProjectRole.ProjectManager],
    }, {
        to: Status.PendingFulfillment,
        projectRoles: [ProjectRole.ProjectManager],
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}, {
    from: Status.UpdatePending,
    handlers: [{
        to: Status.PendingApproval,
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
        to: Status.ReworkPending,
        projectRoles: [ProjectRole.ProjectManager],
    }, {
        to: Status.Completed,
        projectRoles: [ProjectRole.ProjectManager],
        checker: checkerChildrenFunction
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}, {
    from: Status.ReworkPending,
    handlers: [{
        to: Status.InReview,
        projectRoles: [ProjectRole.ProjectManager],
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
        to: Status.UpdatePending,
        projectRoles: [ProjectRole.ProjectManager],
    }, {
        to: Status.PendingFulfillment,
        projectRoles: [ProjectRole.ProjectManager],
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}, {
    from: Status.UpdatePending,
    handlers: [{
        to: Status.PendingApproval,
        projectRoles: [ProjectRole.ProjectManager],

    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]    
}, {
    from: Status.PendingFulfillment,
    handlers: [{
        to: Status.QAInProgress,
        projectRoles: [ProjectRole.ProjectManager,ProjectRole.QualityAssurance],
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}, {
    from: Status.QAInProgress,
    handlers: [{
        to: Status.FixPending,
        projectRoles: [ProjectRole.ProjectManager,ProjectRole.QualityAssurance],
    }, {
        to: Status.Completed,
        projectRoles: [ProjectRole.ProjectManager,ProjectRole.QualityAssurance],
        checker: checkerChildrenFunction
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}, {
    from: Status.FixPending,
    handlers: [{
        to: Status.QAInProgress,
        projectRoles: [ProjectRole.ProjectManager,ProjectRole.QualityAssurance],   
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]    
}
];



const taskStatusHandlers:Array<StatusHandler> = [{
    from: Status.Draft,
    handlers: [{
        to: Status.TaskOpen,
        projectRoles: [ProjectRole.ProjectManager,ProjectRole.Developer,ProjectRole.QualityAssurance],
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}, {
    from: Status.TaskOpen,
    handlers: [{
        to: Status.UpdatePending,
        projectRoles: [ProjectRole.ProjectManager,ProjectRole.QualityAssurance],
    }, {
        to: Status.TaskPlanned,
        projectRoles: [ProjectRole.ProjectManager],
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}, {
    from: Status.UpdatePending,
    handlers: [{
        to: Status.TaskOpen,
        projectRoles: [ProjectRole.ProjectManager],
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]    
}, {
    from: Status.TaskPlanned,
    handlers: [{
        to: Status.InProgress,
        projectRoles: [ProjectRole.ProjectManager,ProjectRole.Developer,ProjectRole.QualityAssurance],
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}, {
    from: Status.InProgress,
    handlers: [{
        to: Status.FixPending,
        projectRoles: [ProjectRole.ProjectManager,ProjectRole.Developer,ProjectRole.QualityAssurance],
    }, {
        to: Status.Completed,
        projectRoles: [ProjectRole.ProjectManager],
        // checker: checkerChildrenFunction
    }, {
        to: Status.Canceled,
        projectRoles: [ProjectRole.ProjectManager],
    }]
}, {
    from: Status.FixPending,
    handlers: [{
        to: Status.InProgress,
        projectRoles: [ProjectRole.ProjectManager,ProjectRole.Developer,ProjectRole.QualityAssurance],
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
