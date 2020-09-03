
export enum RepoOperation {
    Created = "created",
    Retrieve = "retrieve",
    Updated = "updated",
    Deleted = "deleted",    
}


export interface RepoCRUDInterface{
    create(dto:any):Promise<any> ;
    list(filter:any):Promise<any> ;
    get(id:any):Promise<any> ;
    delete(id:string):Promise<any> ;
    update(id:string, dto:any):Promise<any> ;

    execute(method:string, dto: any):Promise<any> ;
}