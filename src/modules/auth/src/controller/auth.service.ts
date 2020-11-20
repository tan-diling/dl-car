import * as randToken from 'rand-token';
import { sign } from 'jsonwebtoken';
import { JWT_OPTION } from '@app/config';
import { UnauthorizedError } from 'routing-controllers';
import { mongoose } from '@typegoose/typegoose';
import moment = require('moment');

// const jwtSecretOrKey = process.env.JWT_SECRET || "dealing";

const jwtOptions = JWT_OPTION;
interface IUserToken {
    id: string;
    email: string;
    name: string;
    role: string;
    // password?: string;
}
const createJwtToken = (user: IUserToken) => {
    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    };

    return sign(
        payload,
        jwtOptions.secretOrKey,
        { expiresIn: jwtOptions.expiresIn } ,
    );

};


class IdentityService {
    UserModel = mongoose.model<any & mongoose.Document>('User');
    LoginSessionModel = mongoose.model<any & mongoose.Document>('LoginSession');

    private async clearExpiredLoginSession() {
        await this.LoginSessionModel.deleteMany({ refreshTime: { $lt: new Date() } }).exec();
    }

    async userRefreshToken(dto: { user: string, refresh_token: string, skipRefresh?: boolean }) {
        if (!dto.refresh_token) {
            throw new UnauthorizedError('refresh_invalid');
        }
        const session = await this.LoginSessionModel.findOne({ refreshToken: dto.refresh_token }).exec();
        if (session == null) {
            throw new UnauthorizedError('refresh_invalid');
        }
        if (new Date() > session.refreshTime) {
            throw new UnauthorizedError('refresh_expired');
        }
        if (String(dto.user) > String(session.user)) {
            throw new UnauthorizedError('user_invalid');
        }
        const user = await this.UserModel.findById(session.user).exec();
        if (user == null) {
            throw new UnauthorizedError('user_invalid');
        }
        // update session info
        if (dto.skipRefresh != true) {
            session.refreshToken = randToken.uid(64);
            session.accessTime = new Date();
            await session.save();
        }
        return { id: user.id, role: user.role, name: user.name, email: user.email, refresh_token: session.refreshToken };
    }

    async userLogout(dto: { user: string; device: string; }) {

        if (dto.user == null) {
            throw new UnauthorizedError('user_invalid')
        }
        const session = await this.LoginSessionModel.findOne({ user: dto.user, device: dto.device }).exec();
        if (session != null) {
            await session.remove();
        }

        return { message: "user logout!" };
    }

    async userLogin(dto: { email: string; password: string; device: string; ip: string; }) {
        await this.clearExpiredLoginSession();
        const user = await this.UserModel.findOne({
            email: { $regex: new RegExp('^' + dto.email + '$', "i") },
            deleted: false,
        }).exec();
        if (user == null) {
            throw new UnauthorizedError('account_invalid');
        }
        if (user.password != dto.password) {
            throw new UnauthorizedError('password_invalid');
        }
        if (!user.isNormal()) {
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
        return { user: { id: user.id, role: user.role, name: user.name, email: user.email }, session };
    }
}

export class AuthService {

    service = new IdentityService();
    /**
     * user login
     * @param dto 
     */
    async login(dto: { email: string; password: string; device: string; ip: string; }) {

        // check user is valid
        var { user, session } = await this.service.userLogin(dto);

        // generate access token ,
        const userInfo = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        const access_token = createJwtToken(userInfo);

        return { ...userInfo, access_token, refresh_token: session.refreshToken };
    }

    /**
     * user logout
     * @param dto 
     */
    async logout(dto: { user: string; device: string; }) {

        return await this.service.userLogout(dto);
    }

    async token(dto: { user: string, refresh_token: string }) {
        // check token is valid
        const loginUser = await this.service.userRefreshToken(dto);

        // generate access token 
        const userInfo = {
            id: loginUser.id,
            name: loginUser.name,
            email: loginUser.email,
            role: loginUser.role,
        };

        const access_token = createJwtToken(userInfo);

        return { ...userInfo, access_token, refresh_token: loginUser.refresh_token };
    }

    /**
     * user refresh token 
     * @param dto 
     */
    async refreshToken(dto: { user: string, refresh_token: string, skipRefresh?: boolean }) {
        // check token is valid
        const loginUser = await this.service.userRefreshToken(dto);

        // generate access token 
        const userInfo = {
            id: loginUser.id,
            name: loginUser.name,
            email: loginUser.email,
            role: loginUser.role,
        };

        const access_token = createJwtToken(userInfo);

        return { ...userInfo, access_token, refresh_token: loginUser.refresh_token };
    }

}





