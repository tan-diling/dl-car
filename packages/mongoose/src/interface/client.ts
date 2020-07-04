/**
 * Client Interface define, separated file for schema model
 * @packageDocumentation 
 */

import { Schema, Model, model, Document, Types } from 'mongoose';

export enum ClientType {  
//     "Inquired",
//  "got_info",
//  "Appointment set", 
// "Show up for appointment", 
// "customer",
// "not customer",
  GUEST = 'GUEST',
  CUSTOMER = 'CUSTOMER',
  PROSPECTED ='PROSPECTED',

  // OPERATOR = 'OPERATOR',
}

export interface IName {
  first: string;
  middle: string;
  last: string;
}

export interface IClient {
  /**
   *  用户名
   */
  name: IName;
  email: string;
  timezone: number;
  phone: string;
  company: string;

  title: string;
  industry: string;
  source: string;

  staff: Types.ObjectId ;
  
  type: ClientType ;

  notes: Array<{
    title:string,
    content:string,
    created_at? :Date,
    updated_at? :Date,
  }>;

  created_at? :Date;
  updated_at? :Date;

 
}

