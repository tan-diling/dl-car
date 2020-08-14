
import  passport = require( 'passport');
import { StrategyOptions, ExtractJwt, Strategy } from 'passport-jwt';
import { logger, JWT_OPTION } from '@app/config';

const jwtOption = JWT_OPTION;

const strategyOptions: StrategyOptions = {
    secretOrKey: jwtOption.secretOrKey,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('bearer'),
    // issuer:"dealing.tech",
    // audience?: string;
    algorithms: [jwtOption.algorithm],
    // ignoreExpiration?: boolean;
    passReqToCallback: true,
    // jsonWebTokenOptions:{issuer:"dealing.tech",}
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

passport.use('jwt', getStrategy());

export const middleware = passport.authenticate('jwt',{ session: false, failWithError: true } ) ;
