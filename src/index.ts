require('module-alias/register') ;

import {BackendServer } from '@packages/web';

import {controllers } from './controllers';

import subscriber from './subscriber';

const server = BackendServer.getInstance() ;

server.register("subscriber",async ()=>{
    await subscriber() ;
}) ;
server.registerController(...controllers) ;

server.start() ;