import {BackendServer } from '@app/modules/web';

import {controllers } from '@app/routes';

import subscriber from '@app/subscriber';
import * as express from 'express' ;
import { PHOTO_BASE_PATH } from '@app/config';

export default  ()=>{

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
}