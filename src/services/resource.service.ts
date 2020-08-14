import { Model, Document, Types } from 'mongoose';
import { RepoCRUDInterface, MemberStatus } from '@app/defines';
import { ResourceType, ProjectRole, RepoOperation } from '@app/defines';
import { ProjectModel, ProjectMemberModel, Project, ProjectMember } from '../models/project';
import { ModelQueryService  } from '../modules/query';
import { ReturnModelType } from '@typegoose/typegoose';
import { ForbiddenError, NotAcceptableError } from 'routing-controllers';
import { UserModel } from '@app/models/user';
import { IdentityService } from '@app/modules/auth/src/controller/identity.service';

const queryService= new ModelQueryService() ;  
export class ResourceService<T > implements RepoCRUDInterface {    

    model: Model<T & Document>;

    async create(dto){
        return await this.model.create(dto) ;
    } 

    async list(filter) {
        return await queryService.list(this.model,filter) ;        
    }

    async delete(id) {
        const m =  await this.model.findById(id).exec() ;
        if(m) {        
            if(this.model.schema.path('deleted')){
                m.set('deleted',true) ;
                await m.save() ;
            
            } else {
                await m.remove() ;
            }        
        }

        return m ;    
    }

    async update(id,dto) {
        const doc =  await this.model.findById(id).exec() ;
        if ( doc )
            return await this.model.findByIdAndUpdate(id,dto,{new:true}) ;

        return null ;
    };

    async execute(method:string,dto){
        let func = this[method] as Function;
        if(func){
            return await func.bind(this)(dto);            
        }

        throw new Error(`${method} not support!`) ;
    } ;
}
  


// export function createResourceRepoService(
//     resourceType: ResourceType| string ,
//   ): RepoCRUDInterface
//   {
//       if (resourceType == ResourceType.Project) {
          
//           return new ProjectResourceService() ;
//       }
    
//   }  

