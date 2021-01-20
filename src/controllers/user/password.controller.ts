import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect } from 'routing-controllers';

import * as moment from 'moment';
import { UserCreateDto, UserUpdateDto, EmailExistDto, VisitorUserCreateDto, ChangePasswordDto, PasswordForgetDto, PasswordResetDto, ValidationOTPDto } from './dto/user.dto';
import { UserService } from '../../services/user.service';

@JsonController('/user/password')
export class PasswordController {
    constructor(private userService: UserService) {
    }

    @Post('/forget')
    async forget(@Body() dto: PasswordForgetDto) {
        return await this.userService.forgetUserPasswordAndSendEmail(dto.email);

    }

    @Post('/validation')
    async validation(@Body() dto: ValidationOTPDto) {
        return await this.userService.checkValidateCodeOfForget(dto);

    }

    @Post('/reset')
    async reset(@Body() dto: PasswordResetDto) {
        return await this.userService.resetUserPasswordWithOTP(dto);
    }
}
