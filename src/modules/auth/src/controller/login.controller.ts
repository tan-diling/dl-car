import { Request, Response, NextFunction } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam } from 'routing-controllers';

import * as moment from 'moment';
import * as requestIp from 'request-ip';
import { AuthService } from './auth.service'
import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsNotEmpty } from 'class-validator';


class LoginDto {
    @IsString()
    device: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

class LogoutDto {
    @IsString()
    device: string;
}

class RefreshTokenDto {
    @IsString()
    // @IsNotEmpty()
    refresh_token: string;

}



@JsonController()
export class LoginController {
    constructor(private service: AuthService) {
    }

    @Post('/login')
    async login(@Body() dto: LoginDto, @Req() req: Request) {
        const ip = requestIp.getClientIp(req);
        console.log("login ip -- " + ip);
        const ret = await this.service.login({ ip, ...dto });
        req.session.userId = ret.id;
        req.session.token = ret.refresh_token;
        return ret;

    }

    @Post('/token')
    async token(@Req() req: Request) {
        const user = req.session?.userId;
        const refresh_token = req.session?.token;
        const ret = await this.service.refreshToken({ user, refresh_token, skipRefresh: true });
        return ret;
    }

    @Post('/logout')
    async logout(@Body() dto: LogoutDto, @Req() req: Request) {
        //     const ip = requestIp.getClientIp(req);
        //     console.log("logout ip -- " + ip);
        const user = req.session?.userId;
        req.session = null;
        const ret = await this.service.logout({ user, device: dto.device });
        return ret;
    }

    @Post('/refresh_token')
    async refresh_token(@Body() dto: RefreshTokenDto, @Req() req: Request) {
        const user = req.session?.userId;
        const refresh_token = dto.refresh_token || req.session?.token;
        const ret = await this.service.refreshToken({ user, refresh_token });
        req.session.token = ret.refresh_token;
        return ret;

    }

}
