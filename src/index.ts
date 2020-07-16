require('module-alias/register') ;

import {BackendServer } from '@packages/web';

import {controllers } from './controllers';

import subscriber from './subscriber';
import * as express from 'express' ;
import { PHOTO_BASE_PATH } from './controllers/photo/photo.controller';

const server = BackendServer.getInstance() ;

server.register("subscriber",async (server)=>{
    server.expressApp.use('/image',express.static(PHOTO_BASE_PATH)) ;
    await subscriber() ;
}) ;
server.registerController(...controllers) ;

server.start() ;