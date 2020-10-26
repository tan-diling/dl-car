

type SimpleValueType = boolean | string | number | object;
type ArrayValueType = Array<SimpleValueType>;
type ValueType = SimpleValueType | ArrayValueType;

enum ExpressionOperator {
    STRING = "STRING",
    NUMBER = "NUMBER",

    AND = "AND",
    OR = "OR",

    GT = "GT",
    LT = "LT",
    EQ = "EQ",
    GE = "GE",
    LE = "LE",
    NE = "NE",

    IN = "IN",

    VAR = "VAR"
}

type OperationKey = keyof ExpressionOperator;

export type Expression = {
    operator: ExpressionOperator | string;
    params: Array<Expression | ValueType>;
};





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


export type ExpressionRule = {
    comment: string;
    type: string;
    method?: 'created' | 'updated' | 'deleted',
    expressions: Expression[];
    actions: any[];
};

const expressionExample: ExpressionRule = {
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

export class ExpressionEvaluator {
    constructor() { }
    getEntity(req): any { }
    getUser(req): any { }
    evalRule(req, rule: ExpressionRule): boolean {
        rule.expressions.forEach((exp) => {
            if (!this.eval(req, exp)) {
                return false;
            }
        });
        return true;
    }

    eval(
        req,
        exp: Expression
    ) {
        const params = exp.params.map(x => {
            const p = x as Expression;
            if (p.operator && Array.isArray(p.params)) {
                return this.eval(req, p);
            } else {
                return p;
            }
        });
        switch (exp.operator) {
            case ExpressionOperator.AND:
                return params[0] && params[1];
            case ExpressionOperator.OR:
                return params[0] || params[1];
            case ExpressionOperator.EQ:
                return params[0] == params[1];
            case ExpressionOperator.NE:
                return params[0] != params[1];
            case ExpressionOperator.GT:
                return params[0] > params[1];
            case ExpressionOperator.GE:
                return params[0] >= params[1];
            case ExpressionOperator.LT:
                return params[0] < params[1];
            case ExpressionOperator.LE:
                return params[0] <= params[1];
            case ExpressionOperator.IN:
                return params[0] <= params[1];

            case ExpressionOperator.STRING:
                return String(params[0]);
            case ExpressionOperator.NUMBER:
                return Number(params[0]);
            case ExpressionOperator.VAR:
                return this.evalVariable(req, this, params);
            default:
                return false;
        }
    }

    evalVariable(
        req,
        ctx: any,
        params: string[]
    ) {
        const _currentEntity = this.getEntity(req);
        const _currentUser = this.getUser(req);
        let obj = ctx;
        for (const key of params) {

            obj = obj[key];
            if (obj == null) {
                return null;
            }

        }
        return obj;

    }
}