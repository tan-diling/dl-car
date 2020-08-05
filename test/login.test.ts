// import 'reflect-metadata';

require('module-alias/register');
import * as request from 'supertest';

import { BackendServer } from '@app/loaders/server';

import { LoginController } from 'src/modules/login';
import { assert } from 'chai';

describe('login module ', () => {

  const server = BackendServer.getInstance();

  before(async () => {
    server.register('init login controller',
      async () => {
        server.registerController(
          LoginController,
        );
      },
      1,
    );
      await server.start(true);
      console.log('server start .....')
  });

  describe('#login', () => {

      it('user login', async () => {

        await request(server.httpServer)
              .post('/api/login')
              .send({email:"admin@admin.com",password:"12345678",device:"chrome"})
              .expect('Content-Type', /json/)
              .expect(200)
              .expect((res)=>{
                assert(res.body.role =='admin');
              }) ;
              
      });

      it('user login password error', async() => {

        await request(server.httpServer)
            .post('/api/login')
            .send({email:"admin@admin.com",password:"2345678",device:"chrome"})
            // .expect('Content-Type', /json/)
            .expect(404)　;
            
    });


  });


});