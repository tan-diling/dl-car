import * as moment from 'moment';

import * as randToken from 'rand-token';
import { NotFoundError, NotAcceptableError, UnauthorizedError } from 'routing-controllers';

import { LoginSessionModel, UserModel } from '@packages/mongoose';

import { config_get } from "@packages/core";
import { Service } from 'typedi';
import { IIdentityServiceToken, IIdentityService } from '../interface/login';

@Service(IIdentityServiceToken)
export class IdentityService implements IIdentityService {
    async userRefreshToken(dto: { refresh_token: string; }) {
        const session = await LoginSessionModel.findOne({ refreshToken: dto.refresh_token }).exec();
        if (session == null) {
            throw new UnauthorizedError('refresh token not valid');
        }
        if (new Date() > session.refreshTime) {
            throw new UnauthorizedError('refresh token expired');
        }
        const user = await UserModel.findById(session.user).exec();
        if (session == null) {
            throw new UnauthorizedError('account not valid');
        }
        // update session info
        session.accessTime = new Date();
        await session.save();
        return {id:user.id,role:user.role,name:user.name,email:user.email};
    }

    async userLogin(dto: { email: string; password: string; device: string; ip: string; }) {
        const user = await UserModel.findOne({ email: dto.email }).exec();
        if (user == null || user.password != dto.password) {
            throw new UnauthorizedError('email or password not valid');
        }
        if (! user.isNormal()) {
            throw new UnauthorizedError('this account is not allowed to login.');
        }
        // save user session info
        const loginDto = { device: dto.device, user: user._id };
        let session = await LoginSessionModel.findOne(loginDto).exec();
        if (session == null) {
            session = new LoginSessionModel(loginDto);
        }
        session.accessTime = new Date();
        session.refreshTime = moment().add(7, 'day').toDate();
        session.refreshToken = randToken.uid(64);
        session.ip = dto.ip;
        await session.save();
        return { user:{id:user.id,role:user.role,name:user.name,email:user.email}, session };
    }
}