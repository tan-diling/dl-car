// import {ExpressMiddlewareInterface, UseBefore, Middleware} from 'routing-controllers';
// import * as passport from 'passport';
// import { StrategyOptions, ExtractJwt, Strategy } from 'passport-jwt';
// import { logger, JWT_OPTION } from '@packages/core';

// const jwtOption = JWT_OPTION ;

// const strategyOptions: StrategyOptions = {
//     secretOrKey: jwtOption.secretOrKey ,
//     jwtFromRequest:  ExtractJwt.fromAuthHeaderWithScheme('bearer'),
//     // issuer:"dealing.tech",
//     // audience?: string;
//     algorithms: [jwtOption.algorithm ],
//     // ignoreExpiration?: boolean;
//     passReqToCallback: true ,
//     // jsonWebTokenOptions:{issuer:"dealing.tech",}
// } ;

// const getStrategy = (): passport.Strategy => {
//     // const params =  {
//     //     secretOrKey: process.env.JWT_SECRET || "JWT_SECRET",
//     //     jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
//     //     passReqToCallback: true,

//     // };

//     return new Strategy(strategyOptions, (req, payload: any, done) => {
//         // tslint:disable-next-line: no-console
//         console.log('jwt Strategy [payload]:' + payload) ;
//         req.user = payload ;
//         done(null, payload) ;
       
//     });
// };

// const initPassport = ()=>{
// passport.use('jwt', getStrategy());
// passport.initialize();
// }

// initPassport() ;


// export const jwtAuthMiddleware = (req, res, next) => {

//     const authenticate = (callback) =>
//         passport.authenticate('jwt', { session: false, failWithError: true }, callback);

//     return authenticate((err, user, info) => {
//         if (err) { return next(err); }
//         logger.info('auth user ' + JSON.stringify(user));
//         if (!user) {
//             // let message ="" ;
//             if (info.name === 'TokenExpiredError') {
//                 // message =  "Your accessToken was expired." ;  
//                 res.status(401).json({error:'TokenExpiredError'});              
//                 // CatchHandler(new HttpError(ErrorCode.AuthTokenExpired, {message: info.message}), req, res);
//             } else {
//                 res.status(401).json({error:info.message });
//                 // message = info.message ;

//                 // CatchHandler(new HttpError(ErrorCode.AuthTokenError, {message: info.message}), req, res);
//             }           
//         } else {
//             // app.set("user", user);
//             return next();
//         }
//     })(req, res, next);
// };

// @Middleware({ type: "before" })
// export class JwtMiddleware implements ExpressMiddlewareInterface { // interface implementation is optional

//     use(request: any, response: any, next?: (err?: any) => any): any {
//         jwtAuthMiddleware(request, response, next) ;
//         // next();
//     }
// }

// // export const JwtAuthorized
// export function JwtAuthorized() {
//     return UseBefore(JwtMiddleware) ;
// }
