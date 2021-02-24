/**
 * in project
 * ```
 * npm install ./packages/login
 * ```
 */
require('dotenv').config();
import * as moduleAlias from 'module-alias';

moduleAlias.addAliases({
  '@app': __dirname + '/../src',
});

import { User,UserModel } from '../src/models/user';

import { db_startup } from '../src/loaders/startup/database';


async function run() {
    await db_startup() ;

  const newUser = {
      phone:"13771117997",
      name:"Uoo1",
  };

  const ret = await UserModel.register(newUser,"12345678");
  
  console.log(` result:${ret}`);


  
};

run()