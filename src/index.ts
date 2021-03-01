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
import { ExpressErrorMiddlewareInterface, Middleware, useExpressServer } from 'routing-controllers';
import { errorMiddleware } from './middlewares/error.middleware';


@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: (err: any) => any) {
        errorMiddleware(error, request, response, next);    
    }
}

function serverStartup() {

  /** define backend api server */
  const server = App.getInstance();


  server.register("routing-controllers", async (serverApp) => {
    // /** register image static path */
    // server.expressApp.use('/image', express.static(PHOTO_BASE_PATH));

    // /** add subscriber for mail service, etc... */
    // await subscriber();
    require('class-transformer')['classToPlain'] = function (obj: object) {
      return obj == null ? "" : JSON.parse(JSON.stringify(obj))
    };
  
    useExpressServer(server.expressApp, { // register created express server in routing-controllers
      routePrefix: server.prefix,
      classTransformer: true,
      validation: {
        whitelist: true,
        validationError: { target: false },
      },
      controllers: [...controllers], // and configure it the way you need (controllers, validation, etc.)
      middlewares: [ErrorMiddleware],
      // controllers: [__dirname + "/../controller/*Controller.js"],
      // middlewares: [__dirname + "/../middleware/*Middleware.js"],
      defaultErrorHandler: false,
     
      currentUserChecker: (action) => action.request.user,
  
      
      defaults: {
        //with this option, null will return 404 by default
        nullResultCode: 404,
  
        //with this option, void or Promise<void> will return 204 by default 
        undefinedResultCode: 204,
  
        paramOptions: {
          //with this option, argument will be required by default
          required: true
        }
      }
  
  
  
    });
  
  });

  
  /** register api controller (router config) */
  server.registerRouter(...routers);

  server.start();
}

serverStartup();