import * as  config from 'config';
import * as path from 'path';

console.log('NODE_CONFIG_ENV: ' + config.util.getEnv('NODE_CONFIG_ENV'));

const AppPrefix = 'GCP_'

export const config_get = (key:string,val:any=undefined):any => {
    if( config.has(key) ) {
        return config.get(key) ;
    }  
    
    const envKey = AppPrefix+key.replace('.','_').toUpperCase();
    return process.env[envKey] || val ;
    
    // return val ;
};

// export const ENV_DEVELOPMENT:boolean = config.util.getEnv('NODE_CONFIG_ENV') == 'development';

// export const ENV_PRODUCTION:boolean = config.util.getEnv('NODE_CONFIG_ENV') == 'production';

// export const MEETING_GOOGLE_CALENDAR_SUMMARY = ENV_PRODUCTION?'Meeting':'Meeting_dev';

// export const MONGOOSE_DEBUG :boolean = config_get('mongoose.debug') && true && ENV_DEVELOPMENT ;

// /** default crm admin email */
// export const DEFAULT_ADMIN_MAIL: string = 'admin@okaychat.com' ;
// /** default crm admin password */
// export const DEFAULT_ADMIN_PASSWORD: string = '3803@okaychat' ;
// /** google calendar id for meeting */
// export const MEETING_GOOGLE_CALENDAR_ID : string = config_get('calendar.meeting.id') || 'primary' ;
// /** google calendar id for monitor*/
// export const MONITOR_GOOGLE_CALENDAR_ID : string = config_get('calendar.meeting.syncId') || 'primary' ;
// /** google calendar owner mail */
// export const MEETING_GOOGLE_MAIL: string = 'dev@nicjob.com' ;
// /** default meeting summary , */
// export const MEETING_AVAILABLE_TITLE: string = 'AVAILABLE' ;
// /** backend api listen port ,default 3000 */
// export const PORT : number = config_get('port') || 3000 ;

// /** default mongodb url, related config file  in directory './config/'
//  * - read 'default.json'
//  * - when deployed development,read  'development.json'
//  * - when production ,read 'development.json' ,   
//  * */
export const MONGODB_URL : string = config_get('mongodb.url') || 'mongodb://localhost:27017/dealing' ;

// const ConfigDir = 'config';
// /** google calendar oauth2 mail */
// export const GOOGLE_AUTH_MAIL: string = 'dev@nicjob.com' ;
// /** google calendar oauth2 credentials file location */
// export const GOOGLE_AUTH_CREDENTIALS_FILE = path.join(ConfigDir, 'credentials.json');
// /** google calendar oauth2 token file */
// export const GOOGLE_AUTH_TOKEN_FILE = path.join(ConfigDir, 'token.json');

export const JWT_OPTION = {
    secretOrKey:  process.env.JWT_SECRET || 'dealing' ,
    algorithm: process.env.JWT_ALGORITHM || 'HS256',
    expiresIn: 2* 60 * 60 , // 1h=60*60s

};

// export const JWT_SECRET  = process.env.JWT_SECRET || 'intakeBot' ;
// export const JWT_ALGORITHM :string = process.env.JWT_ALGORITHM || 'HS256' ;

// /** ai user action service address */
// export const AI_USER_ACTION_URL =  ( config_get('ai.url') || 'https://staging.okaychat.com/rest_api/v2') +
//     '/chatbot/user_action.json';

// /** ai state for init chat */    
// export const AI_CHAT_INIT_STATE = 'INIT';
// export const AI_CHAT_INIT_ACTION_ID = 'init';
// export const AI_CHAT_DEFAULT_URL = '/welcome';

