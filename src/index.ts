/**
 * program main entrance
 */
// require('module-alias/register');
require('dotenv').config();
import * as moduleAlias from 'module-alias';
// import * as path from 'path';
// const IS_DEV = process.env.NODE_ENV === 'development';
// const rootPath = path.resolve(__dirname);
// const rootPathDev = path.resolve(rootPath, 'src');
// const rootPathProd = path.resolve(rootPath, 'dist/src');
moduleAlias.addAliases({
  '@app': __dirname,
});

import { App } from './app';

import { controllers, routers } from '@app/routes';

// import subscriber from '@app/subscriber';
import * as express from 'express';
import { PHOTO_BASE_PATH } from '@app/config';

function serverStartup() {

  /** define backend api server */
  const server = App.getInstance();


  // server.register("subscriber", async (server) => {
  //   /** register image static path */
  //   server.expressApp.use('/image', express.static(PHOTO_BASE_PATH));

  //   /** add subscriber for mail service, etc... */
  //   await subscriber();
  // });

  /** register api controller (router config) */
  server.registerRouter(...routers);

  server.start();
}

serverStartup();