import { ExpressionRule } from "./expression";

// entity schema 
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

const requirementObject = {
    "parents": [
        {
            "parents": [],
            "assignees": [],
            "deleted": true,
            "status": 0,
            "seq": 8,
            "_id": "5f61601e0351f54d17574941",
            "key": "T15",
            "logo": "",
            "title": "Project 01",
            "description": "here is sample desc",
            "creator": "5f5897f916ac8902ed769e60",
            "createdAt": "2020-09-16T00:45:18.077Z",
            "updatedAt": "2020-09-28T01:48:52.097Z",
            "type": "Project"
        },
        {
            "parents": [
                "5f61601e0351f54d17574941"
            ],
            "assignees": [
                "5f5897f916ac8902ed769e60"
            ],
            "deleted": true,
            "status": 11,
            "seq": 2,
            "roi": 6,
            "_id": "5f6160760351f54d17574944",
            "title": "goal 91602",
            "notes": "test notes 2",
            "estimate": 220,
            "deadline": "2020-10-04T01:00:00.000Z",
            "description": "here is sample desc for Goal 2",
            "creator": "5f5897f916ac8902ed769e60",
            "createdAt": "2020-09-16T00:46:46.814Z",
            "updatedAt": "2020-09-28T01:46:09.640Z",
            "type": "Goal"
        }
    ],
    "assignees": [],
    "deleted": false,
    "status": 0,
    "seq": 3,
    "_id": "5f6177e10351f54d17574945",
    "title": "Requirement 001",
    "description": "here is sample desc",
    "creator": "5f5897f916ac8902ed769e60",
    "createdAt": "2020-09-16T02:26:41.274Z",
    "updatedAt": "2020-10-12T05:15:11.458Z",
    "totalEffort": 120,
    "type": "Requirement",
    "children": [
        {
            "parents": [
                "5f61601e0351f54d17574941",
                "5f6160760351f54d17574944",
                "5f6177e10351f54d17574945"
            ],
            "assignees": [],
            "deleted": false,
            "status": 1,
            "seq": 4,
            "tags": [
                "QA",
                "T3"
            ],
            "_id": "5f6179730351f54d17574946",
            "severity": 5,
            "priority": 5,
            "title": "testcase 02",
            "description": "here is sample desc fro deliverable update",
            "creator": "5f5897f916ac8902ed769e60",
            "createdAt": "2020-09-16T02:33:23.017Z",
            "updatedAt": "2020-10-07T03:14:08.346Z",
            "type": "Deliverable"
        },
        {
            "parents": [
                "5f61601e0351f54d17574941",
                "5f6160760351f54d17574944",
                "5f6177e10351f54d17574945"
            ],
            "assignees": [],
            "deleted": false,
            "status": 1,
            "seq": 5,
            "tags": [
                "QA",
                "T3"
            ],
            "_id": "5f6179a50351f54d17574947",
            "severity": 5,
            "priority": 5,
            "title": "testcase 02",
            "description": "here is sample desc fro deliverable update",
            "creator": "5f5897f916ac8902ed769e60",
            "createdAt": "2020-09-16T02:34:13.663Z",
            "updatedAt": "2020-09-28T01:47:43.957Z",
            "type": "Deliverable"
        }
    ],
    "comments": [],
    "attachments": [],
    "completion": {
        "total": 3,
        "done": 0
    }
}

const goalObject = {
    "parents": [
        {
            "parents": [],
            "assignees": [],
            "deleted": false,
            "status": 0,
            "seq": 3,
            "_id": "5f6d9d5e8e2e404fed449257",
            "key": "TT",
            "logo": "",
            "title": "Project 01",
            "description": "here is sample desc",
            "creator": "5f6d9cdc8e2e404fed449255",
            "createdAt": "2020-09-25T07:33:50.766Z",
            "updatedAt": "2020-09-25T08:07:04.775Z",
            "type": "Project"
        }
    ],
    "assignees": [],
    "deleted": false,
    "status": 0,
    "seq": 1,
    "roi": 6,
    "_id": "5f6da167ec80fe20a1271fc0",
    "title": "goal 91602",
    "notes": "test notes 2",
    "estimate": 220,
    "deadline": "2020-10-04T01:00:00.000Z",
    "description": "here is sample desc for Goal 2",
    "creator": "5f6d9cdc8e2e404fed449255",
    "createdAt": "2020-09-25T07:51:03.475Z",
    "updatedAt": "2020-09-25T08:06:31.655Z",
    "totalEffort": 0,
    "type": "Goal",
    "children": [
        {
            "parents": [
                "5f6d9d5e8e2e404fed449257",
                "5f6da167ec80fe20a1271fc0"
            ],
            "assignees": [],
            "deleted": false,
            "status": 0,
            "seq": 3,
            "_id": "5f6da5280f298b28d6f81a05",
            "title": "Requirement 001",
            "description": "here is sample desc",
            "creator": "5f6d9cdc8e2e404fed449255",
            "createdAt": "2020-09-25T08:07:04.773Z",
            "updatedAt": "2020-09-25T08:07:24.287Z",
            "type": "Requirement"
        }
    ],
    "comments": [],
    "attachments": []
}

