/**
 * in project
 * ```
 * npm install ./packages/login
 * ```
 */

require('module-alias/register') ;

import {BackendServer } from '@app/loaders/server';
import { JsonController, Get } from 'routing-controllers';

const server = BackendServer.getInstance() ;

@JsonController('User')
class UserController{
    @Get()
    async get() {
        return {_id:1,name:"as"} ;
    }
}

server.registerController(UserController);

server.start() ;