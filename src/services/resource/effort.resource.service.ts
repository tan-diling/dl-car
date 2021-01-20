import { Model, Document, Types } from 'mongoose';
import { RepoCRUDInterface, MemberStatus } from '@app/defines';
import { ResourceType, ProjectRole, RepoOperation } from '@app/defines';
import { ModelQueryService  } from '../../modules/query';
import { ReturnModelType, types } from '@typegoose/typegoose';
import { ForbiddenError, NotAcceptableError } from 'routing-controllers';
import { EffortModel, Effort } from '@app/models';
import { ResourceService } from './resource.service';

export class EffortResourceService extends ResourceService<Effort>{
    /**
     *
     */
    constructor() {
        super();
        this.model = EffortModel ;        
    }


}

