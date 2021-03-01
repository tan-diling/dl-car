import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect, UseInterceptor } from 'routing-controllers';

import * as moment from 'moment';
import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsEnum, MaxLength, IsBoolean, IsPhoneNumber } from 'class-validator';
import { UserService } from '../../services/user.service';
import { SiteRole, NotificationTopic, NotificationAction } from '@app/defines';
import { SettingService } from '@app/services';
import { Container } from 'typedi';

/** user name rule: <first> [middle] <last> */
// const RULE_USER_NAME_REGEX = /^[a-zA-Z0-9]+\s{1}([a-zA-Z0-9\.]{1,}\s{1}){0,1}[a-zA-Z0-9]{1,}$/;

/** phone rule  */
const RULE_PHONE_REGEX = /^1\d{10}$/;

/** password rule , min length 8 ,valid chars [a-zA-Z0-9:;!@#$%^&*()-=+_~.]  */
const RULE_PASSWORD_REGEX = /^([a-zA-Z0-9:;!@#$%^&*()-=+_~.]{8,64})$/;

/** phone rule  */
const RULE_PIN_REGEX = /\d{6}$/;

class UserProfileDto {
    @IsString()    
    @MaxLength(24)
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    image?: string;

    @IsString()
    @IsOptional()
    region?: string;
    
    @IsString()
    @IsOptional()
    sex?: string;

    @IsString()
    @IsOptional()
    ageGroup?: string;
}

class UserRegisterDto extends UserProfileDto {

    @IsString()
    @Matches(RULE_PHONE_REGEX)
    phone: string;

    @IsString()
    @Matches(RULE_PASSWORD_REGEX)
    password: string;  

    @IsString()
    @Matches(RULE_PIN_REGEX)
    code: string;  
}

@JsonController()
export class UserController {
    private service = Container.get( UserService ) ;

    @Authorized()
    @Get('/profile')
    async getProfile(@Req() request) {
        return await this.service.getById(request.user.id);
    }

    @Authorized()
    @Patch('/profile')
    async setProfile(@Req() request, @Body() dto: UserProfileDto) {

        await this.service.update(request.user.id, {profile:dto});
        return await this.getProfile(request);
    }

    @Post('/register')
    async register(@Req() request, @Body() dto: UserRegisterDto) {

        const {phone,password,code,...profile} = dto ;
        const valid = await this.service.checkValidateCode({phone, code});
        return await this.service.create({phone,password,profile});
    }


}


