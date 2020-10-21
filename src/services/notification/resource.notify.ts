import { Model, Document, Types, } from 'mongoose';
import { RepoCRUDInterface, MemberStatus, NotificationAction, NotificationTopic, ProjectRole, ResourceType } from '@app/defines';
import { Event, ProjectModel, ProjectMemberModel, Project, ProjectMember, ResourceModel, Resource, ResourceRelatedBase, EffortModel, User } from '@app/models';
import { ReturnModelType, DocumentType } from '@typegoose/typegoose';
import { ForbiddenError, NotAcceptableError, JsonController } from 'routing-controllers';
import { StatusHandlers, ProjectStatus } from '@app/defines/projectStatus';
import { DbService } from '../db.service';
import { Container } from 'typedi';
import { NotificationService } from '.';
import * as safeEval from 'notevil';


const notificationService= Container.get(NotificationService) ;

interface UserProviderInterface{
    (event:DocumentType<Event>):Promise<Array<Types.ObjectId>|void> ;
}

const userProvider = new Map<string,UserProviderInterface>()

function queryProjectMembers(role?:ProjectRole){
    const handler = async doc=>{ 
        let pms =  doc.data.members ;   
        if(role){
            pms = pms.filter(x=>x.ProjectRole == role) ;
        }
        return pms.map(x=>x.userId) ;
    }

    return handler ;
}

function queryEntityAssignees(type?:string){
    const handler = async doc=>{ 
        const resourceArray =[...doc.data.parents,doc.data] ;
        for(const resource of resourceArray){
            if (resource.type == type) return resource.assignees ;
        }
        return [] ;
    }

    return handler ;
}

userProvider.set("project_members", queryProjectMembers());

userProvider.set("project_manager", queryProjectMembers(ProjectRole.ProjectManager)) ;

userProvider.set("project_qa", queryProjectMembers(ProjectRole.QualityAssurance)) ;

userProvider.set("project_develop", queryProjectMembers(ProjectRole.Developer)) ;

userProvider.set("project_designer", queryProjectMembers(ProjectRole.Developer)) ;

userProvider.set("project_assignees", queryEntityAssignees(ResourceType.Project)) ;

userProvider.set("goal_assignees", queryEntityAssignees(ResourceType.Goal)) ;

userProvider.set("requirement_assignees", queryEntityAssignees(ResourceType.Requirement)) ;

userProvider.set("deliverable_assignees", queryEntityAssignees(ResourceType.Deliverable)) ;

userProvider.set("task_assignees", queryEntityAssignees(ResourceType.Task)) ;

// userProvider.set("current_assignees", queryEntityAssignees(ResourceType.Task)) ;


interface MailTemplateInterface{
    (receiver:User,event:DocumentType<Event>):Promise<{subject:string,html:string}> ;
}

const mailTemplate = new Map<string,MailTemplateInterface>();
mailTemplate.set("default", async (user,ev)=> {
       return {
           subject: `GCP Notification ${ev.type} ${ev.action} ${Date.now()}`,
           html: `GCP Notification ${ev.type} ${ev.action} ${Date.now()} \n id: ${ev._id}`
       };
});

export class ResourceNotify{
    /**
     *
     */
    
    constructor(private event: DocumentType<Event>) {
                
    }

    //get user list
    async getUsers(doc:DocumentType<Event> ,provider:string){
        const userProviderFunction=userProvider.get(provider) ;

        if(userProviderFunction){
            return await userProviderFunction(doc) ;
        }
        return [] ;
    }    

    async getEmailInfo(user, event: DocumentType<Event> ,provider:string){
        mailTemplate
    }    

    async eval(expr:string,event: DocumentType<Event>){
        const resource = event.data as Resource ;
        const resourceArray =[resource,resource] ;
    
        const preDefines = {
            PROJECT:resourceArray.find(x=>x.type==ResourceType.Project),
            GOAL:resourceArray.find(x=>x.type==ResourceType.Goal),
            REQUIREMENT:resourceArray.find(x=>x.type==ResourceType.Requirement),
            DELIVERABLE:resourceArray.find(x=>x.type==ResourceType.Deliverable),
            TASK:resourceArray.find(x=>x.type==ResourceType.Task), 

            TYPE_PROJECT:ResourceType.Project,
            TYPE_GOAL:ResourceType.Goal,
            TYPE_REQUIREMENT:ResourceType.Requirement,
            TYPE_DELIVERABLE:ResourceType.Deliverable,
            TYPE_TASK:ResourceType.Task, 

            STATUS_PROCESSING:ProjectStatus.InProgress,       
            STATUS_COMPLETED:ProjectStatus.Completed,       
            STATUS_CANCELED:ProjectStatus.Canceled,       
        } ;
        return safeEval(expr,{
            ...event.data,
            ...preDefines,
        })

    }

}