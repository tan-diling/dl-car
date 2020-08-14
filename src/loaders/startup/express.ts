/**
 * Express bootstrap config with routing-controllers
 * 
 * @packageDocumentation
 * @module startup
 */

import * as express from 'express';
import * as httpContext from 'express-http-context' ;
import * as bodyParser from 'body-parser';
import { useExpressServer, Action ,useContainer } from 'routing-controllers';
import { ErrorMiddleware } from './errorMiddleware';
import { BackendServer } from '../server';
import * as jwt from 'jsonwebtoken' ;
import {Container} from "typedi";
import { userCheck, initPassport } from './passport';

export default (server: BackendServer) => {
  /**
   * Health Check endpoints
   * @TODO Explain why they are here
   */

  useContainer(Container) ;

  const app = server.expressApp ;

  app.use(httpContext.middleware);

  app.get('/status', (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

//   // The magic package that prevents frontend developers going nuts
//   // Alternate description:
//   // Enable Cross Origin Resource Sharing to all origins by default
//   app.use(cors());

//   // Some sauce that always add since 2014
//   // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
//   // Maybe not needed anymore ?
//   app.use(require('method-override')());

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json({limit: '5mb',}))
  app.use(bodyParser.urlencoded({limit: '5mb', extended: true}))  

  initPassport(app) ;
  app.get("/", function (req: any, res: any) {
    res.send("hello express");
});


require('class-transformer')['classToPlain'] = function (obj: object)  {
    return obj == null ? "" : JSON.parse(JSON.stringify(obj))
};

useExpressServer(app, { // register created express server in routing-controllers
    routePrefix: '/api',
    classTransformer: true,
    validation: {
        whitelist: true,
        validationError: { target: false },
    },
    controllers: [  ...server.controllers ] , // and configure it the way you need (controllers, validation, etc.)
    middlewares: [ ErrorMiddleware ],    
    // controllers: [__dirname + "/../controller/*Controller.js"],
    // middlewares: [__dirname + "/../middleware/*Middleware.js"],
    defaultErrorHandler: false,
    authorizationChecker: userCheck ,
    //  (action: Action) => new Promise<boolean>((resolve, reject) => {
    //   passport.authenticate('jwt', (err, user) => {
    //     if (err) {
    //       return reject(err);
    //     }
    //     if (!user) {
    //       return resolve(false);
    //     }
    //     action.request.user = user;
    //     return resolve(true);
    //   })(action.request, action.response, action.next);
    // }),
    currentUserChecker: (action: Action) => action.request.user,

    // currentUserChecker: async (action: Action) => {
    //     return action.request.user;
    // },
    // authorizationChecker: async (action: Action, roles: string[]) => {
    //   const authorizationHeader:string = action.request.headers["authorization"] || "";
    //   const array = authorizationHeader.split(' ') ;
    //   if (array.length != 2 || array[0]!='Bearer' ) 
    //     return false ;
    //   const token = array[1] ;
    //   // const token = authorizationHeader.substr(4) ;

    //   action.request.user= jwt.decode(token);
    //   const user = action.request.user;
    //   if (user) {
    //     if(user.exp && user.exp < Date.now()){
    //       action.response.status(401).json({error:'TokenExpiredError'}).end();     
          
    //       return  ;        
    //     }

    //     if(roles.length == 0) return true ;

    //     const currentRole: string =  user?.permission || user?.role ;
    //     const userRoles:Array<string>  = [currentRole] ;
         
    //     if (userRoles && roles.find(x => userRoles.indexOf(x) !== -1))
    //         return true;

    //   }
            
    //   return false;
    // },

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


};
