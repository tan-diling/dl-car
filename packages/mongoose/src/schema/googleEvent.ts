/**
 * meeting schema doc
 */
import { Schema, Model, model, Document } from 'mongoose';


export const GoogleEventSchema: Schema = new Schema(
  {    
    start: {
      type: Schema.Types.Date, 
    },
    end: {
      type: Schema.Types.Date, 
    },    

    event: Object, 
    meeting: {
      type:Schema.Types.ObjectId,
    }   
  }, 
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },    
  },
);


