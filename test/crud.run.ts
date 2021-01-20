// /**
//  * in project
//  * ```
//  * npm install ./packages/login
//  * ```
//  */

// require('module-alias/register') ;



// /** define schema  */
// import { Schema, Model,modelNames , model, Document, Types } from 'mongoose';
// export  const schema =  new Schema({            
//     name: String,
//     owner: Types.ObjectId,
//   } );

//  /** define interface  */ 
//  interface IGroup {
//     name: string;
//     owner: Types.ObjectId;
//   }

//   const GroupModel = model<IGroup& Document>('group',schema) ;

// /** define dto */  
// import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, Length } from 'class-validator';
// export class GroupDto{
//     @IsString()
//     @Length(3,30)
//     name: string;    
// }
// /** main  */
// import {createCRUDController } from '@app/modules/query';

// import {BackendServer } from 'src/modules/web';

// /** add 1,db_startup; 2, register crud controller ,3, start  server*/
// async function run() {
//     // await db_startup();

//     const server = BackendServer.getInstance() ;

//     const groupController = createCRUDController("/group",GroupModel);


//     server.registerController(groupController);

//     server.start() ;
// }

// run() ;