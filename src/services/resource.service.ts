import { Model, Document, Types } from 'mongoose';
import { RepoCRUDInterface, MemberStatus } from '@app/defines';
import { ResourceType, ProjectRole, RepoOperation } from '@app/defines';
import { ProjectModel, ProjectMemberModel, Project, ProjectMember, ResourceModel } from '../models/project';
import { ModelQueryService } from '../modules/query';
import { ReturnModelType } from '@typegoose/typegoose';
import { ForbiddenError, NotAcceptableError } from 'routing-controllers';
import { UserModel } from '@app/models/user';
import { IdentityService } from '@app/modules/auth/src/controller/identity.service';
import { StatusHandlers } from '@app/defines/projectStatus';
import { stringify } from 'querystring';

const queryService = new ModelQueryService();
export class ResourceService<T> implements RepoCRUDInterface {

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
        return await queryService.list(this.model, filter);
    }


    async get(filter) {
        return await queryService.get(this.model, filter);
    }

    async delete(id) {
        const m = await this.model.findById(id).exec();
        if (m) {
            if (this.model.schema.path('deleted')) {
                m.set('deleted', true);
                await m.save();

            } else {
                await m.remove();
            }
        }

        return m;
    }

    async update(id, dto) {
        const doc = await this.model.findById(id).exec();
        if (doc)
            return await this.model.findByIdAndUpdate(id, dto, { new: true });

        return null;
    };

    async status(dto: { id: string, status: string, userId: string }) {
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
                if (! await checkerFunction(resource, status)) {
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

