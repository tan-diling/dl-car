import { DocumentType } from '@typegoose/typegoose';
import { ModelQueryService } from '@app/modules/query';
import { NotFoundError, NotAcceptableError, UnauthorizedError } from 'routing-controllers';
import * as randToken from 'rand-token';
import { User, UserModel, SessionModel } from '../models/user';
import { RepoOperation, SiteRole } from '@app/defines';
import { OneTimePin } from '@app/models';
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

    async changePassword(dto: { phone: string, oldPassword: string, newPassword: string }) {
        const user = await UserModel.findByKey(dto.phone);
        if (user && user.password == dto.oldPassword) {
            user.password = dto.newPassword;
            await user.save();

            return { result: "Your password has been changed successfully." };
        }

        throw new NotAcceptableError("password_check_error");
    }

    // async signUp(dto: Partial<User>) {
    //     const allowed = await this.settingService.allowPublicRegistration();
    //     if (!allowed) {
    //         throw new NotAcceptableError('Account registration is disabled.');
    //     }
    //     return await this.create(dto);
    // }


    /**
     * create an new user
     * @param dto 
     */
    async create(dto: Partial<User>,initPassword:string='88888888') {
        let {password,...user} = dto ;
        
        await UserModel.register(user,password || initPassword);        

        return UserModel.findByKey(user.phone) ;
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
        const userSession = await SessionModel.findOne({ refreshToken: token }).populate('user').exec();

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


    /**
     * check OTP
     * @param dto 
     */
    async checkValidateCode(dto: { phone: string, code: string, }) {
        // const user = await UserModel.findOne({phone}).exec;
        // if (user) {
            const key = `forget_${dto.phone}`
            const success = await OneTimePin.validateCode(key, dto.code);
            if (success) {
                const code = await OneTimePin.generateCode(key);
                return { code };
            } else {
                return { error: 'OTP validation failure' };
            }
        }

        // return { error: 'user not found' };
    

    // /**
    //  * user reset password with OTP 
    //  * @param email 
    //  */
    // async resetUserPasswordWithOTP(dto: { email: string, code: string, password: string }) {
    //     const user = await User.findByMail(dto.email);
    //     if (user) {
    //         const key = `forget_${user._id}`
    //         const success = await OneTimePin.validateCode(key, dto.code);
    //         if (success) {
    //             user.password = dto.password;
    //             await user.save();
    //             return { message: 'password changed' };
    //         } else {
    //             return { error: 'OTP validation failure' };
    //         }

    //     }

    //     return { error: 'user not found' };

    // }

}