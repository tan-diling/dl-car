import { Request, Response, NextFunction, Router } from 'express';
import * as passport from 'passport';
import * as requestIp from 'request-ip';
import { UserModel,Session } from '@app/models';
import { prop, Ref, plugin, getModelForClass, DocumentType, getDiscriminatorModelForClass, index, QueryMethod, ReturnModelType, queryMethod, modelOptions } from '@typegoose/typegoose';

import { sign } from 'jsonwebtoken';
import { JWT_OPTION } from '@app/config';

const jwtOptions = JWT_OPTION;

const createAccessTokenToken = (sess: DocumentType<Session>) => {

    const accessToken = sign(
        { id: sess.id },
        jwtOptions.secretOrKey,
        { expiresIn: jwtOptions.expiresIn } ,
    );

    return { ...sess.toJSON(), accessToken };
};

/**
 * login api 
 */
export const login = function (req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', { session: false, failWithError: true }, function (err, user, info) {
        if (err) { return next(err) }
        if (!user) { return res.json({ message: info.message }) }
        const device = String(req.body['device'] || 'default');
        const ip = requestIp.getClientIp(req);
        // const staff = req.user as Staff;
        UserModel.buildSession({ device, user, ip })
            .then(sess => {
                req.login(sess, err => {
                    if (err) { return next(err) }
                    res.json(createAccessTokenToken(sess));
                });
            })
            .catch(err => next(err));
    })(req, res, next);
};

/**
 * logout api 
 */
export const logout = async (req: Request, res: Response) => {
    req.logout();

    res.json({ message: "logout successfully" });
}

/**
 * refresh token
 */
export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const sess = req.user as DocumentType<Session>;

    if (sess != null && sess.refreshToken == refreshToken) {
        // await sess.refreshToken();
        res.json(createAccessTokenToken(sess));
    }
    else 
    {
        return res.status(401).json({ message: "sessionInvalid" });
    }
}

export const router = Router();
router.post('/login', login);

router.post('/logout', logout);

router.post('/refresh', refreshToken);
