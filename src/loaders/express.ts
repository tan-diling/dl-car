/**
 * Express bootstrap config with routing-controllers
 * 
 * @packageDocumentation
 * @module startup
 */

import * as express from 'express';
import * as httpContext from 'express-http-context';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as errorHandler from 'errorhandler';

// require('express-async-errors');
// import * as hijack from 'hijackresponse';

import passport = require('passport');
import { StrategyOptions, ExtractJwt, Strategy } from 'passport-jwt';

import { usePassport } from './passport';
import { errorMiddleware } from '@app/middlewares/error.middleware';

const cookieSession = require('cookie-session')

function useHttpContext(app: express.Application) {
  function httpContextMiddleware(req, res, next) {
    httpContext.ns.bindEmitter(req);
    // httpContext.ns.bindEmitter(res);
    httpContext.set("httpRequest", req);
    // httpContext.set("httpResponse",res) ;
    next();
  };


  app.use(httpContext.middleware);

  app.use(httpContextMiddleware);
};

export const express_startup = (app: express.Application) => {
  /**
   * Health Check endpoints
   * @TODO Explain why they are here
   */

  // const hijackResponse = require("hijackresponse");

  // app.use((req, res, next) => {
  //   hijackResponse(res, next)
  //     .then(({ readable, writable }) => {
  //       // Don't hijack HTML responses:
  //       const contentType = res.getHeader("Content-Type") as string;

  //       if (contentType && /json/.test(contentType)) {
  //         res.setHeader("X-Hijacked", "yes!");
  //         res.removeHeader("Content-Length");
  //         writable.write(JSON.stringify({ code: 201, message: "successfully", data: JSON.parse(String(readable.read())) }));

  //         return writable.end();
  //         // return readable.pipe(writable);
  //         // return writable;

  //       } else {
  //         readable.pipe(writable);
  //       }

  //       // res.setHeader("X-Hijacked", "yes!");
  //       // res.removeHeader("Content-Length");


  //     })
  //     .catch(err => console.log(err));

  // });

  // const app = server.expressApp;

  // app.use(httpContext.middleware);
  useHttpContext(app);

  app.use(logger('dev'));

  app.get('/status', (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');


  app.use(cookieSession({
    name: 'session',
    keys: ['sessionKey1', 'sessionKey2'],
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }));

  //   // The magic package that prevents frontend developers going nuts
  //   // Alternate description:
  //   // Enable Cross Origin Resource Sharing to all origins by default
  //   app.use(cors());

  //   // Some sauce that always add since 2014
  //   // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
  //   // Maybe not needed anymore ?
  //   app.use(require('method-override')());

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json({ limit: '5mb', }))
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

  usePassport(app);

  app.use(errorMiddleware);
  if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorHandler());
  } else {
    app.use((err, req, res, next) => {
      console.error(err);
      res.status(500).send('Server Error');
    });
  }

  app.get("/", function (req: any, res: any) {
    res.send("hello express");
  });

};
