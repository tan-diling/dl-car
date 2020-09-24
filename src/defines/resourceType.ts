
/**
 * resource type define
 */
export enum ResourceType {
    Project = 'project',    
    Goal = 'goal', 
    Requirement = 'requirement', 
    Deliverable = 'deliverable',
    Task= 'task' ,
    //
    Effort = 'effort',
    Comment = 'comment',
    CheckList = 'checklist',

    Attachment = 'attachment',
}


export function isBaseResourceType(type:string){
    const resourceTypes:string[] = [
        ResourceType.Project,
        ResourceType.Goal,
        ResourceType.Requirement,
        ResourceType.Deliverable,
        ResourceType.Task,
    ];

    return resourceTypes.find(x=>x.toLowerCase()==type.toLowerCase()) != null ;
}