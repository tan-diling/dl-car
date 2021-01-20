import { prop,  Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index, DocumentType, pre } from '@typegoose/typegoose';

import { User } from '../user';
import { ProjectMemberStatus } from '@app/defines';
import { ProjectStatus } from '@app/defines/projectStatus';
import { Resource, ResourceModel, ResourceRelatedBase } from './resource';
import { Types } from 'mongoose';

export class CheckList extends ResourceRelatedBase {

  // @prop()
  // title:string;

  @prop()
  description:string;

  @prop()
  done:boolean;  

  static async getCompletion(resourceId: Types.ObjectId) {
    // const resource = await ResourceModel.findById(resourceId).exec();

    // if (resource.checklistCompletion < 0) {
      const agg = [
        {
          '$match': {
            // $or: [{
              parents: resourceId,
            // }, {
            //   _id: resourceId,
            // }]
          }
        },{
          '$lookup': {
            'from': 'checklists',
            'localField': '_id',
            'foreignField': 'parent',
            'as': 'checklist'
          }
        }, {
          '$unwind': {
            'path': '$checklist'
          }
        }, {
          '$match': {
            'checklist.deleted': false,
            'deleted': false,
          }
        }, {          
          '$group': {
            '_id': null,
            'total': {
              '$sum': 1
            },
            'done': {
              '$sum': { '$cond': [ "$checklist.done", 1, 0 ] }
            },
          }
        }
      ];

      const docs = await ResourceModel.aggregate<{ _id: any, total: number,done: number }>(agg).exec();

      if(docs.length>0 && docs[0].total>0){
        return {total:docs[0].total,done:docs[0].done} ;
      }
      
      return {total:0,done:0} ;
    }


}

export const CheckListModel = getModelForClass(CheckList,{schemaOptions:{ timestamps:true }});
