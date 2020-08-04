import * as moment from 'moment';

import * as randToken from 'rand-token';
import { NotFoundError, NotAcceptableError, UnauthorizedError } from 'routing-controllers';

import * as mongoose from 'mongoose';

import { Service } from 'typedi';
import { IIdentityServiceToken, IIdentityService, IUserToken } from '../interface/login';

// let UserModel = mongoose.model< any & mongoose.Document> ('User') ;
// let LoginSessionModel = mongoose.model< any & mongoose.Document>('LoginSession') ;

@Service(IIdentityServiceToken)
export class IdentityService implements IIdentityService {
    UserModel = mongoose.model< any & mongoose.Document> ('User') ;
    LoginSessionModel = mongoose.model< any & mongoose.Document>('LoginSession') ;


    async userRefreshToken(dto: { refresh_token: string; }) {
        const session = await this.LoginSessionModel.findOne({ refreshToken: dto.refresh_token }).exec(); 
        if (session == null) {
            // const err = new UnauthorizedError('refresh_invalid');            
            
            throw new UnauthorizedError('refresh_invalid');
        }
        if (new Date() > session.refreshTime) {
            throw new UnauthorizedError('refresh_expired');
        }
        const user = await this.UserModel.findById(session.user).exec();
        if (session == null) {
            throw new UnauthorizedError('account_invalid');
        }
        // update session info
        session.accessTime = new Date();
        await session.save();
        return {id:user.id,role:user.role, name:user.name, email:user.email};
    }

    async userLogin(dto: { email: string; password: string; device: string; ip: string; }) {
        const user = await this.UserModel.findOne({ email: dto.email }).exec();
        if (user == null || user.password != dto.password) {
            throw new UnauthorizedError('account_invalid');
        }
        if (! user.isNormal()) {
            throw new UnauthorizedError('account_forbidden');
        }
        // save user session info
        const loginDto = { device: dto.device, user: user._id };
        let session = await this.LoginSessionModel.findOne(loginDto).exec();
        if (session == null) {
            session = new this.LoginSessionModel(loginDto);
        }
        session.accessTime = new Date();
        session.refreshTime = moment().add(7, 'day').toDate();
        session.refreshToken = randToken.uid(64);
        session.ip = dto.ip;
        await session.save();
        return { user:{id:user.id,role:user.role,name:user.name,email:user.email}, session };
    }
}