/**
 * in project
 * ```
 * npm install ./packages/login
 * ```
 */

require('module-alias/register') ;

import {BackendServer } from 'src/modules/web';
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