const deliverableObject = {
    "parents": [
        {
            "parents": [],
            "assignees": [],
            "deleted": true,
            "status": 0,
            "seq": 8,
            "_id": "5f61601e0351f54d17574941",
            "key": "T15",
            "logo": "",
            "title": "Project 01",
            "description": "here is sample desc",
            "creator": "5f5897f916ac8902ed769e60",
            "createdAt": "2020-09-16T00:45:18.077Z",
            "updatedAt": "2020-09-28T01:48:52.097Z",
            "type": "Project"
        },
        {
            "parents": [
                "5f61601e0351f54d17574941"
            ],
            "assignees": [
                "5f5897f916ac8902ed769e60"
            ],
            "deleted": true,
            "status": 11,
            "seq": 2,
            "roi": 6,
            "_id": "5f6160760351f54d17574944",
            "title": "goal 91602",
            "notes": "test notes 2",
            "estimate": 220,
            "deadline": "2020-10-04T01:00:00.000Z",
            "description": "here is sample desc for Goal 2",
            "creator": "5f5897f916ac8902ed769e60",
            "createdAt": "2020-09-16T00:46:46.814Z",
            "updatedAt": "2020-09-28T01:46:09.640Z",
            "type": "Goal"
        },
        {
            "parents": [
                "5f61601e0351f54d17574941",
                "5f6160760351f54d17574944"
            ],
            "assignees": [],
            "deleted": false,
            "status": 0,
            "seq": 3,
            "_id": "5f6177e10351f54d17574945",
            "title": "Requirement 001",
            "description": "here is sample desc",
            "creator": "5f5897f916ac8902ed769e60",
            "createdAt": "2020-09-16T02:26:41.274Z",
            "updatedAt": "2020-10-12T05:15:11.458Z",
            "type": "Requirement"
        }
    ],
    "assignees": [],
    "deleted": false,
    "status": 1,
    "seq": 5,
    "tags": [
        "QA",
        "T3"
    ],
    "_id": "5f6179a50351f54d17574947",
    "severity": 5,
    "priority": 5,
    "title": "testcase 02",
    "description": "here is sample desc fro deliverable update",
    "creator": "5f5897f916ac8902ed769e60",
    "createdAt": "2020-09-16T02:34:13.663Z",
    "updatedAt": "2020-09-28T01:47:43.957Z",
    "totalEffort": 120,
    "type": "Deliverable",
    "children": [],
    "comments": [
        {
            "_id": "5f6984980559b4552765386e",
            "title": "comment 01",
            "creator": "5f5897f916ac8902ed769e60",
            "parent": "5f6179a50351f54d17574947",
            "createdAt": "2020-09-22T04:59:04.906Z",
            "updatedAt": "2020-09-22T04:59:04.906Z"
        },
        {
            "_id": "5f69a3a519c22a636e908cc9",
            "title": "comment 02",
            "creator": "5f5897f916ac8902ed769e60",
            "parent": "5f6179a50351f54d17574947",
            "createdAt": "2020-09-22T07:11:33.386Z",
            "updatedAt": "2020-09-22T07:11:33.386Z"
        }
    ],
    "checklist": [
        {
            "deleted": false,
            "_id": "5f69a40520349201b6f3c821",
            "title": "comment 02",
            "done": false,
            "creator": "5f5897f916ac8902ed769e60",
            "parent": "5f6179a50351f54d17574947",
            "createdAt": "2020-09-22T07:13:09.670Z",
            "updatedAt": "2020-09-22T07:13:09.670Z"
        },
        {
            "deleted": false,
            "_id": "5f83d350487016439be53071",
            "title": "check 02",
            "done": false,
            "creator": "5f5897f916ac8902ed769e60",
            "parent": "5f6179a50351f54d17574947",
            "createdAt": "2020-10-12T03:53:52.482Z",
            "updatedAt": "2020-10-12T03:53:52.482Z"
        },
        {
            "deleted": false,
            "_id": "5f83d35c487016439be53072",
            "title": "check 03",
            "done": false,
            "creator": "5f5897f916ac8902ed769e60",
            "parent": "5f6179a50351f54d17574947",
            "createdAt": "2020-10-12T03:54:04.625Z",
            "updatedAt": "2020-10-12T03:54:04.625Z"
        }
    ],
    "attachments": [
        {
            "deleted": false,
            "_id": "5f6c0db7d21cb41128a59116",
            "title": "http-status-codes-1.csv",
            "ext": ".csv",
            "path": "20200924/5f6c0db7d21cb41128a59116.csv",
            "creator": "5f5897f916ac8902ed769e60",
            "parent": "5f6179a50351f54d17574947",
            "createdAt": "2020-09-24T03:08:43.067Z",
            "updatedAt": "2020-09-24T03:08:43.067Z"
        },
        {
            "deleted": false,
            "_id": "5f6c56b3b99fe468baab667a",
            "title": "asyncapi.zip",
            "ext": ".zip",
            "path": "20200924/5f6c56b3b99fe468baab667a.zip",
            "creator": "5f5897f916ac8902ed769e60",
            "parent": "5f6179a50351f54d17574947",
            "createdAt": "2020-09-24T08:20:03.525Z",
            "updatedAt": "2020-09-24T08:20:03.525Z"
        }
    ]
}

