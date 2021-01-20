import { Request, Response, NextFunction, query } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Param, Patch, Delete, Authorized, CurrentUser, MethodNotAllowedError, InternalServerError, Redirect, UseInterceptor } from 'routing-controllers';

import * as moment from 'moment';
import { UserCreateDto, UserUpdateDto, EmailExistDto, VisitorUserCreateDto, ChangePasswordDto } from './dto/user.dto';
import { UserService } from '../../services/user.service';
import { SiteRole, NotificationTopic, NotificationAction } from '@app/defines';
import { ContactService } from '@app/services/contact.service';
import { notificationInterceptor } from '@app/middlewares/notification.interceptor';
import { SettingService } from '@app/services';
import { Container } from 'typedi';

enum Operation {
    CREATE,
    RETRIEVE,
    UPDATE,
    DELETE,
}

interface IUser { role: string, id: string };

interface RequestContext {
    request: Request,
    method: Operation,
    user?: IUser;
    filter?: { id: string } | any;
    dto?: any;
}

@JsonController()
export class UserController {
    constructor(private service: UserService, private contactService: ContactService) {
    }



    @Post('/sign_up')
    async signUp(@Body() dto: VisitorUserCreateDto) {
        const user = await this.service.signUp({ ...dto, role: SiteRole.Client });
        if (user) {
            return { result: `${user.email} signed up successfully` };
        }
    }

    // @Authorized(SiteRole.Admin)
    // @Post('/user')
    // async create(@Body() dto: UserCreateDto) {
    //     return await this.service.create(dto);
    // }


    @Get('/user/email_validate')
    @Redirect('/login')
    async emailValidate(@QueryParam('id') id: string, @QueryParam('email') email: string) {
        await this.service.validateEmail({ id, email });

        await this.contactService.addDefaultContact(id);
    }

    @Post('/user/email_exists')
    async emailExists(@Body() dto: EmailExistDto) {
        const users = await this.service.getByEmail(dto.email);
        if (users)
            return { register: true };

        return { register: false };
    }

    @Post('/change_password')
    async changePassword(@Body() dto: ChangePasswordDto) {
        return await this.service.changePassword(dto);
    }

    @Authorized()
    @Get('/user/default')
    async listDefault(@QueryParams() query: any, @Req() request, @CurrentUser() currentUser: IUser) {
        return await this.service.list({
            ...query,
            defaultContact: "true",
            deleted: "false",
        });

        // return await this.service.list(query) ;
    }

    @Authorized()
    @Get('/user/profile')
    async getProfile(@Req() request) {
        return await this.service.getById(request.user.id);

    }

    @Authorized()
    @Patch('/user/profile')
    @UseInterceptor(notificationInterceptor(NotificationTopic.User, NotificationAction.Updated))
    async setProfile(@Req() request, @Body() dto: UserUpdateDto) {

        await this.service.update(request.user.id, dto);
        return await this.getProfile(request);
    }


    @Get('/setting/allowPublicRegistration')
    async getAllowPublicRegistration() {
        const settingService = Container.get(SettingService);
        return {
            enabled: await settingService.allowPublicRegistration()
        };
    }

}


