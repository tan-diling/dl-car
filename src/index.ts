/**
 * program main entrance
 */
// require('module-alias/register');
require('dotenv').config() ;
import * as moduleAlias from 'module-alias';
// import * as path from 'path';
// const IS_DEV = process.env.NODE_ENV === 'development';
// const rootPath = path.resolve(__dirname);
// const rootPathDev = path.resolve(rootPath, 'src');
// const rootPathProd = path.resolve(rootPath, 'dist/src');
moduleAlias.addAliases({
  '@app':__dirname,
});

import { BackendServer } from '@app/loaders/server';

import { controllers } from '@app/routes';

import subscriber from '@app/subscriber';
import * as express from 'express';
import { PHOTO_BASE_PATH } from '@app/config';
import { initChatSocket } from './services/socketio';

function serverStartup ()  {

    /** define backend api server */
    const server = BackendServer.getInstance();

    server.register("socketio", async (server) => {
      /** register image static path */
      initChatSocket(server.httpServer) ;      
  　});

    server.register("subscriber", async (server) => {
        /** register image static path */
        server.expressApp.use('/image', express.static(PHOTO_BASE_PATH));

        /** add subscriber for mail service, etc... */
        await subscriber();
    });

    /** register api controller (router config) */
    server.registerController(...controllers);

    server.start();
}

serverStartup() ;