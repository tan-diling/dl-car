/**
 * VisitLog Interface define, separated file for schema model
 * @packageDocumentation 
 */

import { Types } from 'mongoose';

export interface IVisitLog {    
    session: Types.ObjectId;
    action:string    
    data: any;
    time? : Date;
    client?: Types.ObjectId;
    created_at?: Date;
    updated_at?: Date;
}