import { Schema, Model,modelNames , model, Document, Types } from 'mongoose';

export  const LoginSessionSchema = new Schema({
  user: { type: Schema.Types.ObjectId,},
 
  // session: String,
  device: String,
  accessToken: String,
  refreshToken: String,
  lastAccessTime : Date ,
  refreshExpireTime: Date,
  ip: String,
  // isValid: Boolean ,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}} );

