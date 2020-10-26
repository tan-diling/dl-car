import { ExpressionRule } from "./exprssion";


const projectObject = {
    "parents": [],
    "assignees": [],
    "deleted": false,
    "status": 0,
    "seq": 0,
    "_id": "5f8ccc782a9baf1cddfaf75a",
    "key": "P10",
    "logo": "",
    "title": "Project 100601 test",
    "description": "here is sample desc",
    "creator": "5f850dbf3a6f8f16f6acb44c",
    "createdAt": "2020-10-18T23:15:04.982Z",
    "updatedAt": "2020-10-18T23:20:56.958Z",
    "totalEffort": 0,
    "type": "Project",
    "children": [],
    "comments": [],
    "attachments": [],
    "members": [
        {
            "_id": "5f8ccc782a9baf1cddfaf75b",
            "user": {
                "name": "Site Admin",
                "email": "onwards.admin@testmvp.com",
                "image": "",
                "_id": "5f850dbf3a6f8f16f6acb44c"
            },
            "projectRole": "project_manager"
        },
        {
            "_id": "5f8cceafa64f1514c8b89da4",
            "user": {
                "name": "New User",
                "email": "kuhantao@gmail.com",
                "image": "",
                "_id": "5f8cccac2a9baf1cddfaf75c"
            },
            "projectRole": "project_qa"
        }
    ]
}


const configExample: ExpressionRule = {
    comment: 'SEND EMAIL & NOTIFICATION',
    type: 'project.deliverable',
    expressions: [
        {
            // return true if status == in process   
            operator: 'EQ',
            params: [
                {
                    operator: "VAR",
                    params: ["ENTITY", "status"],
                },
                'in-progress'
            ],
        },
        {
            //** return true if user is assignee of this.parent (requirement)  */
            operator: 'IN',
            params: [
                {
                    operator: "VAR",
                    params: ["USER", "id"],
                },
                {
                    operator: "VAR",
                    params: ["ENTITY", "PARENT", "assignees"],
                }
            ],
        },
        {
            // return true if user is  QA or Developer
            operator: 'IN',
            params: [
                {
                    operator: "VAR",
                    params: ["USER", "projectRole"],
                },
                ["QA", "Develop"]
            ],
        },
    ],
    actions: [],
};
