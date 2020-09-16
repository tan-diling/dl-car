import { Model, Document, Types, } from 'mongoose';
import { RepoCRUDInterface, MemberStatus } from '@app/defines';
import { ProjectModel, ProjectMemberModel, Project, ProjectMember, ResourceModel, Resource } from '@app/models';
import { ReturnModelType, DocumentType } from '@typegoose/typegoose';
import { ForbiddenError, NotAcceptableError } from 'routing-controllers';
import { StatusHandlers, ProjectStatus } from '@app/defines/projectStatus';
import { DbService } from '../db.service';

export class ResourceService<T extends Resource> implements RepoCRUDInterface {

    model: Model<T & Document>;

    async create(dto) {
        let { parent, ...obj } = dto;
        if (parent) {
            const parentResource = await ResourceModel.findById(parent).exec();
            if (parentResource) {
                const p = parentResource.parents;
                obj = { ...obj, parents: [...p, parentResource._id] };
            } else {
                throw new NotAcceptableError('parent error');
            }

        }
        return await this.model.create(obj);
    }

    async list(filter) {
        // return await queryService.list(this.model, filter);
        return await DbService.list(this.model, filter);
    }


    async get(filter) {
        return await DbService.get(this.model, filter);
    }

    async delete(id) {
        const m = await this.model.findById(id).exec();
        if (m) {
            const childCount = await DbService.count(ResourceModel,{parents:m._id,deleted:false}) ;
            if (childCount>0){
                throw new NotAcceptableError('child exists') ;
            }
            if (this.model.schema.path('deleted')) {
                m.set('deleted', true);
                await m.save();

            } else {
                await m.remove();
            }
        }

        return m;
    }

    private async validateAssignees(doc: DocumentType<Resource>, assignees:string[]){
        
        if(assignees){
            const members = await doc.getMembers();

            for(const uid of assignees){
                const member = members.find(x=>x.userId == Types.ObjectId(uid)) ;
                if(null == member ){
                    throw new NotAcceptableError('assignees_error') ;
                }
            }
        }
    }

    async update(id, dto) {
        const doc = await this.model.findById(id).exec();
        if (doc ){  
            await this.validateAssignees(doc as any,dto.assignees) ;
            return await this.model.findByIdAndUpdate(id, dto, { new: true });
        }

        return null;
    };

    async status(dto: { id: string, status: ProjectStatus, userId: string }) {
        const resource = await ResourceModel.findById(dto.id).exec();
        if (resource) {
            const resourceType = resource.type;

            let key:string =null
            for(const k of StatusHandlers.keys()){
                if ( resourceType.toLowerCase() == k.toLowerCase()){
                    key = k ;
                    break ;
                }
            }

            if (key == null){
                throw new Error('status_type_error');
            }

            const maps = StatusHandlers.get(key);

            const fromHandler = maps.find(x => x.from == resource.status);

            if (fromHandler == null){
                throw new NotAcceptableError('status_error');
            }

            const targetHandler = fromHandler.handlers.find(x => x.to == dto.status);

            if (targetHandler == null){
                throw new NotAcceptableError('status_target_error');
            }


            const projectRole = await resource.getMemberProjectRole(dto.userId) ;

            if (!targetHandler.projectRoles.includes(projectRole)) {
                throw new NotAcceptableError('status_role_error');
            }
            let checkerFunction = targetHandler.checker;
            if (checkerFunction) {
                if (! await checkerFunction(resource, dto.status)) {
                    throw new NotAcceptableError('status_check_error');
                }
            }
            resource.status = dto.status;
            await resource.save();
            return resource ;
        }

        return null;
    };

    async execute(method: string, dto) {
        let func = this[method] as Function;
        if (func) {
            return await func.bind(this)(dto);
        }

        throw new Error(`${method} not support!`);
    };
}



// export function createResourceRepoService(
//     resourceType: ResourceType| string ,
//   ): RepoCRUDInterface
//   {
//       if (resourceType == ResourceType.Project) {

//           return new ProjectResourceService() ;
//       }

//   }  

