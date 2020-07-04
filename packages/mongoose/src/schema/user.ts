import { Schema, Model,modelNames , model, Document, Types } from 'mongoose';
export  const UserSchema =  new Schema({            
    email: String,
    name: String,
    role: String,
    password : String ,
    
  } );
  