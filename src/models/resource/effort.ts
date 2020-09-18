import { prop, Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index, DocumentType, pre } from '@typegoose/typegoose';

import { User } from '../user';
import { ProjectMemberStatus } from '@app/defines';
import { ProjectStatus } from '@app/defines/projectStatus';
import { Resource, ResourceModel, ResourceRelatedBase } from './resource';
import { receiveMessageOnPort } from 'worker_threads';
import { Types } from 'mongoose';

export class Effort extends ResourceRelatedBase {

  @prop()
  title: string;

  // @prop()
  // results:string;  

  @prop()
  startAt: Date;

  @prop()
  effort: number;

  static async syncResourceTotalEffort(resourceId:Types.ObjectId) {
    const resource = await ResourceModel.findById(resourceId).exec();
    const agg = [
      {
        '$match': {          
          $or:[{
            parents:resource._id,
          },{
            _id:resource._id,
          }]
          
        }
      },
      {
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
        '$group': {
          '_id': null,
          'totalEffort': {
            '$sum': '$efforts.effort'
          }
        }
      }
    ];

    const docs = await ResourceModel.aggregate<{ _id: any, totalEffort: number }>(agg).exec();

    resource.totalEffort = docs[0].totalEffort;
    await resource.save();

    if(resource.parents.length>0){

    }

    return resource.totalEffort ;
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
