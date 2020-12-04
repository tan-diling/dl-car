import { Model, Document, Types } from 'mongoose';
import { RepoCRUDInterface, MemberStatus } from '@app/defines';
import { ResourceType, ProjectRole, RepoOperation } from '@app/defines';
import { ModelQueryService } from '../../modules/query';
import { ReturnModelType, types } from '@typegoose/typegoose';
import { ForbiddenError, NotAcceptableError } from 'routing-controllers';
import { UserModel, Goal, GoalModel, Requirement, RequirementModel, CheckList } from '@app/models';
import { ResourceService } from './resource.service';

export class RequirementResourceService extends ResourceService<Requirement>{
    /**
     *
     */
    constructor() {
        super();
        this.model = RequirementModel;
    }

    async get(filter) {
        const doc = await super.get(filter);

        if (doc != null) {
            return { ...doc.toJSON(), completion: await CheckList.getCompletion(doc._id) };
        }

        return doc;
    }


}

