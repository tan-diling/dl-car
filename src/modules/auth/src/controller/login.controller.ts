import { Request, Response, NextFunction } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam } from 'routing-controllers';

import { LoginDto, RefreshTokenDto, LogoutDto } from './dto/login.dto';
import * as moment from 'moment';
import * as requestIp from 'request-ip';
import { AuthService } from './auth.service'


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
        return await this.service.refreshToken({ user, refresh_token: dto.refresh_token });
    }

}
