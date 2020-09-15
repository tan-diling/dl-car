import {LoginController} from '@app/modules/auth';
import {UserController} from './user/user.controller';
import { PhotoController, ImageController } from './photo/photo.controller';
import { ProjectController } from './resource/project.controller';
import { GroupController } from './group/group.controller';
import { GoalController } from './resource/goal.controller';

export const controllers = [
    LoginController,
    UserController,
    PhotoController,
    ImageController,

    GroupController,
    
    ProjectController,
    GoalController,
] ;
