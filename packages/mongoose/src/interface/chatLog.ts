/**
 * ChatLog Interface define, separated file for schema model
 * @packageDocumentation 
 */

import { Types } from 'mongoose';

export interface IChatLog {    
    session: Types.ObjectId;
    socket_id:string
    topic: string;
    body: any;
    time? : Date;
    client?: Types.ObjectId;
    created_at?: Date;
    updated_at?: Date;
}