/**
 * mongoose connect init;
 * init data (default account info)
 * 
 * @packageDocumentation
 * @module startup
 */
import {MONGODB_URL} from '@packages/core';
import {Schema,model,Document,connect, Mongoose } from 'mongoose';
import { Db } from 'mongodb';

let db: Db = null ;

export const db_startup =  async (init?:Function): Promise<Db> => {
    if (db != null)
        return db ;

    const url = MONGODB_URL ;
    console.log("DB URL " + url );
    const connection = await connect(
        url,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // serverSelectionTimeoutMS:5000,
            useFindAndModify: false,
            useCreateIndex: true,
        },
    );

    // mongoose.pluralize(null);

    if( init != null ) {
        
        await init();
    }

    

    db = connection.connection.db ;
    return  db ;
};

db_startup() ;

function getModel<T>(name:string,schema:Schema) {
    // db_startup().finally();
    // let m =  model<T & Document>(name);
    // if((m == null) && (schema!=null)) 
    {
        return  model<T & Document>(name,schema);
    }
    // return m ;
}

/** user login model */

import { ILoginSession } from './interface/loginSession';
import { IUser } from './interface/user';
import { UserSchema } from './schema/user';
import { LoginSessionSchema } from './schema/loginSession';

export {IUser, ILoginSession}

export const UserModel =  getModel<IUser>('user',UserSchema) ;
export const LoginSessionModel = getModel<ILoginSession>('login_session',LoginSessionSchema) ;


/** ai logs model */
import { ISystemLog } from './interface/systemLog';
import { SystemLogSchema } from './schema/systemLog';
export {ISystemLog }
export const SystemLogModel = model<ISystemLog & Document>('system_log',SystemLogSchema) ;


/** chat module */
import { IVisitor } from './interface/visitor';
import { IVisitLog } from './interface/visitLog';
import { VisitorSchema } from './schema/visitor';
import { VisitLogSchema } from './schema/visitLog';
import { IClient } from './interface/client';
import { ClientSchema } from './schema/client';
import { IMeeting, IGoogleEvent } from './interface/meeting';
import { MeetingSchema } from './schema/meeting';
import { IChatLog } from './interface/chatLog';
import { ChatLogSchema } from './schema/chatLog';
import { GoogleEventSchema } from './schema/googleEvent';

export {IVisitor, IVisitLog, IChatLog, IClient, IMeeting}

export const VisitorModel = getModel<IVisitor>('visitor',VisitorSchema) ;
export const VisitLogModel = getModel<IVisitLog>('visitor_log',VisitLogSchema) ;

export const ChatLogModel = getModel<IChatLog>('chat_log',ChatLogSchema) ;

export const ClientModel = getModel<IClient>('client',ClientSchema) ;
export const MeetingModel = getModel<IMeeting>('meeting',MeetingSchema) ;

export const GoogleEvent = getModel<IGoogleEvent>('google_event', GoogleEventSchema);

export * from './interface/meeting' ;

