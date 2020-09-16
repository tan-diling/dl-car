import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index, DocumentType, pre } from '@typegoose/typegoose';

import { Resource, ResourceModel } from './resource';

export class Requirement extends Resource {
}

export const RequirementModel = getDiscriminatorModelForClass(ResourceModel,Requirement);
