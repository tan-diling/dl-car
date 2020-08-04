/**
 * in project
 * ```
 * npm install ./packages/login
 * ```
 */

require('module-alias/register');

import { BackendServer } from 'src/modules/web';
import * as request from 'supertest';
// const request = require('supertest');
// @JsonController('User')
// class UserController{
//     @Get()
//     async get() {
//         return {_id:1,name:"as"} ;
//     }
// }

// server.registerController(UserController);

// server.start(true) ;


describe('web module ', () => {

    const server = BackendServer.getInstance();

    before(async () => {
        await server.start(true);
        console.log('server start .....')
    });

    describe('#get', () => {

        it('respond body text begin hello', async () => {

            request(server.httpServer)
                .get('/')
                .expect(200)
                .expect(/^hello/)
                .end(function (err, res) {
                    if (err) throw err;
                });
        });


    });


});
