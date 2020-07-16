import {LoginController} from '@packages/login';
import {UserController} from './user/user.controller';
import { PhotoController, ImageController } from './photo/photo.controller';

export const controllers = [
    LoginController,
    UserController,
    PhotoController,
    ImageController,
] ;
