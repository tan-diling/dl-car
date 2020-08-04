import { Token } from 'typedi';

export interface IUserToken {
    id: string;
    email: string;
    name: string;
    role: string;
    // password?: string;
}

export interface IIdentityService {
    userLogin(dto: { email: string; password: string; device: string; ip: string; }): Promise<{ user: IUserToken, session: {refreshToken:string} }>;
    userRefreshToken(dto: { refresh_token: string; }): Promise<IUserToken>;
}

export const IIdentityServiceToken = new Token<IIdentityService>();