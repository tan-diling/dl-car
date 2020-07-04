require('module-alias/register') ;

import {BackendServer } from '@packages/web';

import {controllers } from './controllers';

const server = BackendServer.getInstance() ;


server.registerController(...controllers) ;

server.start() ;