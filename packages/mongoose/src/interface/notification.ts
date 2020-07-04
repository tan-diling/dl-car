/**
 * Notification Interface define, separated file for schema model
 * @packageDocumentation 
 */

import { Types } from 'mongoose';

export interface INotification  {  
    action:string;    
    data:any;
    read_at?: Date;
    staff?: Types.ObjectId;
    updated_at?: Date;
    created_at?: Date;    
}