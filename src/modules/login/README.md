### dealing backend login module
*********************************************************************

design for web api framework include 

## local module depend
- core

## api
- /login
- /refresh-token

## default user schema
- user
  - _id
  - email
  - name
  - password
  - emailValidated
  - ...
- login-session
  - _id
  - device
  - refreshToken
  - accessTime
  - refreshTime
  - user: ref(user)
  

## test login module script

```
ts-node ./test/login.test.ts
```
###  code
```ts
// import 'reflect-metadata';

require('module-alias/register');

import { db_startup } from '@packages/mongoose';

import { BackendServer } from '@packages/web';

import { LoginController } from '@packages/login';

async function run() {
  // create web server  
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
```
