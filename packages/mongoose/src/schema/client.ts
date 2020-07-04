/**
 * client schema doc
 */
import { Schema, Model, model, Document, Types } from 'mongoose';
import { ClientType } from '../interface/client';

const NameSchema: Schema = new Schema(
  {
    first: { type: String, required: true },
    middle: { type: String },
    last: { type: String, required: true },
  },
  { _id: false },
);


export const NoteSchema: Schema = new Schema(
  {
    title: { type: String },
    content: { type: String },
    // last: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    // discriminatorKey: 'type',
    // _id: false,
   },
);
export const ClientSchema: Schema = new Schema(
  {
    name: {
      type: NameSchema,
    },
    email: {
      type: String,
      // unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    timezone: {
      type:Number,
      default:0
    },
    company: {
      type: String, required: true,
    },
    phone: {
      type: String,
    },
  
    title: String,
    industry: String,
    source: String,

    notes: [NoteSchema],

    // last_meeting:
    staff: {
      type: Types.ObjectId, 
    },    
    type: {
      type: String, 
      // default: ClientType.GUEST,
      enum: Object.values(ClientType) ,
    },    
  }, 
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },    
    toJSON: {  virtuals: true, },
    // discriminatorKey: 'type',
  },
);

ClientSchema.virtual('meeting', {
  ref: "meeting" , // The model to use
  localField:'_id', // Find people where `localField`
  foreignField: 'client', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: true,
  options: { sort: { start: -1 }, limit: 2 } // Query options, see http://bit.ly/mongoose-query-options
});

ClientSchema.virtual('chatLog', {
  ref: "chat_log" , // The model to use
  localField:'_id', // Find people where `localField`
  foreignField: 'client', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: true,
  options: { 
    sort: { time: -1 }, 
    match: {topic:'chat-request'},    
  } // Query options, see http://bit.ly/mongoose-query-options
});

ClientSchema.virtual('visitLog', {
  ref: 'visit_log', // The model to use
  localField:'_id', // Find people where `localField`
  foreignField: 'client', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: true,
  options: { 
    sort: { time: -1 }, 
    // match: {topic:'chat-request'},    
  } // Query options, see http://bit.ly/mongoose-query-options
});

ClientSchema.index({ "$**": "text" } );

