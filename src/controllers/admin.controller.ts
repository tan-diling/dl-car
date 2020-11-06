import { UserService, GroupService } from '@app/services';
import { Container } from 'typedi';
import { Authorized, JsonController, Post, Get, Delete, QueryParams, Req, CurrentUser, Param, Body, Patch } from 'routing-controllers';
import { UserCreateDto, UserUpdateDto } from './user/dto/user.dto';
import { SiteRole } from '@app/defines';

const userService = Container.get(UserService);
const groupService = Container.get(GroupService);
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
}