import { Schema, Model, model, Document, Types } from 'mongoose';
import { schemaNames } from './constant';
import { INotification } from '../interface/notification';

export type INotificationDocument = INotification & Document;

const schema: Schema = new Schema(
    {                       
        action: {
            type: String, required: true,
        },
        data: {
            type: Object,
        },
        read_at:{
            type: Date,                        
        } ,   
        staff: {
            type: Types.ObjectId ,
        },     
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },        
    },
);

export type NotificationModel = Model<INotificationDocument, {}>;

export const Notification = model<INotificationDocument>(schemaNames.notification, schema);  