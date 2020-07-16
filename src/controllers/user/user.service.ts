import { UserModel, Operation, ModelQueryService  } from '@packages/mongoose';
import { NotFoundError, NotAcceptableError } from 'routing-controllers';


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

            return ;
        }

        throw new NotAcceptableError("email or password not matched ") ;
    }

    /**
     * create an new user
     * @param dto 
     */
    async create(dto: {email:string, name:string, password:string, role?:string }) {

        let user = await UserModel.findOne({ email: dto.email }).exec();
        if (user != null ) {
            throw new NotAcceptableError('user email exists');
        }

        user = await UserModel.create({emailValidated:false, ...dto}) ;
        UserModel.emit(Operation.Created, user) ;
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

    /**
     * update user info
     * @param id user id
     * @param dto 
     */
    async update(id:string,dto:any){
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
            doc.deleted = true ;
            return await doc.save() ;
        }

        return null ;
    }

 
}