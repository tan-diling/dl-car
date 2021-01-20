import { Request, Response, NextFunction, query } from 'express';

export enum RequestOperation{
    CREATE,
    RETRIEVE,
    UPDATE,
    DELETE,
}

export interface IRequestUser{
    role:string,
    id:string,
    email:string,
} ;

export interface RequestContext{
    request:Request,
    method:RequestOperation | string,
    resourceType:string,
    resourceId?:string,
    // projectId?:string, 

    user?:IRequestUser;
    filter?:any;  
    dto?:any;    
} 