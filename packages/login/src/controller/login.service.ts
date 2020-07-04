import { sign } from 'jsonwebtoken';
import * as moment from 'moment';

import * as randToken from 'rand-token';
import { NotFoundError, NotAcceptableError } from 'routing-controllers';

import { LoginSessionModel, UserModel } from '@packages/mongoose';

import { config_get } from "@packages/core";

const jwtSecretOrKey = process.env.JWT_SECRET || "dealing";

const jwtOptions = {
    expiresIn: 60 * 60 * 2, // 1h=60*60s
};

interface IUserToken {
    id: string;
    email: string;
    name: string;
    role: string;
    // password?: string;
}

export const createJwtToken = (user: IUserToken) => {
    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    };

    const token = sign(
        payload,
        jwtSecretOrKey,
        jwtOptions ,
    );

    return {
        // access_type: 'jwt',
        access_token: token,
        // expires: new Date(new Date().valueOf() + jwtOptions.expiresIn * 1000),
        role: user.role,
    };
};

export class LoginService {

    async loginAsAdmin(dto: { email, password, device, ip }) {

        const account = await UserModel.findOne({ email: dto.email }).exec();
        if (account == null || account.password != dto.password) {
            throw new NotFoundError('email password not matched');
        }

        const loginDto = { device: dto.device, user: account._id };
        let login = await LoginSessionModel.findOne(loginDto).exec();
        if (login == null) {
            login = new LoginSessionModel(loginDto);
        }

        const refreshToken = randToken.uid(64);
        const user = {
            id: account.id,
            name: account.name,
            email: account.email,
            role: account.role,
        };

        const jwtToken = createJwtToken(user);
        //login.accessToken = jwtToken.access_token;
        login.accessTime = new Date();
        login.refreshTime = moment().add(7, 'day').toDate();
        login.refreshToken = refreshToken;
        login.ip = dto.ip;
        await login.save();
        return { ...jwtToken, id: account.id, name: account.name, refresh_token: refreshToken };
    }

    async refreshToken(dto: { refresh_token }) {
        const login = await LoginSessionModel.findOne({ refreshToken: dto.refresh_token }).exec();
        if (login == null) {
            throw new NotFoundError('refresh_token not match');
        }

        if (new Date() > login.refreshTime) {
            throw new NotAcceptableError('refresh_token expired');
        }

        const account = await UserModel.findById(login.user).exec();
        if (login == null) {
            throw new NotFoundError('account not exist');
        }

        const user = {
            id: account.id,
            name: account.name,
            email: account.email,
            role: account.role,
        };

        const jwtToken = createJwtToken(user);
        login.accessTime = new Date();

        // login.session = session;
        // login.refreshToken = refreshToken ;
        await login.save();
        return jwtToken;
    }

    // async initAccountData() {
    //     const defaultAdmin = config_get("login.default_admin");


    //     if (await UserModel.exists({ email: defaultAdmin.email })) {
    //         return;
    //     };

    //     const account = new UserModel(defaultAdmin);
    //     await account.save();

    //     console.log('create default admin');
    // }
}