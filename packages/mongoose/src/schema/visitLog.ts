import { Schema, Model, model, Document, Types } from 'mongoose';
export const VisitLogSchema: Schema = new Schema(
    {
        
        session: {
            type: Schema.Types.ObjectId, 
            ref: "visitor",
        },
       
        action: {
            type: String, required: true,
        },
        data: {
            type: Object,
        },
        time:{
            type: Schema.Types.Date,            
            default: Date.now,
        } ,
        client: {
            type: Schema.Types.ObjectId, 
            ref: "client",
        },
        
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        // discriminatorKey: 'type',
    },
);
