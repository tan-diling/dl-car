import { ExpressMiddlewareInterface, UseBefore, Middleware, UnauthorizedError } from 'routing-controllers';
import  passport = require( 'passport');
import { StrategyOptions, ExtractJwt, Strategy } from 'passport-jwt';
import { logger, JWT_OPTION } from '@app/config';

const jwtOption = JWT_OPTION;

const strategyOptions: StrategyOptions = {
    secretOrKey: jwtOption.secretOrKey,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('bearer'),
    // issuer:"diling.tech",
    // audience?: string;
    algorithms: [jwtOption.algorithm],
    // ignoreExpiration?: boolean;
    passReqToCallback: true,
    // jsonWebTokenOptions:{issuer:"diling.tech",}
};

const getStrategy = (): passport.Strategy => {
    // const params =  {
    //     secretOrKey: process.env.JWT_SECRET || "JWT_SECRET",
    //     jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    //     passReqToCallback: true,

    // };

    return new Strategy(strategyOptions, (req, payload: any, done) => {
        // tslint:disable-next-line: no-console
        console.log(`jwt Strategy [${payload?.name},${payload?.role}]`);
        req.user = payload;
        done(null, payload);

    });
};

export const initPassport = (app) => {
    passport.use('jwt', getStrategy());
    app.use(passport.initialize());
}




export const userCheck = (action: { request, response, next }, roles: string[]) => new Promise<boolean>(
    (resolve, reject) => {
        passport.authenticate('jwt',{ session: false, failWithError: true }, (err, user ,info) => {
            if (err) {     
                         
                return reject(err);
            }

            if(roles.length==1 && roles[0] === "NONE") {
                return resolve(true) ;
            } 

            if (!user) {
                const jwtError = new UnauthorizedError(info?.message || "jwt error") ;
                jwtError.name = "jwt_error" ;                
                reject(jwtError ) ;
                // action.response.status(401).json(info);
                

                return resolve(false);
            }
            // action.request.user = user;
            if (roles.length == 0) return resolve(true);

            const currentRole: string = user?.permission || user?.role;
            const userRoles: Array<string> = [currentRole];

            if (userRoles && roles.find(x => userRoles.indexOf(x) !== -1))
                return resolve(true);

            return resolve(false);
        })(action.request, action.response, action.next);
    })
