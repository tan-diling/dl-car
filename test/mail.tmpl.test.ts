/**
 * in project
 * ```
 * npm install ./packages/login
 * ```
 */
require('dotenv').config();
import * as moduleAlias from 'module-alias';
import * as pug from 'pug';
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
  const file = './template/entity.pug';

  const ret = pug.renderFile(file, { user: { name: "site admin" }, action: "updated" });

  console.log(`result:\n${ret}`);
};

run()
