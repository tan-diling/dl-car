import { UserModel } from '@packages/mongoose';
import { NotFoundError, NotAcceptableError } from 'routing-controllers';

/**
 * user service
 */
export class UserService {

    /**
     * create an new user
     * @param dto 
     */
    async create(dto: {email:string, name:string, password:string, role:string }) {

        let user = await UserModel.findOne({ email: dto.email }).exec();
        if (user != null ) {
            throw new NotAcceptableError('user email exists');
        }

        user = await UserModel.create({emailValidated:false,...dto}) ;
        UserModel.emit('created',user) ;
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
            return null ;
        }

        throw new NotAcceptableError('user id or email error') ;        
    }

    /**
     * get user list
     * @param query 
     */
    async list(query:{ filter?, order? , skip?:number, limit?:number}){
        let q = UserModel.find(query?.filter) ;
        if(query?.order) q.sort(query.order) ;

        if(query?.skip) q.skip(query.skip) ;

        if(query?.limit) q.limit(query.limit) ;

        return await q.exec() ;
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
            return await doc.updateOne(doc,{new:true}).exec() ;
        }

        return doc ;
    }

    /**
     * delete user
     * @param id 
     * @param dto 
     */
    async delete(id){
        const doc = await this.getById(id) ;
        if(doc){
            return await doc.remove() ;
        }

        return doc ;
    }

 
}