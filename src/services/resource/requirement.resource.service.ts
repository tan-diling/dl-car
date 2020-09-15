import { Model, Document, Types } from 'mongoose';
import { RepoCRUDInterface, MemberStatus } from '@app/defines';
import { ResourceType, ProjectRole, RepoOperation } from '@app/defines';
import { ModelQueryService  } from '../../modules/query';
import { ReturnModelType, types } from '@typegoose/typegoose';
import { ForbiddenError, NotAcceptableError } from 'routing-controllers';
import { UserModel, Goal, GoalModel, Requirement, RequirementModel } from '@app/models';
import { ResourceService } from './resource.service';

export class RequirementResourceService extends ResourceService<Requirement>{
    /**
     *
     */
    constructor() {
        super();
        this.model = RequirementModel ;        
    }


}

