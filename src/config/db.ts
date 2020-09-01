import { config_get } from './config';

import { ResourceType,PermissionOperation,ProjectRole } from '@app/defines';

export const MONGODB_URL : string = config_get('mongodb.url') || 'mongodb://localhost:27017/dealing' ;

const  dbInitData = [] ;

//init user data
dbInitData.push({
    "table": "users",
    "dataArray": [
        {
            "key": {
                "email": "admin@admin.com"
            },
            "doc": {
                "name": "admin",
                "email": "admin@admin.com",
                "password": "Dealing.123",
                "emailValidated": true,
                "role": "admin"
            }
        }
    ]
}) ;


// init permissionPolicy
dbInitData.push({    
    "table": "permissionpolicies",
    "dataArray":[
        {
            key:{ resource:ResourceType.Project, role:ProjectRole.ProjectOwner },
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
});

export const DB_DATA_INIT = dbInitData ;

