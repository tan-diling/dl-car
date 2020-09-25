import { DocumentType } from '@typegoose/typegoose' ;
import { ModelQueryService  } from '@app/modules/query';
import { NotFoundError, NotAcceptableError, UnauthorizedError } from 'routing-controllers';
import * as randToken from 'rand-token';
import { UserModel, User } from '../models/user';
import { RepoOperation, SiteRole } from '@app/defines';
import { Invitation } from '@app/models';

/**
 * Invitation service
 */
export class InvitationService {

    /**
     * create an new user
     * @param dto 
     */
    async create(dto: Partial<Invitation>) {

        let user = await UserModel.findOne({ email: dto.email }).exec();
        if (user != null ) {
            throw new NotAcceptableError('account_exists');
        }

        user = new UserModel(dto) ;
        user.emailValidated = false ;
        if(! user.password) user.password = randToken.uid(8) ;

        await user.save() ;
        UserModel.emit(RepoOperation.Created, user) ;
        return user;
    }


 
}