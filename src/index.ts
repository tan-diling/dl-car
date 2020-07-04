require('module-alias/register') ;

import {BackendServer } from '@packages/web';

const server = BackendServer.getInstance() ;


// server.registerController(TestController)

server.start() ;