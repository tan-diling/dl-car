import { Request, Response, NextFunction, query } from 'express';

export enum Operation{
    CREATE,
    RETRIEVE,
    UPDATE,
    DELETE,
}

export interface IUser{role:string,id:string} ;

export interface RequestContext{
    request:Request,
    method:Operation,
    resourceType:String,

    resourceId?:String,    
    user?:IUser;
    filter?:any;  
    dto?:any;    
} 

export interface RepoCRUDInterface{
    create(dto) ;
    list(filter) ;
    delete(id) ;
    update(id,dto) ;
}
