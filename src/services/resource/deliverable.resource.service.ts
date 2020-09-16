import { Model, Document, Types } from 'mongoose';
import { RepoCRUDInterface, MemberStatus } from '@app/defines';
import { ResourceType, ProjectRole, RepoOperation } from '@app/defines';
import { ModelQueryService  } from '../../modules/query';
import { ReturnModelType, types } from '@typegoose/typegoose';
import { ForbiddenError, NotAcceptableError } from 'routing-controllers';
import { Deliverable, DeliverableModel } from '@app/models';
import { ResourceService } from './resource.service';

export class DeliverableResourceService extends ResourceService<Deliverable>{
    /**
     *
     */
    constructor() {
        super();
        this.model = DeliverableModel ;        
    }


}
