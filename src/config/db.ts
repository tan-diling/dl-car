import { config_get } from './config';

import { ResourceType,PermissionOperation,ProjectRole } from '@app/defines';

export const MONGODB_URL : string = config_get('mongodb.url') || 'mongodb://localhost:27017/dealing' ;


const permissionPolicy = {
    "table": "permissionpolicies",
    "dataArray":[
        {
            key:{ resource:ResourceType.Project, role:ProjectRole.ProjectAdmin },
            doc:{ scope:PermissionOperation.CRUD, }
        },
        {
            key:{ resource:ResourceType.Project, role:ProjectRole.ProjectManager },
            doc:{ scope:PermissionOperation.Retrieve + PermissionOperation.Update , }
        },
        {
            key:{ resource:ResourceType.Project, role:ProjectRole.Developer },
            doc:{ scope:PermissionOperation.Retrieve, }
        },
        {
            key:{ resource:ResourceType.Project, role:ProjectRole.Designer },
            doc:{ scope:PermissionOperation.Retrieve, }
        },
        {
            key:{ resource:ResourceType.Project, role:ProjectRole.QualityAssurance },
            doc:{ scope:PermissionOperation.Retrieve + PermissionOperation.Update , }
        },
    ]
};


let db_data =Array(config_get('init') || []) ;

// const DB_DATA_INIT:any[] = config_get('init') || [] ;

db_data.push(permissionPolicy) ;

export const DB_DATA_INIT = db_data ;

