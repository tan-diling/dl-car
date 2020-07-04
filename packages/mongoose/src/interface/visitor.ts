/**
 * Visitor Interface define, separated file for schema model
 * @packageDocumentation 
 */


import { Schema, Model, model, Document, Types } from 'mongoose';

export interface IVisitor {
  /**
   *  用户名
   */
  device: string;  
  token: string ;

  ip?: string;
  /** user id ,{@link Client} */
  user?: Types.ObjectId;
}

