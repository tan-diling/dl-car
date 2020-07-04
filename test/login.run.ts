// import 'reflect-metadata';

require('module-alias/register');

import { db_startup } from '@packages/mongoose';

import { BackendServer } from '@packages/web';

import { LoginController } from '@packages/login';

async function run() {
  
  // create server
  const server = BackendServer.getInstance();

  // register login controller
  server.register('init login controller',
    async () => {
      server.registerController(
        LoginController,
      );
    },
    1,
  );


  // start server
  server.start();
}

run();