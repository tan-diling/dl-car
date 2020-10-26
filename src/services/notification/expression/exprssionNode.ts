// import { stringify } from "querystring";

// enum EType {
//     STRING,
//     NUMBER,
//     BOOLEAN,
//     DATE,

//     EQ,
//     NE,
//     GT,
//     GE,
//     LT,
//     LE,

//     IN,

//     PLUS,
//     SUB,

//     AND,
//     OR,

//     OBJ,

// }

// interface INode {
//     readonly type: EType;

//     list: Array<INode | string | number | boolean | []>;
// }

// abstract class TNode implements INode {
//     type: EType;

//     list: Array<TNode | string | number | boolean | []>;

//     ctor(type, l) {
//         this.type = type;
//         this.list = l;
//     }

//     abstract getValue(ctx): Promise<string | number | boolean>;

//     static
//         async eval(expr: TNode | string | number | boolean | [], ctx) {
//         if (expr instanceof TNode) {
//             return expr.getValue(ctx);
//         } else {
//             return eval;
//         }
//     }
// }


// class ConstNode extends TNode {
//     async getValue(ctx) {
//         const x = await TNode.eval(this.list[0], ctx);

//         switch (this.type) {
//             case EType.NUMBER:
//                 return Number(x);
//                 break;
//             case EType.STRING:
//                 return String(x);
//                 break;
//             case EType.BOOLEAN:
//                 return Boolean(x);
//             case EType.DATE:
//                 return new Date(x).valueOf();
//         }

//     }
// }

// class OperatorNode extends TNode {
//     async getValue(ctx) {
//         const x = await TNode.eval(this.list[0], ctx);
//         const y = await TNode.eval(this.list[2], ctx);
//         switch (this.type) {
//             case EType.EQ:
//                 return x == y;
//             case EType.NE:
//                 return x != y;
//             case EType.GT:
//                 return x > y;
//             case EType.GE:
//                 return x >= y;
//             case EType.LT:
//                 return x < y;
//             case EType.NE:
//                 return x <= y;

//             case EType.AND:
//                 return x && y;
//             case EType.OR:
//                 return x || y;
//             // case EType.NOT :
//             //     return ! x ;
//         }

//     }
// }

// class ContextTNode extends TNode {
//     async getValue(ctx) {
//         const x = await TNode.eval(this.list[0], ctx);
//         const y = await TNode.eval(this.list[2], ctx);
//         const currentObject = ctx[x];
//         return currentObject[y];
//     }
// }

// class ExpressionNode extends ConstNode {
//     type = EType.AND;
// }

// entity(req){
//     this.USER = req.user;
//     this.ENTITY = 
// }