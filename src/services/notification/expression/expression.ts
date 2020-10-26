import { ResourceType } from '@app/defines';
import { ResourceModel } from '@app/models';


type SimpleValueType = boolean | string | number | object;
type ArrayValueType = Array<SimpleValueType>;
type ValueType = SimpleValueType | ArrayValueType;

enum ExpressionOperator {
    STRING = "STRING",
    NUMBER = "NUMBER",
    DATE = "DATE",

    AND = "AND",
    OR = "OR",

    GT = "GT",
    LT = "LT",
    EQ = "EQ",
    GE = "GE",
    LE = "LE",
    NE = "NE",

    IN = "IN",
    MAP = "MAP",
    // FILTER = "FILTER",

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
    actions: Array<{ receiver: string, channel: string }>;
};

// const expressionExample: ExpressionRule = {
//     comment: 'SEND EMAIL & NOTIFICATION',
//     type: 'project.deliverable',
//     expressions: [
//         {
//             // return true if status == in process   
//             operator: 'EQ',
//             params: [
//                 {
//                     operator: "VAR",
//                     params: ["ENTITY", "status"],
//                 },
//                 'in-progress'
//             ],
//         },
//         {
//             //** return true if user is assignee of this.parent (requirement)  */
//             operator: 'IN',
//             params: [
//                 {
//                     operator: "VAR",
//                     params: ["USER", "id"],
//                 },
//                 {
//                     operator: "VAR",
//                     params: ["ENTITY", "PARENT", "assignees"],
//                 }
//             ],
//         },
//         {
//             // return true if user is  QA or Developer
//             operator: 'IN',
//             params: [
//                 {
//                     operator: "VAR",
//                     params: ["USER", "projectRole"],
//                 },
//                 ["QA", "Develop"]
//             ],
//         },
//     ],
//     actions: [],
// };


export const getEntityContext = async (req, entityId, method: 'created' | 'updated' | 'deleted') => {
    const entity = await ResourceModel.findById(entityId).exec();
    switch (entity.type) {
        case ResourceType.Project:
            entity.populate("children,comments,attachments");
            break;
        case ResourceType.Goal:
            entity.populate("children,parents,comments,attachments");
            break;
        case ResourceType.Requirement:
            entity.populate("children,parents,comments,attachments");
            break;
        case ResourceType.Deliverable:
            entity.populate("children,parents,comments,attachments,checklist");
            break;
        case ResourceType.Task:
            entity.populate("parents,comments,attachments");
            break;
    }

    await entity.execPopulate();
    const members = await entity.getMembers();

    const userId: string = req.user.id;
    const projectRole = members.find(x => String(x.userId) == userId)?.projectRole;
    const entityJSON = entity.toJSON();
    const list = [...entityJSON.parents, entityJSON];
    for (let i = 1; i < list.length; i++) {
        list[i].parent = list[i - 1];
    }

    return {
        req,
        user: { ...req.user, projectRole },
        timestamp: new Date(),
        entity: entityJSON,
        entityType: entity.type,
        method,
        members: members.map(x => x.toJSON()),
    }
}

export class EntityNotifyExecutor {
    constructor() { }

    async executeEval(ctx, rules: Array<ExpressionRule>) {
        for (const rule of rules) {
            if (rule.type.toLowerCase() != ctx.entityType.toLowerCase()) {
                continue;
            }

            if (rule.method) {
                if (rule.method != ctx.method) {
                    continue;
                }
            }

            await this.evalRule(ctx, rule);
        }

    }

    async evalRule(ctx, rule: ExpressionRule) {



        console.log("eval :" + rule.type)
        for (const exp of rule.expressions) {
            if (!this.eval(ctx, exp)) {
                return false;
            }
        };

        await this.execAction(ctx, rule);
        return true;
    }

    async execAction(ctx, rule: ExpressionRule) {
        console.log("exec action :" + rule.type)
        for (const action of rule.actions) {

            const { receiver, channel } = action;
            const userSet = new Set<string>();
            let rets = this.evalVariable(ctx, receiver.split('.'));
            if (!Array.isArray(rets)) { rets = [rets] }

            for (const item of rets) {
                if (typeof (item) == typeof ('')) {
                    userSet.add(item);
                }
            }

            const l = [...userSet];
            console.log(`send by ${action.channel} count:${l.length}`);
        }
    }

    eval(
        ctx,
        exp: Expression
    ) {
        const params = exp.params.map(x => {
            const p = x as Expression;
            if (p.operator && Array.isArray(p.params)) {
                return this.eval(ctx, p);
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
            case ExpressionOperator.MAP:
                return Array.isArray(params) ?
                    params[0].map(x => x[params[1]]) :
                    [];
            case ExpressionOperator.STRING:
                return String(params[0]);
            case ExpressionOperator.NUMBER:
                return Number(params[0]);

            case ExpressionOperator.DATE:

                return params[0] ?
                    new Date(params[0]).valueOf() :
                    new Date().valueOf();

            case ExpressionOperator.VAR:
                return this.evalVariable(ctx, params);
            default:
                return false;
        }
    }

    private
    evalVariable(ctx: any, params: string[]) {
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
