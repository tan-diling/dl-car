import { config_get } from './config';

export const MONGODB_URL : string = config_get('mongodb.url') || 'mongodb://localhost:27017/dealing' ;


export const DB_DATA_INIT = config_get('init') || [] ;

