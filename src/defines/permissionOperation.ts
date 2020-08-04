
export enum PermissionOperation {
    Create = 0x01,
    Retrieve = 0x02,
    Update = 0x04,
    Delete = 0x08,  

    CRUD = 0x0f,

    Current = 0x10, 
    Inherit = 0x80, 
}