const taskObject = {
    "parents": [
        {
            "parents": [],
            "assignees": [],
            "deleted": true,
            "status": 0,
            "seq": 8,
            "_id": "5f61601e0351f54d17574941",
            "key": "T15",
            "logo": "",
            "title": "Project 01",
            "description": "here is sample desc",
            "creator": "5f5897f916ac8902ed769e60",
            "createdAt": "2020-09-16T00:45:18.077Z",
            "updatedAt": "2020-09-28T01:48:52.097Z",
            "type": "Project"
        },
        {
            "parents": [
                "5f61601e0351f54d17574941"
            ],
            "assignees": [
                "5f5897f916ac8902ed769e60"
            ],
            "deleted": true,
            "status": 11,
            "seq": 2,
            "roi": 6,
            "_id": "5f6160760351f54d17574944",
            "title": "goal 91602",
            "notes": "test notes 2",
            "estimate": 220,
            "deadline": "2020-10-04T01:00:00.000Z",
            "description": "here is sample desc for Goal 2",
            "creator": "5f5897f916ac8902ed769e60",
            "createdAt": "2020-09-16T00:46:46.814Z",
            "updatedAt": "2020-09-28T01:46:09.640Z",
            "type": "Goal"
        },
        {
            "parents": [
                "5f61601e0351f54d17574941",
                "5f6160760351f54d17574944"
            ],
            "assignees": [],
            "deleted": false,
            "status": 0,
            "seq": 3,
            "_id": "5f6177e10351f54d17574945",
            "title": "Requirement 001",
            "description": "here is sample desc",
            "creator": "5f5897f916ac8902ed769e60",
            "createdAt": "2020-09-16T02:26:41.274Z",
            "updatedAt": "2020-10-12T05:15:11.458Z",
            "type": "Requirement"
        },
        {
            "parents": [
                "5f61601e0351f54d17574941",
                "5f6160760351f54d17574944",
                "5f6177e10351f54d17574945"
            ],
            "assignees": [],
            "deleted": false,
            "status": 1,
            "seq": 5,
            "tags": [
                "QA",
                "T3"
            ],
            "_id": "5f6179a50351f54d17574947",
            "severity": 5,
            "priority": 5,
            "title": "testcase 02",
            "description": "here is sample desc fro deliverable update",
            "creator": "5f5897f916ac8902ed769e60",
            "createdAt": "2020-09-16T02:34:13.663Z",
            "updatedAt": "2020-09-28T01:47:43.957Z",
            "type": "Deliverable"
        }
    ],
    "assignees": [],
    "deleted": true,
    "status": 0,
    "seq": 6,
    "todoList": [],
    "_id": "5f617ffd0351f54d17574948",
    "title": "Task 01",
    "description": "here is sample desc",
    "creator": "5f5897f916ac8902ed769e60",
    "createdAt": "2020-09-16T03:01:17.939Z",
    "updatedAt": "2020-09-22T04:11:42.829Z",
    "totalEffort": 0,
    "type": "Task",
    "comments": [],
    "attachments": []

}


