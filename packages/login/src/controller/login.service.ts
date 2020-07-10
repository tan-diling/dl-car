import { sign } from 'jsonwebtoken';

import { IdentityService } from './identity.service';
import { Inject, Token, Service } from 'typedi';
import { IUserToken, IIdentityServiceToken, IIdentityService } from '../interface/login';

const jwtSecretOrKey = process.env.JWT_SECRET || "dealing";

const jwtOptions = {
    expiresIn: 60 * 60 * 2, // 2h=60*60s
};


export const createJwtToken = (user: IUserToken) => {
    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    };

    return sign(
        payload,
        jwtSecretOrKey,
        jwtOptions ,
    );

};

@Service()
export class LoginService {
    @Inject() 
    service: IdentityService ;
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
     * user refresh token 
     * @param dto 
     */
    async refreshToken(dto: { refresh_token: string }) {
        // check token is valid
        const user = await this.service.userRefreshToken(dto);

        // generate access token 
        const userInfo = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        const access_token = createJwtToken(userInfo);

        return { access_token };
    }

}


