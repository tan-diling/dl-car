import { LoginController } from '@app/modules/auth';
import { UserController, AdminController } from './user/user.controller';
import { PhotoController, ImageController } from './photo/photo.controller';
import { ProjectController } from './resource/project.controller';
import { GroupController } from './group/group.controller';
import { GoalController } from './resource/goal.controller';
import { RequirementController } from './resource/requirement.controller';
import { TaskController } from './resource/task.controller';
import { DeliverableController } from './resource/deliverable.controller';
import { EffortController } from './resource/effort.controller';
import { CommentController } from './resource/comment.controller';
import { CheckListController } from './resource/checkList.controller';
import { AttachmentController } from './resource/attachment.controller';
import { ActionController } from './action/actionController';
import { ContactController } from './user/contact.controller';
import { GroupMemberController } from './group/groupMember.controller';
import { ProjectMemberController } from './resource/projectMember.controller';
import { NotificationController } from './notification/notificationController';
import { ConversationController } from './conversation/conversation.controller';
import { PasswordController } from './user/password.controller';

export const controllers = [
    AdminController,

    LoginController,
    UserController,
    PasswordController,
    PhotoController,
    ImageController,
    GroupController,
    GroupMemberController,


    ProjectController,
    ProjectMemberController,
    GoalController,
    RequirementController,
    DeliverableController,
    TaskController,

    EffortController,
    CommentController,
    CheckListController,
    AttachmentController,

    ActionController,
    ContactController,

    NotificationController,

    ConversationController,

];
