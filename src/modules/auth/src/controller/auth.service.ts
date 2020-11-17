import { sign } from 'jsonwebtoken';

import { IdentityService } from './identity.service';
import { Inject, Token, Service } from 'typedi';
import { IUserToken, IIdentityServiceToken, IIdentityService } from '../interface/login';
import { JWT_OPTION } from '@app/config';
import { UnauthorizedError } from 'routing-controllers';

// const jwtSecretOrKey = process.env.JWT_SECRET || "dealing";

const jwtOptions = JWT_OPTION;

export const createJwtToken = (user: IUserToken) => {
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

@Service()
export class AuthService {
    @Inject()
    service: IdentityService;
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

    /**
     * user refresh token 
     * @param dto 
     */
    async refreshToken(dto: { user: string, refresh_token: string }) {
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


