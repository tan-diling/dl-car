import { Request, Response, NextFunction } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam } from 'routing-controllers';

import { LoginDto, RefreshTokenDto } from './dto/login.dto';
import * as moment from 'moment';
import * as requestIp from 'request-ip';
import { AuthService } from './auth.service'


@JsonController()
export class LoginController {
    constructor(private service: AuthService) {
    }
    
    @Post('/login')
    async login(@Body() dto:LoginDto, @Req() req: Request) {
        const ip = requestIp.getClientIp(req);
        console.log("/admin/login ip -- "+ip) ;
        return await this.service.login({ip,...dto})    ;
    }

    @Post('/refresh_token')
    async refresh_token(@Body() dto:RefreshTokenDto) {
        return await this.service.refreshToken(dto) ;
    }

}
