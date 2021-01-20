import { DocumentType } from '@typegoose/typegoose';
import { ModelQueryService } from '@app/modules/query';
import { NotFoundError, NotAcceptableError, UnauthorizedError } from 'routing-controllers';
import * as randToken from 'rand-token';
import { UserModel, User, LoginSessionModel } from '../models/user';
import { RepoOperation, SiteRole } from '@app/defines';
import { OneTimePin } from '@app/models';
import { executeNotificationSend } from './notification/sender';
import { UpdateQuery } from 'mongoose';
import { SettingService } from './setting.service';
import { Container } from 'typedi';

/**
 * user service
 */
export class UserService {

    private queryService = new ModelQueryService();
    private settingService = Container.get(SettingService);
    constructor() {
    }

    async changePassword(dto: { email: string, oldPassword: string, newPassword: string }) {
        const user = await User.findByMail(dto.email);
        if (user && user.password == dto.oldPassword) {
            user.password = dto.newPassword;
            await user.save();

            return { result: "Your password has been changed successfully." };
        }

        throw new NotAcceptableError("password_check_error");
    }

    async signUp(dto: Partial<User>) {
        const allowed = await this.settingService.allowPublicRegistration();
        if (!allowed) {
            throw new NotAcceptableError('Account registration is disabled.');
        }
        return await this.create(dto);
    }


    /**
     * create an new user
     * @param dto 
     */
    async create(dto: Partial<User>) {

        let user = await User.findByMail(dto.email);
        if (user != null) {
            if (user.role != '') {
                throw new NotAcceptableError('account_exists');
            } else {
                user = await UserModel.findByIdAndUpdate(user._id, dto).exec();
            }
        } else {
            user = new UserModel(dto);
            await user.save();
        }

        if (user.role != '') {
            user.emailValidated = false;
            if (!user.password) user.password = process.env.GCP_DEFAULT_PASSWORD || randToken.uid(8);

            await user.save();

            UserModel.emit(RepoOperation.Created, user);
        }
        return user;
    }

    /**
     * validate user email
     * @param dto 
     */
    async validateEmail(dto: { email: string, id: string }) {

        let user = await this.getById(dto.id);
        if (user != null && user.email == dto.email) {
            user.emailValidated = true;
            await user.save();

            return;
        }

        throw new NotAcceptableError('user id or email error');
    }

    /**
     * get user list
     * @param query 
     */
    async list(query: any) {
        return await this.queryService.list(UserModel, query);
    }

    /**
     * get user by id
     * @param id 
     */
    async getById(id: string) {
        return await UserModel.findById(id).exec();
    }

    async getByToken(token: string) {
        const userSession = await LoginSessionModel.findOne({ refreshToken: token }).populate('user').exec();

        return userSession?.user as DocumentType<User>;
    }

    /**
     * update user info
     * @param id user id
     * @param dto 
     */
    async update(id: string, dto: UpdateQuery<DocumentType<User>>) {
        const doc = await this.getById(id);
        if (doc) {
            return UserModel.findByIdAndUpdate(id, dto, { new: true }).exec();
        }

        return null;
    }

    /**
     * delete user
     * @param id 
     * @param dto 
     */
    async delete(id) {
        const doc = await this.getById(id);
        if (doc) {
            if (doc.role != SiteRole.Admin) {
                doc.deleted = true;
                return await doc.save();
            }
        }

        return null;
    }


    async getContacts(id) {
        const doc = await this.getById(id);
        if (doc) {
            await doc.populate("contacts").execPopulate();
            return doc.contacts;
        }
    }

    /**
     * get user by email ,if not exist,create a new user (inviter user fro sign up,)
     * @param email 
     * @param options 
     */
    async getUserByEmailForce(email: string, options?: Partial<User>) {
        const defaultInvitationUser = { name: 'New User', company: '', role: '' };
        let user = await User.findByMail(email);

        if (user == null) {
            user = await this.create({ ...defaultInvitationUser, ...options, email: email });
        }

        return user;
    }

    async getByEmail(email: string) {
        return await User.findByMail(email);
    }

    /**
     * user attempt query forget password OTP by email,
     * @param email 
     */
    async forgetUserPasswordAndSendEmail(email: string) {
        const user = await User.findByMail(email);
        if (user) {
            const key = `forget_${user._id}`
            const code = await OneTimePin.generateCode(key);

            executeNotificationSend({
                executor: "mail",
                receiver: user._id,
                event: { sender: user._id, type: 'user', action: 'forgetPassword', data: { code } },
                mailTemplate: "forgetPassword",
                skipMailCheck: true,
            }).catch(err => {
                console.error("forget password mail send error")
            });

            return { message: 'email send' };
        }

        return { error: 'user not found' };

    }

    /**
     * check OTP
     * @param dto 
     */
    async checkValidateCodeOfForget(dto: { email: string, code: string, }) {
        const user = await User.findByMail(dto.email);
        if (user) {
            const key = `forget_${user._id}`
            const success = await OneTimePin.validateCode(key, dto.code);
            if (success) {
                const code = await OneTimePin.generateCode(key);
                return { code };
            } else {
                return { error: 'OTP validation failure' };
            }
        }

        return { error: 'user not found' };
    }

    /**
     * user reset password with OTP 
     * @param email 
     */
    async resetUserPasswordWithOTP(dto: { email: string, code: string, password: string }) {
        const user = await User.findByMail(dto.email);
        if (user) {
            const key = `forget_${user._id}`
            const success = await OneTimePin.validateCode(key, dto.code);
            if (success) {
                user.password = dto.password;
                await user.save();
                return { message: 'password changed' };
            } else {
                return { error: 'OTP validation failure' };
            }

        }

        return { error: 'user not found' };

    }

}