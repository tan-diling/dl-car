import { ResourceType } from '@app/defines';
import { ResourceModel, Resource, ProjectModel, TaskModel, RequirementModel, GoalModel, DeliverableModel } from '@app/models';
import { entityContextMacro } from './entityContext';
import { IsMongoId } from 'class-validator';
import { Types, Model, Document } from 'mongoose';
import { DbService } from '@app/services/db.service';


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

const projectMemberObject = {
    "_id": "5f61601e0351f54d17574942",
    "status": "confirmed",
    "projectId": "5f61601e0351f54d17574941",
    "userId": "5f5897f916ac8902ed769e60",
    "projectRole": "project_manager",
    "createdAt": "2020-09-16T00:45:18.085Z",
    "updatedAt": "2020-09-16T00:45:18.088Z"
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


export const getEntityContext = async (req, entityType: string, entityId, method: 'created' | 'updated' | 'deleted', ) => {
    let entity = null;
    let populate = "";
    switch (entityType.toLowerCase()) {
        case ResourceType.Project:
            populate = "children,comments,attachments";
            entity = await DbService.get(ProjectModel, { _id: entityId, populate: populate });
            break;
        case ResourceType.Goal:
            populate = "children,parents,comments,attachments";

            entity = await DbService.get(GoalModel, { _id: entityId, populate: populate });
            break;
        case ResourceType.Requirement:
            populate = "children,parents,comments,attachments";

            entity = await DbService.get(RequirementModel, { _id: entityId, populate: populate });
            break;
        case ResourceType.Deliverable:
            populate = "children,parents,comments,attachments,checklist";

            entity = await DbService.get(DeliverableModel, { _id: entityId, populate: populate });
            break;
        case ResourceType.Task:
            populate = "parents,comments,attachments";
            entity = await DbService.get(TaskModel, { _id: entityId, populate: populate });
            break;
        default:
            entity = await DbService.get(ProjectModel, { _id: entityId, populate: populate });

    }


    const members = await entity.getMembers();

    const userId: string = req.user.id;
    const projectRole = members.find(x => String(x.userId) == userId)?.projectRole;
    const entityJSON = entity.toJSON();


    let currentEntity = entityJSON;
    while (currentEntity && (currentEntity.parents.length > 0)) {
        const parent = entityJSON.parents[currentEntity.parents.length - 1];
        if (parent == null) {
            break;
        }
        currentEntity.parent = parent;
        currentEntity = parent;

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
                if (IsMongoId(item)) {
                    const userId: string = typeof (item) == typeof ("") ? item : String(new Types.ObjectId(item));
                    userSet.add(userId);
                } else {
                    console.error("receiver error:" + receiver);
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
        const binaryOperate = (x, y, func: (x, y) => {}) => {
            if (typeof (x) == "number" && typeof (y) == "number") {
                return func(x, y);
            } else if (typeof (x) == "boolean" || typeof (y) == "boolean") {
                return func(x, y);
            } else if (typeof (x) == "string" || typeof (y) == "string") {
                return func(String(x), String(y));
            } else {
                return func(JSON.stringify(x), JSON.stringify(y));
            }
        }
        switch (exp.operator) {
            case ExpressionOperator.AND:
                return binaryOperate(params[0], params[1], (x, y) => x && y);
            case ExpressionOperator.OR:
                // return params[0] || params[1];
                return binaryOperate(params[0], params[1], (x, y) => x || y);
            case ExpressionOperator.EQ:
                // return params[0] == params[1];
                return binaryOperate(params[0], params[1], (x, y) => x == y);
            case ExpressionOperator.NE:
                // return params[0] != params[1];
                return binaryOperate(params[0], params[1], (x, y) => x != y);
            case ExpressionOperator.GT:
                // return params[0] > params[1];
                return binaryOperate(params[0], params[1], (x, y) => x > y);
            case ExpressionOperator.GE:
                // return params[0] >= params[1];
                return binaryOperate(params[0], params[1], (x, y) => x >= y);
            case ExpressionOperator.LT:
                // return params[0] < params[1];
                return binaryOperate(params[0], params[1], (x, y) => x < y);
            case ExpressionOperator.LE:
                // return params[0] <= params[1];
                return binaryOperate(params[0], params[1], (x, y) => x <= y);
            case ExpressionOperator.IN:
                if (Array.isArray(params[1])) {
                    return Array.from(params[1]).includes(x => binaryOperate(x, params[0], (x, y) => x == y));
                } else {
                    return false;
                }
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
            if (key in entityContextMacro) {
                obj = entityContextMacro[key](ctx);
            } else {
                obj = obj[key];
            }
            if (obj == null) {
                return null;
            }

        }
        return obj;

    }
}
