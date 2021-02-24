import { router as AuthRouter } from '@app/modules/auth';
// import { UserController } from './user/user.controller';

// import { AdminController } from './admin.controller';
import { Router } from 'express';
export const router = Router();

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "sessionInvalid" });
};


export const routers = [AuthRouter, router];

export const controllers = [
    // AdminController,

    // LoginController,
    // UserController,
    // PasswordController,
    // PhotoController,
    // ImageController,

    // ConversationController,

];

// export const controllers = [
//     AdminController,

//     LoginController,
//     UserController,
//     PasswordController,
   

// ];
