import { Model, Document } from 'mongoose';
import { RepoCRUDInterface } from './dto/types';
import { ResourceType } from '../constant';
import { ProjectModel } from '@packages/mongoose/src/model/project';
import { ModelQueryService } from '@packages/mongoose';

function createRepoService<T extends Document>(
    model: Model<T>,
  ): RepoCRUDInterface
  {
      const queryService = new ModelQueryService() ;


    const create = async (dto) => {
          return await model.create(dto) ;
    };

    const list = async (filter) => {         
        return await queryService.list(model,filter) ;
    };

    const remove = async (id) => {
        const m =  await model.findById(id).exec() ;
        if(m) {

        
            if(model.schema.path('deleted')){
                m.set('deleted',true) ;
                await m.save() ;
            
            } else {
                await m.remove() ;
            }        
        }

        return m ;
    };

    const update = async (id,dto) => {
        const doc =  await model.findById(id).exec() ;
        if ( doc )
            return await model.findByIdAndUpdate(id,dto,{new:true}) ;

        return null ;
    };


    return { create,list,delete:remove,update} ;

  }

  export function createResourceRepoService(
    resourceType: ResourceType| string ,
  ): RepoCRUDInterface
  {
      if (resourceType == ResourceType.project) {
          const service = createRepoService (ProjectModel) ;          
          return service ;
      }
    
  }  

// export class ResourceService<T extends Document> {

//     private model: Model;
//     async create(dto) ;
//     list(filter) ;
//     delete(id) ;
//     update(id,dto) ;
// }