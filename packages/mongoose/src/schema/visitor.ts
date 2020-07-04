
import { Schema, Model, model, Document, Types } from 'mongoose';

export const VisitorSchema: Schema = new Schema(
    {
      device: {
        type: String,
      },
      token: {
        type: String,
      }, 
      ip: {
        type: String,
      },
      user: {
        type: Types.ObjectId
      }            
    }, 
    {
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    },
);