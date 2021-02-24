
import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { StrategyOptions, ExtractJwt, Strategy } from 'passport-jwt';
import { logger, JWT_OPTION } from '@app/config';
import * as express from 'express';
import { UserModel, SessionModel  } from '@app/models';


passport.serializeUser((user: { id }, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    SessionModel.findById(id).populate('user').exec((err, user) => {
        done(err, user);
    });
});

/**
 * Sign in using Email and Password.
 */
passport.use(UserModel.createStrategy()) ;


// passport.serializeUser(UserModel.serializeUser());
// passport.deserializeUser(UserModel.deserializeUser());

// passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {

//     StaffModel.findOne({ email: email.toLowerCase() }, (err, user) => {
//         if (err) { return done(err); }
//         if (!user) {
//             return done(null, false, { message: `Email ${email} not found.` });
//         }
//         if (!user.password) {
//             return done(null, false, { message: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.' });
//         }
//         if (user.password == password) {
//             // (user as Staff)
//             return done(null, user);
//         }
//         return done(null, false, { message: 'Invalid email or password.' });
//     });
// }));

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



export const usePassport = (app: express.Application) => {
    passport.use('jwt', getStrategy());
    app.use(passport.initialize());
    app.use(passport.session());
}



