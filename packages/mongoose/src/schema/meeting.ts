/**
 * meeting schema 
 */
import { Schema, Model, model, Document, Types } from 'mongoose';
import { IMeeting, MeetingStatus, MeetingResult, MeetingResponseStatus } from '../interface/meeting';

export const MeetingSchema: Schema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId, ref: "client",

    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    summary: {
      type: String,
    },
    description: {
      type: String,
    },
    start: {
      type: Date,
      unique: true,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    result: {
      type: String,
      enum: Object.values(MeetingResult),
      default: MeetingResult.NONE,
    },
    eventId: {
      type: String,
      // required: true,
      // default: idByDate()
    },
    sync_at: {
      type: Date,
    },
    serviceStaff: {
      type: Types.ObjectId,
    },
    responseStatus: {
      type: MeetingResponseStatus,
    },

  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      getters: true,
      virtuals: true,
    },
  },
);


MeetingSchema.pre('save', function (next) {
  const doc = this as (IMeeting & Document);
  doc.eventId = doc.id;
  next();
});

// MeetingSchema.virtual('google_event', {
//   ref: 'googleEvent', // The model to use
//   localField:'eventId', // Find people where `localField`
//   foreignField: 'event.id', // is equal to `foreignField`
//   // If `justOne` is true, 'members' will be a single doc as opposed to
//   // an array. `justOne` is false by default.
//   justOne: true,
//   // options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
// });
export function getMeetingStatus(doc: { start: Date, email: string }) {
  const { start, email } = doc;
  const t = new Date();
  let status = email ? MeetingStatus.BOOKED : MeetingStatus.AVAILABLE;
  if (start < t) {
    status = MeetingStatus.OUTDATED;
  }
  return status;
}

MeetingSchema.virtual('status').get(function (value, virtual, doc) {  
  return getMeetingStatus(doc);
});

