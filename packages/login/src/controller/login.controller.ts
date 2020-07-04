import { Request, Response, NextFunction } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam } from 'routing-controllers';

import { LoginDto, AdminLoginDto, RefreshTokenDto } from './dto/login.dto';
import * as moment from 'moment';
import * as requestIp from 'request-ip';
import { LoginService } from './login.service'


@JsonController()
export class LoginController {
    constructor(private service: LoginService) {
    }
    
    @Post('/login')
    async login(@Body() dto:AdminLoginDto, @Req() req: Request) {
        const ip = requestIp.getClientIp(req);
        console.log("/admin/login ip -- "+ip) ;
        return await this.service.loginAsAdmin({ip,...dto})    ;
    }

    @Post('/refresh_token')
    async refresh_token(@Body() dto:RefreshTokenDto) {
        return await this.service.refreshToken(dto) ;
    }

}
