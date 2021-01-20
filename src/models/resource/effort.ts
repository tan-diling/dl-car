import { prop, Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index, DocumentType, pre } from '@typegoose/typegoose';

import { User } from '../user';
import { ProjectMemberStatus } from '@app/defines';
import { ProjectStatus } from '@app/defines/projectStatus';
import { Resource, ResourceModel, ResourceRelatedBase } from './resource';
import { receiveMessageOnPort } from 'worker_threads';
import { Types } from 'mongoose';

export class Effort extends ResourceRelatedBase {

  // @prop()
  // title: string;

  @prop()
  startAt: Date;

  @prop()
  effort: number;

  // @prop( )
  // assignee: Types.ObjectId ;


  @prop({ ref: User, required: true })
  assignee: Ref<User>;

  static async getTotalEffort(resourceId: Types.ObjectId) {
    const resource = await ResourceModel.findById(resourceId).select({ totalEffort: 1 }).exec();

    if (resource.totalEffort < 0) {
      const agg = [
        {
          '$match': {
            $or: [{
              parents: resource._id,
            }, {
              _id: resource._id,
            }]
          }
        }, {
          '$lookup': {
            'from': 'efforts',
            'localField': '_id',
            'foreignField': 'parent',
            'as': 'efforts'
          }
        }, {
          '$unwind': {
            'path': '$efforts'
          }
        }, {
          '$match': {
            'efforts.deleted': false,
            'deleted': false,
          }
        }, {
          '$group': {
            '_id': null,
            'totalEffort': {
              '$sum': '$efforts.effort'
            }
          }
        }
      ];

      const docs = await ResourceModel.aggregate<{ _id: any, totalEffort: number }>(agg).exec();

      resource.totalEffort = docs.length > 0 ? docs[0].totalEffort : 0;
      await resource.save();
    }
    return resource.totalEffort;
  }

  static async setTotalEffortInvalid(resourceId: string | Types.ObjectId) {
    const resource = await ResourceModel.findById(resourceId).exec();
    if (resource) {
      await ResourceModel.updateMany({ _id: [...resource.parents, resource._id] }, { totalEffort: -1 }).exec();
    }

  }
}

export const EffortModel = getModelForClass(Effort, { schemaOptions: { timestamps: true } });


// const agg = [
//   {
//     '$lookup': {
//       'from': 'efforts', 
//       'localField': '_id', 
//       'foreignField': 'parent', 
//       'as': 'efforts'
//     }
//   }, {
//     '$unwind': {
//       'path': '$efforts'
//     }
//   }, {
//     '$group': {
//       '_id': null, 
//       'totalEffort': {
//         '$sum': '$efforts.effort'
//       }
//     }
//   }
// ];

