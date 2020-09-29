import { DocumentType } from '@typegoose/typegoose' ;
import { ModelQueryService  } from '@app/modules/query';
import { NotFoundError, NotAcceptableError, UnauthorizedError } from 'routing-controllers';
import * as randToken from 'rand-token';
import { UserModel, User } from '../models/user';
import { RepoOperation, SiteRole } from '@app/defines';

/**
 * user service
 */
export class UserService {

    private queryService= new ModelQueryService() ;
    constructor() {
    }

    async changePassword(dto:{email:string, oldPassword:string, newPassword:string}){
        const user = await UserModel.findOne({email:dto.email}).exec() ;
        if(user && user.password==dto.oldPassword){
            user.password = dto.newPassword ;
            await user.save() ;

            return { result:"Your password has been changed successfully."};
        }

        throw new NotAcceptableError("password_check_error") ;
    }

    /**
     * create an new user
     * @param dto 
     */
    async create(dto: Partial<User>) {

        let user = await UserModel.findOne({ email: dto.email }).exec();
        if (user != null ) {
            throw new NotAcceptableError('account_exists');
        }

        user = new UserModel(dto) ;
        user.emailValidated = false ;
        if(! user.password) user.password = randToken.uid(8) ;

        await user.save() ;
        UserModel.emit(RepoOperation.Created, user) ;
        return user;
    }

    /**
     * validate user email
     * @param dto 
     */
    async validateEmail( dto:{email:string,id:string }) {

        let user = await this.getById(dto.id) ;
        if (user != null &&  user.email == dto.email ) {
            user.emailValidated = true ;
            await user.save() ;
            
            return ;
        }

        throw new NotAcceptableError('user id or email error') ;        
    }    

    /**
     * get user list
     * @param query 
     */
    async list(query:any){
        return await this.queryService.list(UserModel,query) ;
    }

    /**
     * get user by id
     * @param id 
     */
    async getById(id:string){
        return await UserModel.findById(id).exec() ;
    }

    async getByEmail(email:string){
        return await UserModel.findOne({ email }).exec();
    }

    /**
     * update user info
     * @param id user id
     * @param dto 
     */
    async update(id:string, dto: DocumentType<User>){
        const doc = await this.getById(id) ;
        if(doc){
            return UserModel.findByIdAndUpdate(id,dto,{new:true}).exec() ;            
        }

        return null ;
    }

    /**
     * delete user
     * @param id 
     * @param dto 
     */
    async delete(id){
        const doc = await this.getById(id) ;
        if(doc){
            if(doc.role == SiteRole.Admin) return ;
            doc.deleted = true ;
            return await doc.save() ;
        }

        return null ;
    }


    async getContacts(id){
        const doc = await this.getById(id) ;
        if(doc){            
            await doc.populate("contacts").execPopulate() ;
            return doc.contacts ;
        }        
    }
 
}