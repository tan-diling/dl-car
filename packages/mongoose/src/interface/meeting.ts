/**
 * Meeting Interface define, separated file for schema model
 * @packageDocumentation 
 */

import { calendar_v3 } from 'googleapis';
import { Types } from 'mongoose';

/** Meeting Result enum define */
export enum MeetingResult { 
  NONE="",
  SUCCESSFUL = "successful", 
  FAILED = "failed", 
  FOLLOW_UP = "follow up",
}

/** meeting status enum define */
export enum MeetingStatus { 
    /** meeting available for assign */
    AVAILABLE = "available", 

    /** meeting already booked */
    BOOKED = "booked",

    /** meeting passed */
    OUTDATED = "outdated",  
}

/** meeting response status ,same define as google calendar event define {@link calendar_v3.Schema$Event} */
export enum MeetingResponseStatus {  
    NEEDS_ACTION="needsAction",// - The attendee has not responded to the invitation.
    DECLINED="declined",// - The attendee has declined the invitation.
    TENTATIVE="tentative",// - The attendee has tentatively accepted the invitation.
    ACCEPTED="accepted",// - The attendee has accepted the invitation.
}

export const enum MeetingAction{
  CREATED = "created",
  UPDATED = "updated",  
  BOOKED = "booked",  
  DELETED = "deleted",  

  SYNC = "sync",
  ASSIGN_STAFF = "staff",
  ASSIGN_RESULT = "result",
  ASSIGN_STATUS = "status",
  RESET = "reset" ,
}

export interface IMeeting  {  
    client?: Types.ObjectId;
    start: Date;
    end: Date;
    summary: string ;
    description?: string;
    status? :MeetingStatus|string ; 
    result? :MeetingResult ; 

    eventId?:string ;   
 
    email: string ;
    phone?: string ;

    sync_at?: Date ;
    updated_at?: Date;
    created_at?: Date;

    serviceStaff?: Types.ObjectId;
    responseStatus?: MeetingResponseStatus ;
    /**
     * email
     * responseStatus
     * 
     */
    attendees?: Array<calendar_v3.Schema$EventAttendee> ; 
    // id: string ;
}

export type IEventResource = calendar_v3.Schema$Event ; 

export interface IGoogleEvent {  
    start: Date ;  
    end: Date ;
    event : IEventResource;
    updated_at?:Date;
    created_at?:Date;
}
