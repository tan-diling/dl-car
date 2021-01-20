import { Model, Document, Types } from 'mongoose';
import { RepoCRUDInterface, MemberStatus } from '@app/defines';
import { ResourceType, ProjectRole, RepoOperation } from '@app/defines';
import { ModelQueryService  } from '../../modules/query';
import { ReturnModelType, types } from '@typegoose/typegoose';
import { ForbiddenError, NotAcceptableError } from 'routing-controllers';
import { Attachment, AttachmentModel } from '@app/models';
import { ResourceService } from './resource.service';

export class AttachmentResourceService extends ResourceService<Attachment>{
    /**
     *
     */
    constructor() {
        super();
        this.model = AttachmentModel ;        
    }


}

