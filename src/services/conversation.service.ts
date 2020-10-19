import { DocumentType } from '@typegoose/typegoose';
import { ModelQueryService } from '@app/modules/query';
import { NotFoundError, NotAcceptableError, UnauthorizedError } from 'routing-controllers';
import * as randToken from 'rand-token';
import { UserModel, User } from '../models/user';
import { RepoOperation, SiteRole } from '@app/defines';
import { Types } from 'mongoose';
import { ConversationModel, MessageModel } from '@app/models';

/**
 * user service
 */
export class ConversationService {

    private queryService = new ModelQueryService();
    constructor() {
    }

    /**
     * get conversation list 
     * @param userId user id
     */
    async listByUser(userId:Types.ObjectId) {
        await ConversationModel.find({users:userId}).exec() ;
    }

    async listMessage(conversation:Types.ObjectId) {
        await MessageModel.find(conversation).exec() ;
    }

    /**
     * create an new group conversation
     * @param dto 
     */
    async create(title:string,users:Types.ObjectId[]) {

    }


}