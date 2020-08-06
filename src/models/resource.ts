// import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass } from '@typegoose/typegoose';
// import { Types } from 'mongoose';
// import { User } from './user';
// import { ProjectMemberStatus } from '@app/defines';

// export class Resource {

//   @prop({ required: true } )
//   creator?: Types.ObjectId ;


//   @prop()
//   parentId?: Types.ObjectId ;

//   @prop()
//   assignee?: Types.ObjectId[] ;

//   @prop({ default: false})
//   deleted?: boolean ;

//   @prop()
//   createdAt?: Date;

//   @prop()
//   updatedAt?: Date;
// }


// export const ResourceModel = getModelForClass(Resource,{schemaOptions:{timestamps:true}});