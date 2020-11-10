/**
 * in project
 * ```
 * npm install ./packages/login
 * ```
 */
require('dotenv').config();
import * as moduleAlias from 'module-alias';
// import * as path from 'path';
// const IS_DEV = process.env.NODE_ENV === 'development';
// const rootPath = path.resolve(__dirname);
// const rootPathDev = path.resolve(rootPath, 'src');
// const rootPathProd = path.resolve(rootPath, 'dist/src');
moduleAlias.addAliases({
  '@app': __dirname + '/../src',
});

import { sendMail } from '@app/modules/mail';


async function run() {
  const receiver = 'dealing790@gmail.com';
  const ret = await sendMail({ email: receiver, html: `<h1>new Date().toISOString()</h1>`, subject: 'html mail test' });

  console.log(`${receiver} result:${ret}`);
};

run()
