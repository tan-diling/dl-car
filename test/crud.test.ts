// // import 'reflect-metadata';

// require('module-alias/register');
// import * as request from 'supertest';

// import { BackendServer } from 'src/modules/web';

// import { assert } from 'chai';

// /** define schema  */
// import { Schema, Model, modelNames, model, Document, Types } from 'mongoose';
// export const schema = new Schema({
//   name: String,
//   owner: Types.ObjectId,
// });

// /** define interface  */
// interface IGroup {
//   name: string;
//   owner: Types.ObjectId;
// }

// const GroupModel = model<IGroup & Document>('group', schema);

// /** define dto */
// import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, Length } from 'class-validator';
// export class GroupDto {
//   @IsString()
//   @Length(3, 30)
//   name: string;
// }
// /** main  */
// import { createCRUDController } from '@app/modules/query';


// /** add 1,db_startup; 2, register crud controller ,3, start  server*/
// async function run() {

//   const server = BackendServer.getInstance();

//   const groupController = createCRUDController("/group", GroupModel);


//   server.registerController(groupController);

//   server.start(true);
// }




// describe('login module ', () => {

//   const server = BackendServer.getInstance();

//   before(async () => {
//     await run();

//   });

//   describe('#crud group', () => {
//     let groupId = null;
//     it('group create', async () => {

//       await request(server.httpServer)
//         .post('/api/group')
//         .send({ name: "group1#" })
//         .expect('Content-Type', /json/)
//         .expect(200)
//         .expect(res => {
//           groupId = res.body._id;
//           console.log("groupId "+groupId) ;
//           assert(res.body.name == "group1#");
//         });

//     });

//     it('group get', async () => {

//       await request(server.httpServer)
//         .get('/api/group/')
//         .expect('Content-Type', /json/)
//         .expect(200)
//         ;

//     });

//     it('group update', async () => {

//       await request(server.httpServer)
//         .patch('/api/group/' + groupId)
//         .send({ name: "group1#patch" })
//         // .expect('Content-Type', /json/)
//         .expect(200);

//     });

//     it.skip('group delete', async () => {

//       await request(server.httpServer)
//         .delete('/api/group/' + groupId)
//         // .send({name:"group1#patch"})
//         // .expect('Content-Type', /json/)
//         .expect(200);

//     });


//   });


// });
