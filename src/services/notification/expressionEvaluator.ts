// export type ExpressionTree<T> = (
//     // ** form life cycle : initialization */
//     form: any
// ) => boolean;

export type ExpressionTree<T> = {
    left?: ExpressionTree<T>; //** required when eval is 'and'||'or'||'>' ||'<' */
    eval: ExpressionEvaluationOperation | string;
    right?: ExpressionTree<T>; //** required when eval is 'and'||'or'||'>' ||'<' */
  
    var?: T; //** required when eval is 'var'||'num'||'str' || array*/
  };
  
  export enum ExpressionEvaluationOperation {
    'AND' = 'and', //** return true if left side value && right side value */
    'OR' = 'or', //** return true if left side value || right side value */
    '>' = '>', //** return true if left side value > right side value */
    '<' = '<', //** return true if left side value < right side value */
    '==' = '==', //** return true if left side value == right side value */
    'INCLUDE' = 'include', //** return true if left is array [] and contain right side value */
  
    'VAR' = 'var', //** return value.var.context.field value */
    'NUM' = 'num', //** return value.string */
    'STR' = 'str', //** return value.number */
    'ARR' = 'array', //** return value.array */
  }
  
  export enum ExpressionType {
    'EVAL' = 'eva',
    'VAR' = 'var',
  }
  
  export type ExpressionVariable = {
    context?: ExpressionVariableContext | string; //** required when eval is 'var'
    field?: ExpressionFieldType | string; //** required when eval is 'var'
    number?: number; //** required when eval is 'num'*/
    string?: string; //** required when eval is 'str '*/
    array?: any[]; //** required when eval is 'array' */
  };
  export enum ExpressionVariableContext {
    'CURRENT_USER' = 'user',
    'THIS' = 'this',
    'ENTITY_PARENT' = 'this.parent',
    'ENTITY_PARENT_PARENT' = 'this.parent.parent',
    'ENTITY_PARENT_PARENT_PARENT' = 'this.parent.parent.parent',
    'ENTITY_ROOT' = 'this.root',
  }
  export enum ExpressionFieldType {
    // ** for field shared by project entities
    'ENTITY_DEADLINE' = 'entity.deadline',
    'ENTITY_ASSIGNEES' = 'entity.assignees',
    'ENTITY_STATUS' = 'entity.status',
  
    // ** for field specific for project entity
    'PROJECT_MEMBERS' = 'project.members',
  
    // ** for field specific for goal entity
  
    // ** for field specific for requirement entity
  
    // ** for field specific for deliverable entity
  
    // ** for field specific for task entity
  
    // ** for field specific for current user
  
    'USER_ID' = 'user.id',
    'USER_PROJECT_ROLE' = 'user.projectRole',
  }
  
  // export type ExpressionValue = {
  //     var?:{
  //         context: ExpressionVariableContext | string;
  //         field:ExpressionFieldType | string;
  //     }
  //     number?:number;
  //     string?:string;
  // }
  
  export type ExpressionRule = {
    description: string; // ** describe what this rule does in human language
    thisType: string; // ** used to assert what type this rule applies to
    expressions: ExpressionTree<ExpressionVariable>[];
    actions: any[];
  };
  
  const expressionExample: ExpressionRule = {
    description: 'SEND EMAIL & NOTIFICATION',
    thisType: 'project.deliverable',
    expressions: [
      {
        //** eval to true if this (deliverable).status is in-progress */
        left: {
          //** eval to this (deliverable).status
          eval: '',
          var: {
            context: 'this',
            field: 'entity.status',
          },
        },
        eval: '==',
        right: {
          //** eval to string 'in-progress
          eval: 'str',
          var: { string: 'in-progress' },
        },
      },
      {
        //** return true if user is assignee of this.parent (requirement) and user is  QA or Developer */
  
        left: {
          //** return true if user is assignee of this.parent*/
          left: {
            //** return this.parent (requirement) assignee id list */
            eval: 'var',
            var: {
              context: 'this.parent',
              field: 'entity.assignees',
            },
          },
          eval: 'include',
          right: {
            //** return current user id */
            eval: 'str',
            var: {
              context: 'user',
              field: 'user.id',
            },
          },
        },
        eval: 'and',
        right: {
          //** return true if  user project role is QA or Developer */
          left: {
            eval: 'array',
            var: { array: ['QA', 'Developer'] },
          },
          eval: 'include',
          right: {
            eval: 'var',
            var: {
              context: 'user',
              field: 'user.projectRole',
            },
          },
        },
      },
    ],
    actions: [],
  };
  
  export class ExpressionEvaluator {
    constructor() {}
    getCurrentEntity(req): any {}
    getCurrentUser(req): any {}
    evalRule(req, rule: ExpressionRule): boolean {
      rule.expressions.forEach((exp) => {
        if (!this.evalEXP(req, exp)) {
          return false;
        }
      });
      return true;
    }
  
    evalEXP(
      req,
      exp: ExpressionTree<ExpressionVariable>
    ): boolean | string | number | any[] {
      switch (exp.eval) {
        case ExpressionEvaluationOperation.AND:
          return this.evalEXP(req, exp.left) && this.evalEXP(req, exp.right);
        case ExpressionEvaluationOperation.STR:
          return this.resolveEXPVar(req, exp.eval, exp.var);
        default:
          return false;
      }
    }
  
    resolveEXPVar(
      req,
      operation: ExpressionEvaluationOperation,
      expVar: ExpressionVariable
    ): boolean | string | number | any[] {
      switch (operation) {
        case ExpressionEvaluationOperation.NUM:
          return expVar.number;
        case ExpressionEvaluationOperation.VAR:
          return this.queryEntity(req, expVar.context, expVar.field);
      }
    }
  
    queryEntity(
      req,
      varContext: any,
      varField: any
    ): boolean | string | number | any[] {
      const _currentEntity = this.getCurrentEntity(req);
      const _currentUser = this.getCurrentUser(req);
      return null;
    }
  }