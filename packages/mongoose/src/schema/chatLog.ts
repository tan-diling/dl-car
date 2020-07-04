import { Schema, Model, model, Document, Types } from 'mongoose';

export const ChatLogSchema: Schema = new Schema(
    {        
        session: {
            type: Schema.Types.ObjectId, 
        },
        socket_id: {
            type: String,
        },
        topic: {
            type: String, required: true,
        },
        body: {
            type: Object,
        },
        time:{
            type: Schema.Types.Date,            
            default: Date.now,
        } ,
        client: {
            type: Schema.Types.ObjectId, 
        },
        
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        // discriminatorKey: 'type',
    },
);
