import { UserService, GroupService, SettingService } from '@app/services';
import { Container } from 'typedi';
import { Authorized, JsonController, Post, Get, Delete, QueryParams, Req, CurrentUser, Param, Body, Patch, Put } from 'routing-controllers';
import { UserCreateDto, UserUpdateDto } from './user/dto/user.dto';
import { SiteRole } from '@app/defines';
import { IsBoolean, IsPort, IsString, IsNumber, IsInt, Max, IsPositive, IsEmail } from 'class-validator';
import { sendMail } from '@app/modules/mail';

const userService = Container.get(UserService);
const groupService = Container.get(GroupService);
const settingService = Container.get(SettingService);

class SettingAllowPublicationRegistrationDto {
    @IsBoolean()
    enabled: boolean;
}

class SettingMailDto {
    @IsString()
    host: string;

    @IsPositive()
    @Max(65536)
    port: number;

    @IsString()
    user: string;

    @IsString()
    password: string;
}

class SendMailDto {
    @IsEmail()
    email: string;

    @IsString()
    subject: string;

    @IsString()
    html: string;
}

@Authorized(SiteRole.Admin)
@JsonController('/admin')
export class AdminController {

    @Post('/user')
    async create(@Body() dto: UserCreateDto) {
        return await userService.create(dto);
    }


    @Get('/user')
    async list(@QueryParams() query: any) {
        return await userService.list(query);
    }

    @Delete('/user/:id([0-9a-f]{24})')
    async delete(@Param('id') id: string, ) {
        return await userService.delete(id);

    }

    @Patch('/user/:id([0-9a-f]{24})')
    async update(@Param('id') id: string, @Body() dto: UserUpdateDto, @Req() request, ) {
        return await userService.update(id, dto);

    }

    @Get('/group')
    async listGroup(@QueryParams() query: any) {
        return await groupService.list(query);
    }

    // @Get('/setting')
    // async listSetting(@QueryParams() query: any) {
    //     return await groupService.list(query);
    // }



    @Get('/setting/allowPublicRegistration')
    async getAllowPublicRegistration() {
        return {
            enabled: await settingService.allowPublicRegistration()
        };
    }

    @Put('/setting/allowPublicRegistration')
    async setAllowPublicRegistration(@Body() dto: SettingAllowPublicationRegistrationDto) {
        return {
            enabled: await settingService.allowPublicRegistration(dto.enabled)
        };
    }

    @Get('/setting/mail')
    async getMail() {
        return await settingService.mail();
    }

    @Put('/setting/mail')
    async setMail(@Body() dto: SettingMailDto) {
        return await settingService.mail(dto);
    }


    @Post('/setting/mail')
    async sendMail(@Body() dto: SendMailDto) {
        return sendMail(dto);
    }
}