export const entityConfig: ExpressionRule[] = [
    {
        comment: 'Entity(deliverable) "updated" SEND EMAIL & NOTIFICATION',
        type: 'deliverable',
        method: 'updated',
        expressions: [
            // return true ,if its parent(Requirement) status is “InProgress” 
            {
                operator: 'EQ',
                params: [
                    {
                        operator: "VAR",
                        params: ["entity", "parent", "status"],
                    },
                    10,//CONST_STATUS_IN_PROGRESS,
                ],
            },
            // return true, if its parent' parent (Goal) status is “InProgress” and deadline time < ‘NOW’  
            {
                operator: 'AND',
                params: [
                    {
                        operator: 'EQ',
                        params: [
                            {
                                operator: "VAR",
                                params: ["entity", "parent", "parent", "status"],
                            },
                            10,//CONST_STATUS_IN_PROGRESS,
                        ]
                    },
                    {
                        operator: 'GT',
                        params: [
                            {
                                operator: "VAR",
                                params: ["entity", "parent", "parent", "deadline"],
                            },
                            {
                                operator: "DATE",
                                params: [],
                            },
                        ]
                    },

                ],
            },
            //return true, if its parent' parent’ parent (Project) project members count >2 
            {
                operator: 'GT',
                params: [
                    {
                        operator: "VAR",
                        params: ["members", "length"],
                    },
                    2
                ],
            },
            //return true, if its  project members one of is  “PO”
            {
                operator: 'IN',
                params: [
                    "project_manager",
                    {
                        operator: "MAP",
                        params: [
                            {
                                operator: "VAR",
                                params: ["members"],
                            },
                            "projectRole"
                        ],
                    },

                ],
            },
            // return true if it’s child ‘Task’ is Exists
            {
                operator: 'GT',
                params: [
                    {
                        operator: "VAR",
                        params: ["entity", "children", "length"],
                    },
                    0
                ],
            },
            // current user is one of  Deliverable 's  assignee
            {
                operator: 'IN',
                params: [
                    {
                        operator: "VAR",
                        params: ["user", "id"],
                    },
                    {
                        operator: "VAR",
                        params: ["entity", "assignee"],
                    },
                ],
            },
        ],
        actions: [{
            receiver: "entity.assignee,parent.assignee,parent.parent.assignee,MEMBER_PM",
            channel: "db,mail"
        }],
    },
    {
        comment: 'Entity "created",SEND EMAIL & NOTIFICATION to PROJECT_MEMBER',
        // type: 'project',
        method: "created",
        expressions: [
        ],
        actions: [
            {
                receiver: "MEMBER",
                channel: "db,mail"
            }
        ],
    },
    {
        comment: 'Entity "deleted",SEND EMAIL & NOTIFICATION to MEMBER_PM,MEMBER_OWNER',
        // type: 'project',
        method: "deleted",
        expressions: [
        ],
        actions: [
            {
                receiver: "MEMBER_PM",
                channel: "db,mail"
            },
            {
                receiver: "MEMBER_OWNER",
                channel: "db,mail"
            }
        ],
    },
    {
        comment: 'Entity "updated",SEND EMAIL & NOTIFICATION to MEMBER',
        // type: 'project',
        method: "updated",
        expressions: [
        ],
        actions: [
            {
                receiver: "MEMBER",
                channel: "db,mail"
            }
        ],
    },
    {
        comment: 'Entity status ,SEND EMAIL & NOTIFICATION to MEMBER_PM,MEMBER_OWNER',
        method: "status",
        expressions: [
        ],
        actions: [
            {
                receiver: "MEMBER_PM",
                channel: "db,mail"
            },
            {
                receiver: "MEMBER_PM",
                channel: "db,mail"
            },
        ],
    },
    {
        comment: 'Entity member append ,SEND EMAIL & NOTIFICATION to MEMBER',
        method: "member.append",
        expressions: [
        ],
        actions: [
            {
                receiver: "MEMBER",
                channel: "db,mail"
            }
        ],
    },
    {
        comment: 'Entity member remove ,SEND EMAIL & NOTIFICATION to MEMBER,MEMBER_REMOVE',
        method: "member.remove",
        expressions: [
        ],
        actions: [
            {
                receiver: "MEMBER",
                channel: "db,mail"
            },
            {
                receiver: "MEMBER_REMOVE",
                channel: "db,mail"
            },
        ],
    },
    {
        comment: 'Entity assignee append ,SEND EMAIL & NOTIFICATION to ASSIGNEES',
        method: "assignee.append",
        expressions: [
        ],
        actions: [
            {
                receiver: "entity.assignees",
                channel: "db,mail"
            }
        ],
    },
    {
        comment: 'Entity assignee remove ,SEND EMAIL & NOTIFICATION to ASSIGNEES',
        method: "assignee.remove",
        expressions: [
        ],
        actions: [
            {
                receiver: "entity.assignees",
                channel: "db,mail"
            },
            {
                receiver: "ASSIGNEE_REMOVE",
                channel: "db,mail"
            },
        ],
    },
    // {
    //     comment: 'SEND EMAIL & NOTIFICATION',
    //     type: 'goal',
    //     expressions: [
    //         // return true, if its current user is site admin  
    //         // {
    //         //     operator: 'EQ',
    //         //     params: [
    //         //         {
    //         //             operator: "VAR",
    //         //             params: ["user", "role"],
    //         //         },
    //         //         "admin",
    //         //     ]
    //         // }
    //     ],
    //     actions: [{
    //         receiver: "MEMBER_PM",
    //         channel: "db,mail"
    //     }],
    // },
    // {
    //     comment: 'SEND EMAIL & NOTIFICATION',
    //     type: 'requirement',
    //     expressions: [
    //         // return true, if its current user is site admin  
    //         // {
    //         //     operator: 'EQ',
    //         //     params: [
    //         //         {
    //         //             operator: "VAR",
    //         //             params: ["user", "role"],
    //         //         },
    //         //         "admin",
    //         //     ]
    //         // }
    //     ],
    //     actions: [{
    //         receiver: "MEMBER_PM",
    //         channel: "db,mail"
    //     }],
    // },
    // {
    //     comment: 'SEND EMAIL & NOTIFICATION',
    //     type: 'deliverable',
    //     expressions: [
    //         // return true ,if its parent(Requirement) status is “InProgress” 
    //         {
    //             operator: 'EQ',
    //             params: [
    //                 {
    //                     operator: "VAR",
    //                     params: ["entity", "parent", "status"],
    //                 },
    //                 10,//CONST_STATUS_IN_PROGRESS,
    //             ],
    //         },
    //         // return true, if its parent' parent (Goal) status is “InProgress” and deadline time < ‘NOW’  
    //         {
    //             operator: 'AND',
    //             params: [
    //                 {
    //                     operator: 'EQ',
    //                     params: [
    //                         {
    //                             operator: "VAR",
    //                             params: ["entity", "parent", "parent", "status"],
    //                         },
    //                         10,//CONST_STATUS_IN_PROGRESS,
    //                     ]
    //                 },
    //                 {
    //                     operator: 'GT',
    //                     params: [
    //                         {
    //                             operator: "VAR",
    //                             params: ["entity", "parent", "parent", "deadline"],
    //                         },
    //                         {
    //                             operator: "DATE",
    //                             params: [],
    //                         },
    //                     ]
    //                 },

    //             ],
    //         },
    //         //return true, if its parent' parent’ parent (Project) project members count >2 
    //         {
    //             operator: 'GT',
    //             params: [
    //                 {
    //                     operator: "VAR",
    //                     params: ["members", "length"],
    //                 },
    //                 2
    //             ],
    //         },
    //         //return true, if its  project members one of is  “PO”
    //         {
    //             operator: 'IN',
    //             params: [
    //                 "project_manager",
    //                 {
    //                     operator: "MAP",
    //                     params: [
    //                         {
    //                             operator: "VAR",
    //                             params: ["members"],
    //                         },
    //                         "projectRole"
    //                     ],
    //                 },

    //             ],
    //         },
    //         // return true if it’s child ‘Task’ is Exists
    //         {
    //             operator: 'GT',
    //             params: [
    //                 {
    //                     operator: "VAR",
    //                     params: ["entity", "children", "length"],
    //                 },
    //                 0
    //             ],
    //         },
    //         // current user is one of  Deliverable 's  assignee
    //         {
    //             operator: 'IN',
    //             params: [
    //                 {
    //                     operator: "VAR",
    //                     params: ["user", "id"],
    //                 },
    //                 {
    //                     operator: "VAR",
    //                     params: ["entity", "assignee"],
    //                 },
    //             ],
    //         },
    //     ],
    //     actions: [{
    //         receiver: "entity.assignee,parent.assignee,parent.parent.assignee,MEMBER_PM",
    //         channel: "db,mail"
    //     }],
    // },
    // {
    //     comment: 'SEND EMAIL & NOTIFICATION',
    //     type: 'task',
    //     expressions: [
    //         // return true, if its current user is site admin  
    //         // {
    //         //     operator: 'EQ',
    //         //     params: [
    //         //         {
    //         //             operator: "VAR",
    //         //             params: ["user", "role"],
    //         //         },
    //         //         "admin",
    //         //     ]
    //         // }
    //     ],
    //     actions: [{
    //         receiver: "MEMBER_PM",
    //         channel: "db,mail"
    //     }],
    // },
];
