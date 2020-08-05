// import 'reflect-metadata';

require('module-alias/register');

// import { db_startup } from '@app/modules/query';

import { BackendServer } from '@app/loaders/server';

import { LoginController } from 'src/modules/login';

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