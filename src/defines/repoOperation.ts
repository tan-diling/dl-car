
export enum RepoOperation {
    Created = "created",
    Retrieve = "retrieve",
    Updated = "updated",
    Deleted = "deleted",    
}


export interface RepoCRUDInterface{
    create(dto) ;
    list(filter) ;
    delete(id) ;
    update(id,dto) ;
}