/**
 * program main entrance
 */
require('module-alias/register') ;

import {BackendServer } from '@packages/web';

import {controllers } from './controllers';

import subscriber from './subscriber';
import * as express from 'express' ;
import { PHOTO_BASE_PATH } from './controllers/photo/photo.controller';

/** define backend api server */
const server = BackendServer.getInstance() ;

server.register("subscriber",async (server)=>{
    /** register image static path */
    server.expressApp.use('/image',express.static(PHOTO_BASE_PATH)) ;

    /** add subscriber for mail service, etc... */
    await subscriber() ;
}) ;

/** register api controller (router config) */
server.registerController(...controllers) ;

server.start() ;