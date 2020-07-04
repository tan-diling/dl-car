import {Schema,model,Document,} from 'mongoose';

export const SystemLogSchema: Schema = new Schema(
    {
        type: {
            type: String,
            default: 'ai',
        },
        url: {
            type: String,
        },
        method: {
            type: String,
        },
        headers: {
            type: Object,
        },
        body:  Object,

        responseCode: {
            type:Number,
        },
        responseBody: {
            type:Object,
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        // discriminatorKey: 'type',
        // capped: { size: 1024000, max: 1000,  },
    },
);
