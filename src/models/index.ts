import { mongoose } from '@typegoose/typegoose';
import { virtualToJSON } from './_default';
mongoose.set('toJSON', virtualToJSON);

export * from './user';
export * from './permission';
export * from './photo';

export * from './otp';

