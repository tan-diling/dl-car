import { mongoose } from '@typegoose/typegoose';
import { virtualToJSON } from './_default';
mongoose.set('toJSON',virtualToJSON)　;

export * from './user' ;
export * from './group' ;
export * from './project' ;
export * from './permission' ;
export * from './photo' ;

