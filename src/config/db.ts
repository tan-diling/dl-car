import { config_get, DEBUG } from './config';

import { ResourceType, PermissionOperation, ProjectRole } from '@app/defines';

export const MONGODB_URL: string = config_get('mongodb.url') ;

const dbInitData = [];

// //init user data
// dbInitData.push({
//     "table": "users",
//     "dataArray": [
//         {
//             "key": {
//                 "email": "dilingcloud@gmail.com"
//             },
//             "doc": {
//                 "name": "Site Admin",
//                 "password": "88888888",
//                 "emailValidated": true,
//                 "company": "Diling",
//                 "role": "admin",
//                 "deleted": false,
//             }
//         }
//     ]
// });


// // init permissionPolicy
// dbInitData.push({
//     "table": "permissionpolicies",
//     "dataArray": [
//         {
//             key: { resource: ResourceType.Project, role: ProjectRole.ProjectOwner },
//             doc: { scope: PermissionOperation.CRUD, }
//         },
//         {
//             key: { resource: ResourceType.Goal, role: ProjectRole.ProjectOwner },
//             doc: { scope: PermissionOperation.CRUD, }
//         },
//         {
//             key: { resource: ResourceType.Requirement, role: ProjectRole.ProjectOwner },
//             doc: { scope: PermissionOperation.CRUD, }
//         },
//         {
//             key: { resource: ResourceType.Deliverable, role: ProjectRole.ProjectOwner },
//             doc: { scope: PermissionOperation.CRUD, }
//         },
//         {
//             key: { resource: ResourceType.Task, role: ProjectRole.ProjectOwner },
//             doc: { scope: PermissionOperation.CRUD, }
//         },
//         {
//             key: { resource: ResourceType.Project, role: ProjectRole.ProjectManager },
//             doc: { scope: PermissionOperation.Retrieve + PermissionOperation.Update, }
//         },
//         {
//             key: { resource: ResourceType.Goal, role: ProjectRole.ProjectManager },
//             doc: { scope: PermissionOperation.CRUD, }
//         },
//         {
//             key: { resource: ResourceType.Requirement, role: ProjectRole.ProjectManager },
//             doc: { scope: PermissionOperation.CRUD, }
//         },
//         {
//             key: { resource: ResourceType.Deliverable, role: ProjectRole.ProjectManager },
//             doc: { scope: PermissionOperation.CRUD, }
//         },
//         {
//             key: { resource: ResourceType.Task, role: ProjectRole.ProjectManager },
//             doc: { scope: PermissionOperation.CRUD, }
//         },

//         {
//             key: { resource: ResourceType.Project, role: ProjectRole.QualityAssurance },
//             doc: { scope: PermissionOperation.Retrieve + PermissionOperation.Update, }
//         },
//         {
//             key: { resource: ResourceType.Goal, role: ProjectRole.QualityAssurance },
//             doc: { scope: PermissionOperation.CRUD, }
//         },
//         {
//             key: { resource: ResourceType.Requirement, role: ProjectRole.QualityAssurance },
//             doc: { scope: PermissionOperation.CRUD, }
//         },
//         {
//             key: { resource: ResourceType.Deliverable, role: ProjectRole.QualityAssurance },
//             doc: { scope: PermissionOperation.CRUD, }
//         },
//         {
//             key: { resource: ResourceType.Task, role: ProjectRole.QualityAssurance },
//             doc: { scope: PermissionOperation.CRUD, }
//         },
//         {
//             key: { resource: ResourceType.Project, role: ProjectRole.Developer },
//             doc: { scope: PermissionOperation.Retrieve, }
//         },
//         {
//             key: { resource: ResourceType.Goal, role: ProjectRole.Developer },
//             doc: { scope: PermissionOperation.Retrieve, }
//         },
//         {
//             key: { resource: ResourceType.Requirement, role: ProjectRole.Developer },
//             doc: { scope: PermissionOperation.Retrieve, }
//         },
//         {
//             key: { resource: ResourceType.Deliverable, role: ProjectRole.Developer },
//             doc: { scope: PermissionOperation.Retrieve, }
//         },
//         {
//             key: { resource: ResourceType.Task, role: ProjectRole.Developer },
//             doc: { scope: PermissionOperation.Create + PermissionOperation.Retrieve + + PermissionOperation.Update, }
//         },
//         {
//             key: { resource: ResourceType.Project, role: ProjectRole.Designer },
//             doc: { scope: PermissionOperation.Retrieve, }
//         },
//         {
//             key: { resource: ResourceType.Goal, role: ProjectRole.Designer },
//             doc: { scope: PermissionOperation.Retrieve, }
//         },
//         {
//             key: { resource: ResourceType.Requirement, role: ProjectRole.Designer },
//             doc: { scope: PermissionOperation.Retrieve, }
//         },
//         {
//             key: { resource: ResourceType.Deliverable, role: ProjectRole.Designer },
//             doc: { scope: PermissionOperation.Retrieve, }
//         },
//         {
//             key: { resource: ResourceType.Task, role: ProjectRole.Designer },
//             doc: { scope: PermissionOperation.Retrieve, }
//         },
//     ]
// });

export const DB_DATA_INIT = dbInitData;

export const DB_DEBUG = String(config_get("DEBUG")).includes('db') && DEBUG;

